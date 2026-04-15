// api/admin.js — Admin aggregate stats from Upstash Redis (ADMIN_API_TOKEN required)
import crypto from "crypto";

const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN || "";

function constantTimeTokenMatch(expected, provided) {
  if (!expected || !provided) return false;
  const a = Buffer.from(String(expected));
  const b = Buffer.from(String(provided));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function extractAdminToken(req) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  const headerToken = req.headers["x-admin-token"];
  if (headerToken) return String(headerToken).trim();
  if (req.query?.adminToken) return String(req.query.adminToken).trim();
  return "";
}

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command, ...args) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify([command, ...args]),
  });
  const data = await res.json();
  if (data.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
  return data.result;
}

function hgetallToObject(hgetall) {
  const out = {};
  if (!hgetall || !Array.isArray(hgetall)) return out;
  for (let j = 0; j < hgetall.length; j += 2) {
    const k = hgetall[j];
    const v = hgetall[j + 1];
    out[k] = parseInt(v, 10) || 0;
  }
  return out;
}

function mergeCounts(target, source) {
  for (const [k, v] of Object.entries(source)) {
    target[k] = (target[k] || 0) + v;
  }
}

const ACTIVE_SUB_STATUSES = new Set(["active", "trialing", "past_due"]);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-token");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: "Database not configured" });
  }

  if (!ADMIN_API_TOKEN) {
    return res.status(500).json({ error: "Admin authentication not configured" });
  }

  const token = extractAdminToken(req);
  if (!constantTimeTokenMatch(ADMIN_API_TOKEN, token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    const rangeDays = Math.min(parseInt(req.query?.range, 10) || 90, 365);

    const userKeys = (await redis("KEYS", "selah:user:*")) || [];
    const totalUserCount = Array.isArray(userKeys) ? userKeys.length : 0;

    const dauToday = (await redis("SCARD", `analytics:users:${today}`)) || 0;

    const subKeys = (await redis("KEYS", "stripe:sub:*")) || [];
    const activeSubscribersByTier = { foundation: 0, growth: 0, deep: 0, other: 0 };

    for (const key of subKeys) {
      const raw = await redis("GET", key);
      if (!raw || typeof raw !== "string") continue;
      try {
        const sub = JSON.parse(raw);
        const status = String(sub.status || "").toLowerCase();
        if (!ACTIVE_SUB_STATUSES.has(status)) continue;
        const tier = String(sub.tier || "foundation").toLowerCase();
        if (tier === "foundation") activeSubscribersByTier.foundation += 1;
        else if (tier === "growth") activeSubscribersByTier.growth += 1;
        else if (tier === "deep") activeSubscribersByTier.deep += 1;
        else activeSubscribersByTier.other += 1;
      } catch {
        /* skip */
      }
    }

    let totalReflectionsCompleted = 0;
    const mergedEvents = {};
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const counts = await redis("HGETALL", `analytics:counts:${dateStr}`);
      const obj = hgetallToObject(counts);
      totalReflectionsCompleted += obj.session_complete || 0;
      mergeCounts(mergedEvents, obj);
    }

    const topFeaturesUsed = Object.entries(mergedEvents)
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      totalUserCount,
      activeSubscribersByTier,
      dailyActiveUsersToday: dauToday,
      totalReflectionsCompleted,
      analyticsRangeDays: rangeDays,
      topFeaturesUsed,
    });
  } catch (err) {
    console.error("admin analytics error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}
