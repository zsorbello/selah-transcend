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
      const {
        subscription,
        userId,
        email,
        dailyReminderHour,
        guidedPrayerEnabled,
        guidedPrayerHour,
        eveningPrayerEnabled,
        eveningPrayerHour,
        tzOffsetMinutes,
      } = req.body;
      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Valid subscription required' });
      }
      const key = `push:${hashEndpoint(subscription.endpoint)}`;
      let prev = {};
      try {
        const raw = await redis('GET', key);
        if (raw) prev = JSON.parse(raw);
      } catch (_) {}

      const data = {
        ...prev,
        subscription,
        userId: userId != null ? userId : (prev.userId || 'anon'),
        email: email != null ? email : (prev.email || ''),
        createdAt: prev.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (dailyReminderHour !== undefined && dailyReminderHour !== null) {
        const h = parseInt(String(dailyReminderHour), 10);
        if (!Number.isNaN(h) && h >= 0 && h <= 23) data.dailyReminderHour = h;
      }
      if (guidedPrayerEnabled !== undefined) data.guidedPrayerEnabled = !!guidedPrayerEnabled;
      if (guidedPrayerHour !== undefined && guidedPrayerHour !== null) {
        const h = parseInt(String(guidedPrayerHour), 10);
        if (!Number.isNaN(h) && h >= 0 && h <= 23) data.guidedPrayerHour = h;
      }
      if (eveningPrayerEnabled !== undefined) data.eveningPrayerEnabled = !!eveningPrayerEnabled;
      if (eveningPrayerHour !== undefined && eveningPrayerHour !== null) {
        const h = parseInt(String(eveningPrayerHour), 10);
        if (!Number.isNaN(h) && h >= 0 && h <= 23) data.eveningPrayerHour = h;
      }
      if (tzOffsetMinutes !== undefined && tzOffsetMinutes !== null && !Number.isNaN(Number(tzOffsetMinutes))) {
        data.tzOffsetMinutes = Number(tzOffsetMinutes);
      }

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
