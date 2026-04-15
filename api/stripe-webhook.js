// ═══════════════════════════════════════════════════════════
// SELAH STRIPE WEBHOOK — signature-verified and idempotent
// ═══════════════════════════════════════════════════════════
import crypto from 'crypto';

// For platforms that support per-route body parser config (e.g. Vercel/Next API routes)
export const config = { api: { bodyParser: false } };

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const WEBHOOK_TOLERANCE_SEC = 300;

async function redis(command, ...args) {
  const res = await fetch(`${REDIS_URL}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([command, ...args]),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

const PRICE_TO_TIER = {
  600: 'foundation',
  1200: 'growth',
  1500: 'deep',
  5000: 'foundation',
  8000: 'growth',
  10000: 'deep',
};

const PRICE_ID_TO_TIER = {
  [process.env.STRIPE_PRICE_FOUNDATION_MONTHLY || '']: 'foundation',
  [process.env.STRIPE_PRICE_GROWTH_MONTHLY || '']: 'growth',
  [process.env.STRIPE_PRICE_DEEP_MONTHLY || '']: 'deep',
  [process.env.STRIPE_PRICE_FOUNDATION_YEARLY || '']: 'foundation',
  [process.env.STRIPE_PRICE_GROWTH_YEARLY || '']: 'growth',
  [process.env.STRIPE_PRICE_DEEP_YEARLY || '']: 'deep',
};

function safeTimingEqualHex(a, b) {
  const ab = Buffer.from(String(a || ''), 'hex');
  const bb = Buffer.from(String(b || ''), 'hex');
  if (ab.length === 0 || bb.length === 0 || ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function parseStripeSignature(sigHeader) {
  const parsed = { t: null, v1: [] };
  if (!sigHeader) return parsed;
  for (const part of String(sigHeader).split(',')) {
    const [k, v] = part.split('=');
    if (!k || !v) continue;
    if (k.trim() === 't') parsed.t = parseInt(v, 10);
    if (k.trim() === 'v1') parsed.v1.push(v.trim());
  }
  return parsed;
}

function toRawString(body) {
  if (Buffer.isBuffer(body)) return body.toString('utf8');
  if (typeof body === 'string') return body;
  return null;
}

function verifyStripeSignature(rawBody, sigHeader) {
  if (!STRIPE_WEBHOOK_SECRET) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
  const { t, v1 } = parseStripeSignature(sigHeader);
  if (!t || !Array.isArray(v1) || v1.length === 0) throw new Error('Malformed Stripe-Signature header');
  const age = Math.abs(Math.floor(Date.now() / 1000) - t);
  if (age > WEBHOOK_TOLERANCE_SEC) throw new Error('Stripe signature timestamp out of tolerance');
  const payload = `${t}.${rawBody}`;
  const expected = crypto.createHmac('sha256', STRIPE_WEBHOOK_SECRET).update(payload, 'utf8').digest('hex');
  const ok = v1.some((candidate) => safeTimingEqualHex(expected, candidate));
  if (!ok) throw new Error('Stripe signature mismatch');
}

function normalizeEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  return e.includes('@') ? e : null;
}

function getTierFromSubscription(subscription) {
  const item = subscription?.items?.data?.[0];
  if (!item) return 'foundation';
  const priceId = item?.price?.id || item?.plan?.id || '';
  if (priceId && PRICE_ID_TO_TIER[priceId]) return PRICE_ID_TO_TIER[priceId];
  const amount = item?.price?.unit_amount ?? item?.plan?.amount ?? 0;
  const total = amount * (item?.quantity || 1);
  return PRICE_TO_TIER[total] || PRICE_TO_TIER[amount] || 'foundation';
}

async function fetchStripe(pathname, params = {}) {
  if (!STRIPE_SECRET_KEY) return null;
  const url = new URL(`https://api.stripe.com${pathname}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.append(k, v);
  const r = await fetch(url.toString(), { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } });
  if (!r.ok) return null;
  return r.json();
}

async function resolveCustomerEmail(customerId) {
  if (!customerId) return null;
  const customer = await fetchStripe(`/v1/customers/${encodeURIComponent(customerId)}`);
  return normalizeEmail(customer?.email);
}

