# PredChain: Premium Football Prediction Platform

PredChain is an elite 3-day football prediction platform designed for precision and reward. Users select a tier, enter a round, and must achieve a perfect 3/3 daily prediction streak to unlock a guaranteed 10X cash reward.

## 🚀 Premium Features

### 🎮 **Player Experience**
- **Dynamic Dashboard**: Responsive, high-fidelity command center for tracking predictions and streaks.
- **Tiered Entry**: Flexible entry points (Starter, Standard, Premium) with scaled rewards.
- **Real-Time Leaderboard**: Live rankings and streak tracking.
- **Instant Payouts**: Automated wallet system for seamless settlements.

### 🛡️ **Admin Control Center**
- **User Management**: Advanced user tracking, search, and status control (Verify/Suspend/Demo).
- **Financial Operations**: Payout moderation queue with automated refund logic and manual ledger adjustments.
- **Match Management**: Complete round/match lifecycle management with bulk settlement tools.
- **Platform Settings**: No-code platform controls for maintenance mode, pricing, and announcement banners.
- **Support Helpdesk**: Integrated support ticket management.

## 🛠️ Tech Stack
- **Framework**: Next.js 16.2.1 (App Router)
- **Database/Auth**: Supabase (PostgreSQL with RLS)
- **Payments**: Paystack (Webhook-integrated, idempotent verification)
- **Styling**: Vanilla CSS with a Premium Dark DNA

## ⚙️ Setup & Configuration

### 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in the following:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (critical for admin actions)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Activation
Apply the master migration script in the Supabase SQL Editor:
- `supabase/combined_migrations.sql` (Consolidated Production Schema)

### 3. Installation & Development
```bash
npm install
npm run dev
```

## 🔐 Security & Integrity
- **Prediction Ownership**: Verified server-side during submission.
- **Payment Verification**: Idempotent with deep price/tier matching.
- **Atomic Operations**: Critical financial flows use PostgreSQL RPCs with row-level locking.
- **Admin Access**: Role-based access control (RBAC) enforced on all server actions.

## 🚀 Launch Strategy
See `LAUNCH_GUIDE.md` for the full production checklist.
