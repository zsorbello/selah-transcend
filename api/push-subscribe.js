// ═══════════════════════════════════════════════════════════════
// SELAH PUSH SUBSCRIBE API — Web Push subscription management via Upstash Redis
// ═══════════════════════════════════════════════════════════════

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

function hashEndpoint(endpoint) {
  let hash = 0;
  for (let i = 0; i < endpoint.length; i++) {
    const char = endpoint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!REDIS_URL || !REDIS_TOKEN) {
    console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    if (req.method === 'POST') {
      const { subscription, userId, email } = req.body;
      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Valid subscription required' });
      }
      const key = `push:${hashEndpoint(subscription.endpoint)}`;
      const data = { subscription, userId: userId || 'anon', email: email || '', createdAt: new Date().toISOString() };
      await redis('SET', key, JSON.stringify(data), 'EX', 7776000);
      await redis('SADD', 'push:subscribers', key);
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { endpoint } = req.body;
      if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint required' });
      }
      const key = `push:${hashEndpoint(endpoint)}`;
      await redis('DEL', key);
      await redis('SREM', 'push:subscribers', key);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Push subscribe error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
