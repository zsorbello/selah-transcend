// ═══════════════════════════════════════════════════════════
// SELAH STRIPE WEBHOOK — Receives payment events from Stripe
// ═══════════════════════════════════════════════════════════

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command, ...args) {
  const res = await fetch(`${REDIS_URL}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([command, ...args])
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// Map Stripe price amounts (in cents) to tier names
const PRICE_TO_TIER = {
  600: 'foundation',    // $6/mo
  1200: 'growth',       // $12/mo
  1500: 'deep',         // $15/mo
  5000: 'foundation',   // $50/yr
  8000: 'growth',       // $80/yr
  10000: 'deep',        // $100/yr
};

function getTierFromSubscription(subscription) {
  try {
    const item = subscription.items?.data?.[0];
    const amount = item?.price?.unit_amount || item?.plan?.amount;
    if (amount && PRICE_TO_TIER[amount]) return PRICE_TO_TIER[amount];
    const total = (amount || 0) * (item?.quantity || 1);
    if (PRICE_TO_TIER[total]) return PRICE_TO_TIER[total];
  } catch (e) {
    console.error('Error extracting tier from subscription:', e.message);
  }
  return 'foundation';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!REDIS_URL || !REDIS_TOKEN) {
    console.error('Missing Redis config');
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const event = req.body;

    if (!event || !event.type) {
      console.error('Invalid webhook payload');
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // ── checkout.session.completed ──
    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object;
      if (!session) return res.status(400).json({ error: 'Missing session data' });

      const checkoutId = session.client_reference_id;
      const customerEmail = session.customer_details?.email || session.customer_email;
      const amountTotal = session.amount_total;
      const tier = PRICE_TO_TIER[amountTotal] || 'foundation';

      if (checkoutId) {
        await redis('SET', `stripe:checkout:${checkoutId}`, JSON.stringify({
          tier, email: customerEmail, amount: amountTotal,
          confirmedAt: new Date().toISOString(), sessionId: session.id,
        }), 'EX', 86400);
      }

      if (customerEmail) {
        await redis('SET', `stripe:sub:${customerEmail.toLowerCase()}`, JSON.stringify({
          tier, amount: amountTotal, startedAt: new Date().toISOString(),
          stripeSessionId: session.id, status: 'active',
        }));
      }

      console.log(`Payment confirmed: ${customerEmail} → ${tier} ($${amountTotal / 100})`);
      return res.status(200).json({ received: true });
    }

    // ── customer.subscription.updated ──
    if (event.type === 'customer.subscription.updated') {
      const sub = event.data?.object;
      const customerEmail = sub?.customer_email || sub?.metadata?.email;
      if (!customerEmail) return res.status(200).json({ received: true });

      const status = sub.status;
      const tier = getTierFromSubscription(sub);
      const key = `stripe:sub:${customerEmail.toLowerCase()}`;

      if (status === 'active' || status === 'trialing') {
        await redis('SET', key, JSON.stringify({
          tier, status, updatedAt: new Date().toISOString(),
          stripeSubId: sub.id,
        }));
        console.log(`Subscription updated: ${customerEmail} → ${tier} (${status})`);
      } else if (status === 'past_due' || status === 'unpaid') {
        await redis('SET', key, JSON.stringify({
          tier, status, updatedAt: new Date().toISOString(),
          stripeSubId: sub.id,
        }));
        console.log(`Subscription ${status}: ${customerEmail}`);
      } else if (status === 'canceled') {
        await redis('DEL', key);
        console.log(`Subscription canceled: ${customerEmail}`);
      }

      return res.status(200).json({ received: true });
    }

    // ── customer.subscription.paused ──
    if (event.type === 'customer.subscription.paused') {
      const sub = event.data?.object;
      const customerEmail = sub?.customer_email || sub?.metadata?.email;
      if (customerEmail) {
        await redis('SET', `stripe:sub:${customerEmail.toLowerCase()}`, JSON.stringify({
          tier: getTierFromSubscription(sub), status: 'paused',
          pausedAt: new Date().toISOString(), stripeSubId: sub.id,
        }));
        console.log(`Subscription paused: ${customerEmail}`);
      }
      return res.status(200).json({ received: true });
    }

    // ── customer.subscription.resumed ──
    if (event.type === 'customer.subscription.resumed') {
      const sub = event.data?.object;
      const customerEmail = sub?.customer_email || sub?.metadata?.email;
      if (customerEmail) {
        const tier = getTierFromSubscription(sub);
        await redis('SET', `stripe:sub:${customerEmail.toLowerCase()}`, JSON.stringify({
          tier, status: 'active', resumedAt: new Date().toISOString(),
          stripeSubId: sub.id,
        }));
        console.log(`Subscription resumed: ${customerEmail} → ${tier}`);
      }
      return res.status(200).json({ received: true });
    }

    // ── customer.subscription.deleted ──
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data?.object;
      const customerEmail = sub?.customer_email || sub?.metadata?.email;
      if (customerEmail) {
        await redis('DEL', `stripe:sub:${customerEmail.toLowerCase()}`);
        console.log(`Subscription deleted: ${customerEmail}`);
      }
      return res.status(200).json({ received: true });
    }

    // Acknowledge other events
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