async function resolveEmailFromSubscription(sub) {
  const direct = normalizeEmail(sub?.customer_email || sub?.metadata?.email || sub?.customer_details?.email);
  if (direct) return direct;
  const customerId = typeof sub?.customer === 'string' ? sub.customer : sub?.customer?.id;
  return resolveCustomerEmail(customerId);
}

async function persistSubscription(email, payload) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  await redis('SET', `stripe:sub:${normalized}`, JSON.stringify(payload));
  if (payload?.stripeSubId) await redis('SET', `stripe:subid:${payload.stripeSubId}`, normalized, 'EX', 7776000);
}

async function clearSubscription(email, stripeSubId) {
  const normalized = normalizeEmail(email);
  if (normalized) await redis('DEL', `stripe:sub:${normalized}`);
  if (stripeSubId) await redis('DEL', `stripe:subid:${stripeSubId}`);
}

/** Promotion / coupon codes that grant Founding Member status in app Settings */
const FOUNDING_COUPON_CODES = new Set(['FOUNDING50', 'FOUNDING10']);

function tokenMatchesFoundingCoupon(token) {
  if (token == null) return false;
  const u = String(token).trim().toUpperCase();
  return FOUNDING_COUPON_CODES.has(u);
}

function pushCouponLikeTokens(out, couponOrId) {
  if (couponOrId == null) return;
  if (typeof couponOrId === 'string') return void out.push(couponOrId);
  if (typeof couponOrId === 'object') {
    if (couponOrId.id) out.push(couponOrId.id);
    if (couponOrId.name) out.push(couponOrId.name);
  }
}

function pushPromotionLikeTokens(out, promoOrId) {
  if (promoOrId == null) return;
  if (typeof promoOrId === 'string') return void out.push(promoOrId);
  if (typeof promoOrId === 'object') {
    if (promoOrId.code) out.push(promoOrId.code);
    if (promoOrId.id) out.push(promoOrId.id);
  }
}

function discountEntriesFromObject(obj) {
  if (!obj || typeof obj !== 'object') return [];
  const d = obj.discounts;
  if (Array.isArray(d)) return d;
  if (d && Array.isArray(d.data)) return d.data;
  return [];
}

function collectDiscountTokensFromStripeObject(obj) {
  const out = [];
  if (!obj || typeof obj !== 'object') return out;
  if (obj.discount) {
    const d = obj.discount;
    if (typeof d === 'object' && d.coupon) pushCouponLikeTokens(out, d.coupon);
    if (typeof d === 'object' && d.promotion_code) pushPromotionLikeTokens(out, d.promotion_code);
  }
  for (const entry of discountEntriesFromObject(obj)) {
    if (typeof entry === 'string') out.push(entry);
    if (entry && typeof entry === 'object') {
      pushCouponLikeTokens(out, entry.coupon);
      pushPromotionLikeTokens(out, entry.promotion_code);
    }
  }
  return out;
}

function hasFoundingCouponInTokens(tokens) {
  return tokens.some(tokenMatchesFoundingCoupon);
}

async function mergeFoundingMemberIntoUserData(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  const key = `selah:user:${normalized}`;
  let data = {};
  try {
    const raw = await redis('GET', key);
    if (raw) data = JSON.parse(raw);
  } catch {
    data = {};
  }
  data.foundingMember = true;
  await redis('SET', key, JSON.stringify(data));
}

async function subscriptionHasFoundingCoupon(sub) {
  const local = collectDiscountTokensFromStripeObject(sub);
  if (hasFoundingCouponInTokens(local)) return true;
  if (!sub?.id) return false;
  const full = await fetchStripe(`/v1/subscriptions/${encodeURIComponent(sub.id)}`, {
    'expand[]': 'discounts.coupon',
  });
  if (!full) return false;
  return hasFoundingCouponInTokens(collectDiscountTokensFromStripeObject(full));
}

async function checkoutSessionHasFoundingCoupon(session) {
  const local = collectDiscountTokensFromStripeObject(session);
  if (hasFoundingCouponInTokens(local)) return true;
  if (!session?.id) return false;
  const full = await fetchStripe(`/v1/checkout/sessions/${encodeURIComponent(session.id)}`, {
    'expand[]': 'discounts.coupon',
  });
  if (!full) return false;
  return hasFoundingCouponInTokens(collectDiscountTokensFromStripeObject(full));
}

