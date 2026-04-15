// api/pattern-detection.js — Deep tier: Claude identifies patterns from 30 days of reflections
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

function normalizeEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  return e.includes("@") ? e : null;
}

function resolveTier(userData, stripeRaw) {
  let tier = String(userData?.tier || "free").toLowerCase();
  if (stripeRaw && typeof stripeRaw === "string") {
    try {
      const s = JSON.parse(stripeRaw);
      if (s?.tier) tier = String(s.tier).toLowerCase();
    } catch {
      /* keep */
    }
  }
  return tier;
}

function sessionsInLastDays(sessionHistory, days) {
  const arr = Array.isArray(sessionHistory) ? sessionHistory : [];
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return arr.filter((s) => {
    if (!s?.date) return false;
    const t = new Date(s.date).getTime();
    return !Number.isNaN(t) && t >= cutoff;
  });
}

function savedReflectionsInLastDays(savedReflections, days) {
  const arr = Array.isArray(savedReflections) ? savedReflections : [];
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return arr.filter((s) => {
    if (!s?.date) return false;
    const t = new Date(s.date).getTime();
    return !Number.isNaN(t) && t >= cutoff;
  });
}

function formatSessionsForPrompt(sessions, savedSlice) {
  const parts = [];
  sessions.forEach((s, i) => {
    const d = s.date ? new Date(s.date).toLocaleDateString("en-US") : "—";
    const lines = [
      `Session ${i + 1} (${d}) — ${s.category || "Reflection"}`,
      s.insight ? `Insight: ${s.insight}` : null,
      s.takeaway ? `Takeaway: ${s.takeaway}` : null,
      s.action ? `Action: ${s.action}` : null,
    ].filter(Boolean);
    parts.push(lines.join("\n"));
  });
  savedSlice.forEach((s, i) => {
    const d = s.date ? new Date(s.date).toLocaleDateString("en-US") : "—";
    const summary = s.aiSummary || [s.insight, s.takeaway].filter(Boolean).join(" ");
    if (!summary) return;
    parts.push(`Saved reflection ${i + 1} (${d}) — ${s.category || "Reflection"}\n${summary}`);
  });
  return parts.join("\n\n");
}

function parsePatternsJson(text) {
  const t = String(text || "").trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1].trim() : t;
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Expected JSON array");
  return parsed
    .map((p) => ({
      patternName: String(p.patternName || p.name || "").trim(),
      description: String(p.description || "").trim(),
      insight: String(p.insight || "").trim(),
    }))
    .filter((p) => p.patternName && p.description && p.insight)
    .slice(0, 3);
}

async function callAnthropicPatterns(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: `You analyze reflection notes for the Selah app. Respond with ONLY valid JSON: an array of 2–3 objects. Each object must have:
- "patternName": short label (string)
- "description": 2–4 sentences on what you've noticed (string)
- "insight": one sentence of compassionate insight (string)
No markdown, no prose outside the JSON array.`,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    console.error("Anthropic error:", response.status, JSON.stringify(data));
    throw new Error(data?.error?.message || "Anthropic request failed");
  }
  const text = (data.content || []).map((b) => b.text || "").join("").trim();
  return parsePatternsJson(text);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: "Database not configured" });
  }

  const email = normalizeEmail(req.body?.email);
  if (!email) return res.status(400).json({ error: "Valid email required" });

  try {
    const userKey = `selah:user:${email}`;
    const rawUser = await redis("GET", userKey);
    if (!rawUser) return res.status(404).json({ error: "User data not found" });

    let userData = {};
    try {
      userData = JSON.parse(rawUser);
    } catch {
      return res.status(500).json({ error: "Invalid user data" });
    }

    let stripeRaw = null;
    try {
      stripeRaw = await redis("GET", `stripe:sub:${email}`);
    } catch {
      stripeRaw = null;
    }

    const tier = resolveTier(userData, stripeRaw);
    if (tier !== "deep") {
      return res.status(403).json({ error: "Pattern detection is available for Deep tier subscribers only." });
    }

    const recentSessions = sessionsInLastDays(userData.sessionHistory, 30);
    const recentSaved = savedReflectionsInLastDays(userData.savedReflections, 30);
    if (recentSessions.length === 0 && recentSaved.length === 0) {
      return res.status(400).json({ error: "No reflection history in the last 30 days." });
    }

    const blob = formatSessionsForPrompt(recentSessions.slice().reverse(), recentSaved.slice().reverse());
    const prompt = `Here are this user's AI reflection session summaries from roughly the last 30 days (most recent first). Identify 2–3 meaningful patterns in what they have been carrying, feeling, and working through.

${blob}`;

    const patterns = await callAnthropicPatterns(prompt);

    return res.status(200).json({
      email,
      tier,
      sessionCount: recentSessions.length,
      savedReflectionCount: recentSaved.length,
      generatedAt: new Date().toISOString(),
      patterns,
    });
  } catch (err) {
    console.error("pattern-detection error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}
