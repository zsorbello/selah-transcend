import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// API handlers
import analytics from './api/analytics.js';
import auth from './api/auth.js';
import chat from './api/chat.js';
import consent from './api/consent.js';
import emails from './api/emails.js';
import feedback from './api/feedback.js';
import pushMorning from './api/push-morning.js';
import pushSubscribe from './api/push-subscribe.js';
import stripePortal from './api/stripe-portal.js';
import stripeWebhook from './api/stripe-webhook.js';
import sync from './api/sync.js';
import verifyPayment from './api/verify-payment.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors());

// Parse JSON for all routes except stripe-webhook
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Serve static frontend from public
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.all('/api/analytics', analytics);
app.all('/api/auth', auth);
app.all('/api/chat', chat);
app.all('/api/consent', consent);
app.all('/api/emails', emails);
app.all('/api/feedback', feedback);
app.all('/api/push-morning', pushMorning);
app.all('/api/push-subscribe', pushSubscribe);
app.all('/api/stripe-portal', stripePortal);
app.all('/api/stripe-webhook', stripeWebhook);
app.all('/api/sync', sync);
app.all('/api/verify-payment', verifyPayment);

// Homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// SPA fallback for any non-API route
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Selah server running on port ${PORT}`);
});