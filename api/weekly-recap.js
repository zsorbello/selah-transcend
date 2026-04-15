// api/weekly-recap.js — Growth+ weekly recap via Claude; stores selah:recap:<email>
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

async function callAnthropicRecap(prompt) {
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
      system:
        "You write warm, dignified spiritual companionship prose for the Selah app. Never sound clinical. No bullet lists unless essential. Write exactly 3–4 short paragraphs.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    console.error("Anthropic error:", response.status, JSON.stringify(data));
    throw new Error(data?.error?.message || "Anthropic request failed");
  }
  const text = (data.content || []).map((b) => b.text || "").join("").trim();
  return text;
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
    if (tier !== "growth" && tier !== "deep") {
      return res.status(403).json({ error: "Weekly recap is available for Growth and Deep subscribers only." });
    }

    const recentSessions = sessionsInLastDays(userData.sessionHistory, 7);
    const recentSaved = savedReflectionsInLastDays(userData.savedReflections, 7);
    if (recentSessions.length === 0 && recentSaved.length === 0) {
      return res.status(400).json({ error: "No reflection history in the last 7 days." });
    }

    const name = userData.userName || userData.name || onboardingName(userData) || "friend";
    const blob = formatSessionsForPrompt(recentSessions.slice().reverse(), recentSaved.slice().reverse());

    const prompt = `Write a warm, personal weekly recap (3–4 paragraphs) for ${name}.

Their reflection notes from the last 7 days:

${blob}

Cover: what they seemed to work through, patterns you notice, growth you observe, and end with an encouraging word for the week ahead. Address them as "you." Do not mention AI, tiers, or this being generated.`;

    const recap = await callAnthropicRecap(prompt);

    const payload = {
      recap,
      email,
      tier,
      sessionCount: recentSessions.length,
      savedReflectionCount: recentSaved.length,
      weekEnding: new Date().toISOString().split("T")[0],
      generatedAt: new Date().toISOString(),
    };

    const recapKey = `selah:recap:${email}`;
    await redis("SET", recapKey, JSON.stringify(payload), "EX", 7776000);

    return res.status(200).json(payload);
  } catch (err) {
    console.error("weekly-recap error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}

function onboardingName(userData) {
  const o = userData?.onboardingAnswers;
  if (o && typeof o === "object" && o.name) return String(o.name);
  return "";
}
