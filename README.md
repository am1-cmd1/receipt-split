# ReceiptSplit

Snap a receipt, split items with friends, settle up fast.

## Features

- 📸 AI-powered receipt scanning (OCR)
- 👥 Assign items to people with tap-to-split
- 💰 Automatic tip & tax distribution
- 📤 Share via WhatsApp, link, or clipboard
- 📱 PWA — installable on mobile
- 🔐 Auth via Supabase
- 💳 Stripe subscriptions (7-day free trial → £2.99/mo Pro)

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **Supabase** (Auth, Database, Storage)
- **Stripe** (Subscriptions)
- **TypeScript**

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in your env vars (see below)
npm run dev
```

The app works in demo mode without env vars configured — auth is bypassed and mock data is used.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRICE_ID` | Stripe Price ID for £2.99/mo subscription |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g. `https://receiptsplit.vercel.app`) |

## Deployment (Vercel + Supabase + Stripe)

### 1. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Create a storage bucket called `receipt-images` (public)
4. Enable Email auth in Authentication → Providers
5. Copy URL and anon key to env vars

### 2. Stripe Setup
1. Create a product with a £2.99/month recurring price
2. Copy the Price ID to `STRIPE_PRICE_ID`
3. Set up a webhook endpoint pointing to `<your-url>/api/webhook`
4. Subscribe to `checkout.session.completed` and `customer.subscription.deleted`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Deploy to Vercel
1. Push to GitHub
2. Import in Vercel, add all env vars
3. Deploy

## Database Schema

See `supabase/schema.sql` for the full schema including RLS policies.

- **profiles** — user profiles with trial/pro status
- **receipts** — scanned receipts with OCR data
- **splits** — per-person split breakdowns
