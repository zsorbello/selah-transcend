# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Selah is a faith-rooted mental wellness PWA (Progressive Web App) — a clarity companion offering guided reflection sessions, breathing exercises, mood tracking, journaling, AI-powered conversations, and a community prayer wall. Deployed on Vercel with Upstash Redis as the primary backend data store.

## Build & Dev Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `/dist`
- `npm run preview` — Preview production build locally
- `node generate-vapid.js` — Generate new VAPID key pair for push notifications

No test runner or linter is configured.

## Architecture

### Frontend — Single-File React App

The entire frontend lives in `src/App.jsx` (~14k lines). It contains all components, screens, state management, themes, and routing logic in one file using React hooks. `src/main.jsx` is the entry point that mounts `<App/>`. There is no router library — navigation is handled via internal state.

Historical backups exist as `App_v2.jsx` through `App_v35.jsx` in the project root.

### Backend — Vercel Serverless Functions

All API endpoints are in `api/` as individual ES module files:

| Endpoint | Purpose |
|---|---|
| `auth.js` | Passwordless email-code login (6-digit codes via Resend, sessions in Redis) |
| `chat.js` | Proxies to Anthropic Claude API (claude-sonnet-4-20250514) |
| `sync.js` | User data sync + prayer wall (post, get, flame reactions) |
| `analytics.js` | Event tracking and admin dashboard data (90-day retention) |
| `emails.js` | Welcome emails, trial reminders, inactive nudges (cron-triggered) |
| `push-morning.js` | Morning verse + streak nudge push notifications (cron-triggered) |
| `push-subscribe.js` | Manages browser push notification subscriptions |
| `stripe-webhook.js` | Handles Stripe checkout/subscription events, maps price→tier |
| `stripe-portal.js` | Redirects to Stripe customer billing portal |
| `verify-payment.js` | Confirms Stripe checkout completion |
| `consent.js` | Parental consent flow (email + approval code) |
| `feedback.js` | Collects user feedback, emails it via Resend |

### Data Layer

- **Browser localStorage** (`selah_app_data` key): Primary client-side persistence for app state
- **Upstash Redis**: Server-side storage for sessions, user data, analytics, prayer wall, push subscriptions, trial/subscription status. Accessed via REST API.
- No traditional database — Redis is the sole backend store.

### Subscription Tiers

Four tiers with numeric levels (0–3): `free`, `foundation`, `growth`, `deep`. Feature access checked via `hasAccess(requiredTier)` which also accounts for trial status. Price-to-tier mapping is in `stripe-webhook.js`.

### Theme System

Eight themes (warm, masculine, navy, forest, charcoal, slate, obsidian, plus neutral for pre-onboarding). Each defines a full color palette object. Theme is selected in settings and applied via inline styles throughout the app.

### PWA & Notifications

- Service worker at `public/sw.js` — network-first caching, skips API/Anthropic routes
- Push notifications via Web Push with VAPID auth
- Cron jobs defined in `vercel.json` trigger `emails.js` and `push-morning.js`

### Safety

Crisis keyword detection in user input triggers an emergency resources panel (988 Suicide & Crisis Lifeline, Crisis Text Line, etc.). Late-night usage triggers encouragement messages.

## Environment Variables

Required in Vercel for backend functions:
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `CRON_SECRET`, `FEEDBACK_EMAIL`, `STRIPE_SECRET_KEY`

## Key Conventions

- All API endpoints use open CORS (`*` origin) and handle OPTIONS preflight
- Authentication is passwordless: email → 6-digit code → session token in Redis
- Admin access via URL param: `?admin=<uuid>`
- Inline styles throughout (no CSS framework or stylesheet)
- ES modules everywhere (both frontend and API)