async function maybeSetFoundingMemberFromSubscription(sub) {
  const email = await resolveEmailFromSubscription(sub);
  if (!email) return;
  if (await subscriptionHasFoundingCoupon(sub)) await mergeFoundingMemberIntoUserData(email);
}

async function parseAndVerifyEvent(req) {
  const raw = toRawString(req.body) || toRawString(req.rawBody);
  if (!raw) throw new Error('Webhook requires raw request body for signature verification');
  verifyStripeSignature(raw, req.headers['stripe-signature']);
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON payload');
  }
}

async function markEventProcessed(eventId) {
  const key = `stripe:event:${eventId}`;
  const ok = await redis('SET', key, '1', 'NX', 'EX', 604800);
  return ok === 'OK';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!REDIS_URL || !REDIS_TOKEN) return res.status(500).json({ error: 'Database not configured' });

  try {
    const event = await parseAndVerifyEvent(req);
    if (!event?.id || !event?.type) return res.status(400).json({ error: 'Invalid Stripe event shape' });

    const firstTime = await markEventProcessed(event.id);
    if (!firstTime) return res.status(200).json({ received: true, duplicate: true });

    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object;
      if (!session) return res.status(400).json({ error: 'Missing checkout session object' });

      const checkoutId = session.client_reference_id;
      const customerEmail = normalizeEmail(session.customer_details?.email || session.customer_email);
      const amountTotal = session.amount_total || 0;
      let tier = PRICE_TO_TIER[amountTotal] || 'foundation';

      let stripeSubId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
      if (stripeSubId) {
        const sub = await fetchStripe(`/v1/subscriptions/${encodeURIComponent(stripeSubId)}`);
        if (sub) tier = getTierFromSubscription(sub);
      }

      if (checkoutId) {
        await redis('SET', `stripe:checkout:${checkoutId}`, JSON.stringify({
          tier,
          email: customerEmail,
          amount: amountTotal,
          confirmedAt: new Date().toISOString(),
          sessionId: session.id,
          stripeSubId: stripeSubId || null,
        }), 'EX', 86400);
      }

      if (customerEmail) {
        await persistSubscription(customerEmail, {
          tier,
          amount: amountTotal,
          startedAt: new Date().toISOString(),
          stripeSessionId: session.id,
          stripeSubId: stripeSubId || null,
          status: 'active',
        });
      }

      if (customerEmail && (await checkoutSessionHasFoundingCoupon(session))) {
        await mergeFoundingMemberIntoUserData(customerEmail);
      }

      return res.status(200).json({ received: true });
    }

    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.paused' || event.type === 'customer.subscription.resumed') {
      const sub = event.data?.object;
      if (!sub) return res.status(400).json({ error: 'Missing subscription object' });

      const email = await resolveEmailFromSubscription(sub);
      const status = sub.status || (event.type.endsWith('paused') ? 'paused' : 'active');
      const tier = getTierFromSubscription(sub);

      if (email) {
        if (status === 'canceled' || status === 'incomplete_expired') {
          await clearSubscription(email, sub.id);
        } else {
          await persistSubscription(email, {
            tier,
            status,
            updatedAt: new Date().toISOString(),
            stripeSubId: sub.id,
          });
        }
      }

      await maybeSetFoundingMemberFromSubscription(sub);
      return res.status(200).json({ received: true });
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data?.object;
      if (!sub) return res.status(400).json({ error: 'Missing subscription object' });
      let email = await resolveEmailFromSubscription(sub);
      if (!email && sub.id) email = normalizeEmail(await redis('GET', `stripe:subid:${sub.id}`));
      await clearSubscription(email, sub.id);
      return res.status(200).json({ received: true });
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data?.object;
      const subId = typeof invoice?.subscription === 'string' ? invoice.subscription : invoice?.subscription?.id;
      if (subId) {
        const mappedEmail = normalizeEmail(await redis('GET', `stripe:subid:${subId}`));
        if (mappedEmail) {
          await persistSubscription(mappedEmail, {
            ...(JSON.parse((await redis('GET', `stripe:sub:${mappedEmail}`)) || '{}')),
            status: 'past_due',
            stripeSubId: subId,
            updatedAt: new Date().toISOString(),
          });
        }
      }
      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true, ignored: true });
  } catch (error) {
    console.error('Stripe webhook error:', error?.message || error);
    return res.status(400).json({ error: 'Webhook processing failed', message: error?.message || 'unknown_error' });
  }
}
