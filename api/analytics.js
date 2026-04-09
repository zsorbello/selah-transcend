// api/analytics.js — Event tracking + dashboard data
// Uses Upstash Redis for storage

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  async function redis(cmd, ...args) {
    const r = await fetch(`${UPSTASH_URL}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify([cmd, ...args])
    });
    const data = await r.json();
    return data.result;
  }

  try {
    // POST = log an event
    if (req.method === "POST") {
      const { event, data, userId } = req.body;
      if (!event) return res.status(400).json({ error: "Missing event" });

      const today = new Date().toISOString().split("T")[0];
      const hour = new Date().getHours();
      const entry = JSON.stringify({
        event,
        data: data || {},
        userId: userId || "anon",
        time: Date.now(),
        hour
      });

      // Store event in a daily list
      await redis("RPUSH", `analytics:events:${today}`, entry);
      // Expire after 90 days
      await redis("EXPIRE", `analytics:events:${today}`, 7776000);

      // Increment daily counters for fast reads
      await redis("HINCRBY", `analytics:counts:${today}`, event, 1);
      await redis("EXPIRE", `analytics:counts:${today}`, 7776000);

      // Track unique users per day
      if (userId && userId !== "anon") {
        await redis("SADD", `analytics:users:${today}`, userId);
        await redis("EXPIRE", `analytics:users:${today}`, 7776000);
      }

      // Track last active time for inactive user emails
      if (event === "app_open" && userId && userId.includes("@")) {
        await redis("SET", `selah:active:${userId.toLowerCase()}`, JSON.stringify({
          email: userId, name: data.name || "", time: Date.now()
        }), "EX", 7776000);
        // Store streak for push notifications
        if (data.streak && data.streak >= 3) {
          await redis("SET", `selah:streak:${userId.toLowerCase()}`, JSON.stringify({
            days: data.streak, updated: Date.now()
          }), "EX", 604800);
        }
      }

      // Special: register trial for reminder emails
      if (event === "trial_registered" && data.email) {
        const trialKey = `selah:trial:${data.email.toLowerCase()}`;
        const existing = await redis("GET", trialKey);
        if (!existing) {
          await redis("SET", trialKey, JSON.stringify({
            email: data.email,
            name: data.name || "friend",
            trialStart: data.trialStart || Date.now(),
            reminded: false
          }), "EX", 1209600); // 14 days TTL
        }
      }

      return res.status(200).json({ ok: true });
    }

    // GET = read analytics (admin only)
    if (req.method === "GET") {
      const { admin, range } = req.query;
      if (admin !== "selah2026") return res.status(403).json({ error: "Unauthorized" });

      const days = parseInt(range) || 30;
      const results = [];

      for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];

        // Get counts for this day
        const counts = await redis("HGETALL", `analytics:counts:${dateStr}`);
        // Get unique user count
        const userCount = await redis("SCARD", `analytics:users:${dateStr}`);

        // Parse HGETALL result (comes as [key, value, key, value, ...])
        const countsObj = {};
        if (counts && Array.isArray(counts)) {
          for (let j = 0; j < counts.length; j += 2) {
            countsObj[counts[j]] = parseInt(counts[j + 1]) || 0;
          }
        }

        results.push({
          date: dateStr,
          uniqueUsers: userCount || 0,
          events: countsObj
        });
      }

      // Get recent raw events for today (for live view)
      const today = new Date().toISOString().split("T")[0];
      const recentRaw = await redis("LRANGE", `analytics:events:${today}`, -50, -1);
      const recentEvents = (recentRaw || []).map(e => {
        try { return JSON.parse(e); } catch { return null; }
      }).filter(Boolean).reverse();

      return res.status(200).json({ days: results, recentEvents });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Analytics error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
