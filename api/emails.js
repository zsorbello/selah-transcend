// api/emails.js — Handles welcome emails + trial reminder cron
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!RESEND_KEY || !REDIS_URL) return res.status(500).json({ error: "Missing config" });

  async function redis(cmd, ...args) {
    const r = await fetch(REDIS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify([cmd, ...args])
    });
    return (await r.json()).result;
  }

  const action = req.query.action || req.body?.action;

  // ═══════════════════════════════════════════════════════
  // WELCOME EMAIL (POST with action=welcome)
  // ═══════════════════════════════════════════════════════
  if (action === "welcome" && req.method === "POST") {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });

    try {
      const already = await redis("GET", `selah:welcome:${email.toLowerCase()}`);
      if (already) return res.status(200).json({ ok: true, already: true });

      const userName = name || "friend";

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Selah <noreply@selah-transcend.com>",
          to: email,
          subject: `Welcome to Selah, ${userName}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#2C2C2A;background:#F5F1E8;">
              <div style="text-align:center;margin-bottom:32px;">
                <div style="font-size:32px;margin-bottom:12px;">✦</div>
                <h1 style="font-size:22px;font-weight:normal;color:#2C2C2A;margin:0 0 8px;">
                  Welcome to Selah, ${userName}.
                </h1>
                <p style="color:#6B6B66;font-size:13px;font-style:italic;line-height:1.8;margin:0;">
                  You just gave yourself something rare: a place to be honest.
                </p>
              </div>

              <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E8E4DC;margin-bottom:24px;">
                <p style="color:#2C2C2A;font-size:14px;line-height:1.9;margin:0 0 16px;">
                  Selah is yours now. Here's how to make the most of your free trial:
                </p>
                <div style="margin-bottom:12px;">
                  <p style="color:#A8B5A2;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Start here</p>
                  <p style="color:#2C2C2A;font-size:13px;line-height:1.8;margin:0;">
                    Open Selah and tap <strong>Reflect</strong>. Talk about whatever's on your mind. No rules. No wrong answers.
                  </p>
                </div>
                <div style="margin-bottom:12px;">
                  <p style="color:#C4A86B;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Build the habit</p>
                  <p style="color:#2C2C2A;font-size:13px;line-height:1.8;margin:0;">
                    Try a 2-minute <strong>Quick Check-in</strong> each morning. It takes less time than scrolling, and it actually helps.
                  </p>
                </div>
                <div>
                  <p style="color:#9A8E80;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">When it's heavy</p>
                  <p style="color:#2C2C2A;font-size:13px;line-height:1.8;margin:0;">
                    Use <strong>Breathe</strong> to calm your nervous system first. Then reflect. The order matters.
                  </p>
                </div>
              </div>

              <div style="text-align:center;margin-bottom:24px;">
                <a href="https://selah-transcend.com" style="display:inline-block;background:#A8B5A2;color:#fff;text-decoration:none;padding:14px 32px;border-radius:3px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-family:Georgia,serif;font-style:italic;">
                  Open Selah
                </a>
              </div>

              <p style="color:#6B6B66;font-size:11px;font-style:italic;text-align:center;line-height:1.8;margin:0;">
                You have 7 days to explore. After that, your Notebook, Breathing, and Crisis Help stay free forever.
              </p>

              <div style="border-top:1px solid #E8E4DC;margin-top:32px;padding-top:16px;text-align:center;">
                <p style="color:#9A8E80;font-size:10px;font-style:italic;margin:0;">
                  Selah — Be still and know.
                </p>
              </div>
            </div>
          `
        })
      });

      await redis("SET", `selah:welcome:${email.toLowerCase()}`, "sent", "EX", 7776000);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Welcome email error:", err);
      return res.status(500).json({ error: "Failed to send" });
    }
  }

  // ═══════════════════════════════════════════════════════
  // TRIAL REMINDER (GET cron with action=trial-reminder)
  // ═══════════════════════════════════════════════════════
  if (action === "trial-reminder") {
    const secret = req.headers['authorization']?.replace('Bearer ', '') || req.query.secret;
    if (secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const keys = await redis("KEYS", "selah:trial:*");
      if (!keys || keys.length === 0) {
        return res.status(200).json({ ok: true, sent: 0, message: "No trials found" });
      }

      let sent = 0;
      const now = Date.now();
      const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
      const sixDaysMs = 6 * 24 * 60 * 60 * 1000;

      for (const key of keys) {
        try {
          const raw = await redis("GET", key);
          if (!raw) continue;
          const data = JSON.parse(raw);

          const elapsed = now - data.trialStart;
          if (elapsed < fiveDaysMs || elapsed > sixDaysMs) continue;
          if (data.reminded) continue;

          const subKey = `stripe:sub:${data.email.toLowerCase()}`;
          const sub = await redis("GET", subKey);
          if (sub) {
            const subData = JSON.parse(sub);
            if (subData.tier && subData.tier !== "free") continue;
          }

          const name = data.name || "friend";

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "Selah <noreply@selah-transcend.com>",
              to: data.email,
              subject: `${name}, your Selah trial ends in 2 days`,
              html: `
                <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#2C2C2A;background:#F5F1E8;">
                  <div style="text-align:center;margin-bottom:32px;">
                    <div style="font-size:32px;margin-bottom:12px;">✦</div>
                    <h1 style="font-size:20px;font-weight:normal;color:#2C2C2A;margin:0 0 8px;">
                      Your trial ends in 2 days.
                    </h1>
                    <p style="color:#6B6B66;font-size:13px;font-style:italic;line-height:1.8;margin:0;">
                      Just a heads up — your free access to Selah's full features expires soon.
                    </p>
                  </div>

                  <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E8E4DC;margin-bottom:24px;">
                    <p style="color:#2C2C2A;font-size:14px;line-height:1.9;margin:0 0 16px;">
                      After your trial, you'll always keep:
                    </p>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                      <span style="color:#A8B5A2;">✓</span>
                      <span style="color:#2C2C2A;font-size:13px;">Your Notebook — always free</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                      <span style="color:#A8B5A2;">✓</span>
                      <span style="color:#2C2C2A;font-size:13px;">Guided Breathing — always free</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
                      <span style="color:#A8B5A2;">✓</span>
                      <span style="color:#2C2C2A;font-size:13px;">Crisis Help — always free</span>
                    </div>

                    <div style="border-top:1px solid #E8E4DC;padding-top:16px;">
                      <p style="color:#2C2C2A;font-size:14px;line-height:1.9;margin:0 0 8px;">
                        To keep AI reflection sessions, daily anchors, assessments, and everything else — subscribe starting at <strong>$6/month</strong>.
                      </p>
                    </div>
                  </div>

                  <div style="text-align:center;margin-bottom:24px;">
                    <a href="https://selah-transcend.com" style="display:inline-block;background:#A8B5A2;color:#fff;text-decoration:none;padding:14px 32px;border-radius:3px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-family:Georgia,serif;font-style:italic;">
                      Open Selah
                    </a>
                  </div>

                  <p style="color:#6B6B66;font-size:11px;font-style:italic;text-align:center;line-height:1.8;margin:0;">
                    No pressure. Selah will be here whenever you're ready.
                  </p>

                  <div style="border-top:1px solid #E8E4DC;margin-top:32px;padding-top:16px;text-align:center;">
                    <p style="color:#9A8E80;font-size:10px;font-style:italic;margin:0;">
                      Selah — Be still and know.
                    </p>
                  </div>
                </div>
              `
            })
          });

          data.reminded = true;
          await redis("SET", key, JSON.stringify(data), "EX", 604800);
          sent++;
        } catch (err) {
          console.error(`Error processing ${key}:`, err.message);
        }
      }

      return res.status(200).json({ ok: true, sent, checked: keys.length });
    } catch (err) {
      console.error("Trial reminder error:", err);
      return res.status(500).json({ error: "Failed" });
    }
  }

  // ═══════════════════════════════════════════════════════
  // INACTIVE USER NUDGE (cron with action=inactive-nudge)
  // ═══════════════════════════════════════════════════════
  if (action === "inactive-nudge") {
    const secret = req.headers['authorization']?.replace('Bearer ', '') || req.query.secret;
    if (secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const keys = await redis("KEYS", "selah:active:*");
      if (!keys || keys.length === 0) {
        return res.status(200).json({ ok: true, sent: 0, message: "No active users found" });
      }

      let sent = 0;
      const now = Date.now();
      const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
      const tenDaysMs = 10 * 24 * 60 * 60 * 1000;

      for (const key of keys) {
        try {
          const raw = await redis("GET", key);
          if (!raw) continue;
          const data = JSON.parse(raw);

          const elapsed = now - data.time;
          // Only nudge if inactive 5-10 days (not brand new, not ancient)
          if (elapsed < fiveDaysMs || elapsed > tenDaysMs) continue;

          // Don't nudge if already nudged
          const nudgeKey = `selah:nudged:${data.email.toLowerCase()}`;
          const alreadyNudged = await redis("GET", nudgeKey);
          if (alreadyNudged) continue;

          const name = data.name || "friend";

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "Selah <noreply@selah-transcend.com>",
              to: data.email,
              subject: `${name}, don't let the work stop`,
              html: `
                <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#2C2C2A;background:#F5F1E8;">
                  <div style="text-align:center;margin-bottom:32px;">
                    <div style="font-size:32px;margin-bottom:12px;">✦</div>
                    <h1 style="font-size:20px;font-weight:normal;color:#2C2C2A;margin:0 0 8px;">
                      You started something.
                    </h1>
                    <p style="color:#6B6B66;font-size:13px;font-style:italic;line-height:1.8;margin:0;">
                      Growth doesn't happen on its own. It takes showing up — even when you don't feel like it.
                    </p>
                  </div>

                  <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E8E4DC;margin-bottom:24px;">
                    <p style="color:#2C2C2A;font-size:14px;line-height:1.9;margin:0 0 16px;">
                      It's been a few days. That's not failure — that's just life getting loud. But the clarity you're building requires consistency.
                    </p>
                    <p style="color:#2C2C2A;font-size:14px;line-height:1.9;margin:0 0 16px;">
                      Two minutes. One reflection. That's all it takes to get back on track.
                    </p>
                    <div style="border-left:3px solid #A8B5A2;padding-left:16px;margin:16px 0;">
                      <p style="color:#6B6B66;font-size:13px;font-style:italic;line-height:1.8;margin:0;">
                        "The man who moves a mountain begins by carrying away small stones."
                      </p>
                      <p style="color:#9A8E80;font-size:11px;font-style:italic;margin:6px 0 0;">— Confucius</p>
                    </div>
                  </div>

                  <div style="text-align:center;margin-bottom:24px;">
                    <a href="https://selah-transcend.com" style="display:inline-block;background:#A8B5A2;color:#fff;text-decoration:none;padding:14px 32px;border-radius:3px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-family:Georgia,serif;font-style:italic;">
                      Get Back In
                    </a>
                  </div>

                  <p style="color:#6B6B66;font-size:11px;font-style:italic;text-align:center;line-height:1.8;margin:0;">
                    No guilt. No pressure. Just show up.
                  </p>

                  <div style="border-top:1px solid #E8E4DC;margin-top:32px;padding-top:16px;text-align:center;">
                    <p style="color:#9A8E80;font-size:10px;font-style:italic;margin:0;">
                      Selah — Be still and know.
                    </p>
                  </div>
                </div>
              `
            })
          });

          // Mark as nudged — don't send again for 30 days
          await redis("SET", nudgeKey, "sent", "EX", 2592000);
          sent++;
        } catch (err) {
          console.error(`Error processing ${key}:`, err.message);
        }
      }

      return res.status(200).json({ ok: true, sent, checked: keys.length });
    } catch (err) {
      console.error("Inactive nudge error:", err);
      return res.status(500).json({ error: "Failed" });
    }
  }

  return res.status(400).json({ error: "Missing or invalid action. Use ?action=welcome, ?action=trial-reminder, or ?action=inactive-nudge" });
}
