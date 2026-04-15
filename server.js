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
import admin from './api/admin.js';
import weeklyRecap from './api/weekly-recap.js';
import patternDetection from './api/pattern-detection.js';
import verifyPayment from './api/verify-payment.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

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
app.all('/api/stripe-portal', stripePortal);
app.all('/api/stripe-webhook', stripeWebhook);
app.all('/api/sync', sync);
app.all('/api/verify-payment', verifyPayment);
app.all('/api/admin', admin);
app.all('/api/weekly-recap', weeklyRecap);
app.all('/api/pattern-detection', patternDetection);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Selah server running on port ${PORT}`);
});
