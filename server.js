import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// API handlers
import analytics from './api/analytics.js';
import auth from './api/auth.js';
import chat from './api/chat.js';
import consent from './api/consent.js';
import emails from './api/emails.js';
import feedback from './api/feedback.js';
import pushMorning from './api/push-morning.js';
import pushSubscribe from './api/push-subscribe.js';

import pushEveningPrayer from './api/push-evening-prayer.js';
import stripePortal from './api/stripe-portal.js';
import stripeWebhook from './api/stripe-webhook.js';
import sync from './api/sync.js';
import verifyPayment from './api/verify-payment.js';
import { getHealthSnapshot, isHealthy } from './lib/health.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN || '';

function tokenEqual(expected, provided) {
  if (!expected || !provided) return false;
  const a = Buffer.from(String(expected));
  const b = Buffer.from(String(provided));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function getAdminToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  const headerToken = req.headers['x-admin-token'];
  if (headerToken) return String(headerToken).trim();
  if (req.query?.adminToken) return String(req.query.adminToken).trim();
  return '';
}

app.use(cors());

app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use('/api/analytics', (req, res, next) => {
  if (req.method !== 'GET') return next();
  if (!ADMIN_API_TOKEN) {
    console.error('ADMIN_API_TOKEN is not configured');
    return res.status(500).json({ error: 'Admin authentication not configured' });
  }
  const presented = getAdminToken(req);
  if (!tokenEqual(ADMIN_API_TOKEN, presented)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  return next();
});

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.all('/api/analytics', analytics);
app.all('/api/auth', auth);
app.all('/api/chat', chat);
app.all('/api/consent', consent);
app.all('/api/emails', emails);
app.all('/api/feedback', feedback);
app.all('/api/push-morning', pushMorning);
app.all('/api/push-subscribe', pushSubscribe);

app.all('/api/push-evening-prayer', pushEveningPrayer);
app.all('/api/stripe-portal', stripePortal);
app.all('/api/stripe-webhook', stripeWebhook);
app.all('/api/sync', sync);
app.all('/api/verify-payment', verifyPayment);

/** Liveness + optional Redis (Upstash) check. Uptime monitors should expect 200 when healthy, 503 when degraded. */
app.get('/health', async (req, res) => {
  try {
    const snapshot = await getHealthSnapshot();
    const code = isHealthy(snapshot) ? 200 : 503;
    res.status(code).json(snapshot);
  } catch (err) {
    res.status(503).json({
      status: "error",
      service: "selah",
      timestamp: new Date().toISOString(),
      message: err.message || "Health check failed",
    });
  }
});

app.get('/status', async (req, res) => {
  let snapshot;
  let ok = true;
  try {
    snapshot = await getHealthSnapshot();
    ok = isHealthy(snapshot);
  } catch {
    ok = false;
    snapshot = { status: "error" };
  }
  const title = ok ? "Selah is running normally" : "We are experiencing issues";
  const detail = ok
    ? "All systems are operational."
    : "Our team has been notified. Please try again shortly.";
  const accent = ok ? "#3D6B4F" : "#B06040";
  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Selah — Status</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; background:#F5F1E8; color:#2C2C2A; margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; box-sizing:border-box; }
    .card { max-width:420px; width:100%; background:#fff; border:1px solid #E8E4DC; border-radius:14px; padding:32px 28px; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.06); }
    .dot { width:12px; height:12px; border-radius:50%; background:${accent}; margin:0 auto 16px; }
    h1 { font-size:1.35rem; font-weight:normal; margin:0 0 12px; line-height:1.35; }
    p { font-size:0.95rem; color:#6B6B66; font-style:italic; line-height:1.75; margin:0 0 20px; }
    pre { font-size:11px; color:#9A8E80; text-align:left; white-space:pre-wrap; word-break:break-all; background:#FAF8F4; padding:12px; border-radius:8px; margin:0; }
    a { color:#4A7FA5; font-size:12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="dot" aria-hidden="true"></div>
    <h1>${title}</h1>
    <p>${detail}</p>
    <pre>${JSON.stringify(snapshot, null, 2)}</pre>
    <p style="margin-top:20px; margin-bottom:0;"><a href="https://selah-transcend.com">← Back to Selah</a></p>
  </div>
</body>
</html>`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Selah server running on port ${PORT}`);
});