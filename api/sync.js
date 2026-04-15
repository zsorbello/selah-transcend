// /api/sync.js — User data sync + Prayer Wall

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = async (cmd) => {
  const r = await fetch(UPSTASH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  });
  const data = await r.json();
  if (data.error) {
    throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
  }
  return data;
};

const PRAYER_KEY = "selah:prayers";
const PRAYER_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
    return res.status(500).json({ error: "Database not configured" });
  }

  const action = req.query?.action;

  // ── PRAYER WALL ──────────────────────────────────────
  if (action === "prayer_get") {
    try {
      // Get all prayer IDs from sorted set (score = timestamp)
      const now = Date.now();
      const cutoff = now - PRAYER_TTL * 1000;
      // Remove expired prayers
      await redis(["ZREMRANGEBYSCORE", PRAYER_KEY + ":index", "-inf", cutoff]);
      // Get live prayer IDs newest first
      const ids = await redis(["ZREVRANGE", PRAYER_KEY + ":index", 0, 49, "WITHSCORES"]);
      const idList = (ids.result || []).filter((_, i) => i % 2 === 0);
      if (!idList.length) return res.status(200).json({ prayers: [] });

      // Fetch each prayer
      const prayers = [];
      for (const id of idList) {
        const d = await redis(["GET", `${PRAYER_KEY}:${id}`]);
        if (d.result) {
          try {
            const p = JSON.parse(d.result);
            prayers.push(p);
          } catch {}
        }
      }
      return res.status(200).json({ prayers });
    } catch (e) {
      return res.status(500).json({ prayers: [], error: e.message });
    }
  }

  if (action === "prayer_post" && req.method === "POST") {
    try {
      const { text } = req.body || {};
      if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ ok: false, error: "No text" });
      }
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const prayer = { id, text: text.trim().slice(0, 120), ts: Date.now(), flames: 0 };
      // Store prayer data
      await redis(["SET", `${PRAYER_KEY}:${id}`, JSON.stringify(prayer), "EX", PRAYER_TTL]);
      // Add to sorted set with timestamp as score
      await redis(["ZADD", PRAYER_KEY + ":index", prayer.ts, id]);
      return res.status(200).json({ ok: true, id });
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  }

  if (action === "prayer_flame" && req.method === "POST") {
    try {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ ok: false });
      const d = await redis(["GET", `${PRAYER_KEY}:${id}`]);
      if (!d.result) return res.status(404).json({ ok: false });
      const prayer = JSON.parse(d.result);
      prayer.flames = (prayer.flames || 0) + 1;
      // Preserve remaining TTL
      const ttlRes = await redis(["TTL", `${PRAYER_KEY}:${id}`]);
      const ttl = ttlRes.result > 0 ? ttlRes.result : PRAYER_TTL;
      await redis(["SET", `${PRAYER_KEY}:${id}`, JSON.stringify(prayer), "EX", ttl]);
      return res.status(200).json({ ok: true, flames: prayer.flames });
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  }

  // ── USER DATA SYNC ────────────────────────────────────
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ error: "No token" });

    const emailRes =
      (await redis(["GET", `auth:token:${token}`]))?.result ||
      (await redis(["GET", `selah:token:${token}`]))?.result;
    const email = emailRes;
    if (!email) return res.status(401).json({ error: "Invalid token" });

    const key = `selah:user:${email}`;

    if (req.method === "GET") {
      const d = await redis(["GET", key]);
      if (!d.result) return res.status(200).json({});
      try {
        const parsed = JSON.parse(d.result);
        return res.status(200).json({ data: parsed });
      } catch {
        return res.status(200).json({});
      }
    }

    if (req.method === "POST") {
      const { data } = req.body || {};
      if (!data) return res.status(400).json({ error: "No data" });
      await redis(["SET", key, JSON.stringify(data)]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Sync error:", err);
    return res.status(500).json({ error: err.message || "Sync failed" });
  }
}
