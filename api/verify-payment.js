// ═══════════════════════════════════════════════════════════
// SELAH VERIFY PAYMENT — Checks if Stripe checkout was completed
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { id, email } = req.query;

    // Method 1: Verify by checkout ID (from client_reference_id)
    if (id) {
      const raw = await redis('GET', `stripe:checkout:${id}`);
      if (!raw) {
        return res.status(200).json({ verified: false, reason: 'still_processing' });
      }
      const data = JSON.parse(raw);
      return res.status(200).json({ verified: true, tier: data.tier, email: data.email });
    }

    // Method 2: Verify by email (check active subscription)
    if (email) {
      const raw = await redis('GET', `stripe:sub:${email.toLowerCase()}`);
      if (!raw) {
        return res.status(200).json({ verified: false, reason: 'No active subscription found for this email.' });
      }
      const data = JSON.parse(raw);
      return res.status(200).json({ verified: true, tier: data.tier, status: data.status });
    }

    return res.status(400).json({ error: 'Provide either checkout id or email' });

  } catch (error) {
    console.error('Verify payment error:', error.message);
    return res.status(500).json({ error: 'server_error' });
  }
}
