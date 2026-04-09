// ═══════════════════════════════════════════════════════════
// SELAH AUTH API — Email code login via Upstash Redis + Resend
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

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
  return token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!REDIS_URL || !REDIS_TOKEN) {
    console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { action, email, code, token } = req.body;

    // —— SEND CODE ——
    if (action === 'send-code') {
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
      }

      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) {
        return res.status(500).json({ error: 'Email service not configured' });
      }

      const loginCode = generateCode();
      // Store code in Redis with 10-minute expiry
      await redis('SET', `auth:code:${email.toLowerCase()}`, loginCode, 'EX', 600);

      // Send code via Resend
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Selah <noreply@selah-transcend.com>',
          to: [email.toLowerCase()],
          subject: `${loginCode} — Your Selah Login Code`,
          html: `
            <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:40px 32px;background:#F5F1E8;border-radius:12px;">
              <div style="text-align:center;margin-bottom:28px;">
                <h1 style="color:#2C2C2C;font-size:24px;font-weight:normal;margin:0 0 4px;letter-spacing:1px;">selah</h1>
                <p style="color:#8A9884;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0;">be still & know</p>
              </div>
              <div style="background:#fff;border-radius:10px;padding:28px;text-align:center;border:1px solid #e0ddd5;">
                <p style="color:#6B6B66;font-size:14px;font-style:italic;margin:0 0 20px;line-height:1.8;">
                  Your login code is:
                </p>
                <div style="background:#F7F7F5;border-radius:8px;padding:20px;margin-bottom:20px;border:1px solid #e0ddd5;">
                  <p style="color:#2C2C2C;font-size:36px;letter-spacing:12px;font-weight:bold;margin:0;font-family:monospace;">
                    ${loginCode}
                  </p>
                </div>
                <p style="color:#9E9E98;font-size:12px;font-style:italic;margin:0;line-height:1.8;">
                  This code expires in 10 minutes.<br>If you didn't request this, you can safely ignore it.
                </p>
              </div>
              <div style="text-align:center;margin-top:24px;">
                <p style="color:#8A9884;font-size:11px;font-style:italic;margin:0;">
                  Selah · selah-transcend.com
                </p>
              </div>
            </div>
          `,
        }),
      });

      if (!emailRes.ok) {
        const errData = await emailRes.json();
        console.error('Resend error:', emailRes.status, JSON.stringify(errData));
        return res.status(500).json({ error: 'Failed to send code' });
      }

      return res.status(200).json({ success: true });
    }

    // —— VERIFY CODE ——
    if (action === 'verify-code') {
      if (!email || !code) {
        return res.status(400).json({ error: 'Email and code required' });
      }

      const stored = await redis('GET', `auth:code:${email.toLowerCase()}`);
      if (!stored || stored !== code) {
        return res.status(401).json({ success: false, error: 'Invalid or expired code' });
      }

      // Code is valid — delete it so it can't be reused
      await redis('DEL', `auth:code:${email.toLowerCase()}`);

      // Generate session token with 30-day expiry
      const sessionToken = generateToken();
      await redis('SET', `auth:token:${sessionToken}`, email.toLowerCase(), 'EX', 2592000);

      // ── TRIAL LOCK ──────────────────────────────────────────────────
      // Store trialStart in Redis the first time a user logs in.
      // Server is authoritative — this prevents localStorage clearing abuse.
      const trialKey = `selah:trial:${email.toLowerCase()}`;
      let serverTrialStart = await redis('GET', trialKey);
      if (!serverTrialStart && req.body.trialStart) {
        // First login — persist whatever trialStart the client has
        serverTrialStart = String(req.body.trialStart);
        await redis('SET', trialKey, serverTrialStart);
      }
      const trialStart = serverTrialStart ? parseInt(serverTrialStart, 10) : null;
      // ────────────────────────────────────────────────────────────────

      return res.status(200).json({ success: true, token: sessionToken, email: email.toLowerCase(), trialStart });
    }

    // —— VERIFY TOKEN (session check on app load) ——
    if (action === 'verify-token') {
      if (!token) {
        return res.status(400).json({ success: false, error: 'Token required' });
      }

      const userEmail = await redis('GET', `auth:token:${token}`);
      if (!userEmail) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
      }

      // Return trialStart so client can sync to server-authoritative value
      const trialKey = `selah:trial:${userEmail}`;
      const serverTrialStart = await redis('GET', trialKey);
      const trialStart = serverTrialStart ? parseInt(serverTrialStart, 10) : null;

      return res.status(200).json({ success: true, email: userEmail, trialStart });
    }

    // —— LOGOUT ——
    if (action === 'logout') {
      if (token) {
        await redis('DEL', `auth:token:${token}`);
      }
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
