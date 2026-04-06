# PredChain: Master Launch & Verification Guide

This document contains the final systematic verification protocols to move PredChain into a high-integrity, production-ready environment.

## 🚀 1. Production Launch Checklist

| Item | Action | Status |
| :--- | :--- | :--- |
| **Supabase** | URL and Anon Key correctly configured in production env | [ ] |
| **Database** | SQL Migrations 0000-0007 executed in order | [x] |
| **Atomic Ops** | Verified `settle_round_winner_atomic`, `resolve_payout_atomic`, `purchase_tier_with_wallet_atomic`, and `process_referral_reward_atomic` exist | [x] |
| **Auth** | User Registration Trigger Active (`on_auth_user_created`) | [x] |
| **Payments** | Paystack Live Keys and Webhook URL configured | [ ] |
| **Webhooks** | Endpoint `/api/webhooks/paystack` reachable by external POST | [ ] |
| **Admin Setup** | First admin account manually promoted in `profiles` table | [ ] |
| **Build Check** | `npm run build` completed with zero type errors | [x] |

---

## 🧪 2. Manual QA Protocols (Critical Flows)

Perform these steps to confirm platform financial and logical health.

### **A. Secure Enrollment & Referral**
1.  **Referral Signup**: Create "User B" using "User A's" referral code.
2.  **Purchase**: Initialize a tier purchase for "User B".
3.  **Webhook Simulation**: Use the Paystack dashboard to trigger a `charge.success` event.
4.  **Verification**:
    *   **User B**: Must be atomically enrolled in the current active round.
    *   **User A**: Wallet must be atomically credited with ₦1,000 referral reward.
    *   **Truth Check**: Homepage stats should increment by 1 for "Active Challengers".

### **B. Atomic Payout Moderation**
1.  **Request**: As a user, submit a withdrawal request for ₦5,000.
2.  **State Check**: Verify wallet balance is reduced by ₦5,000 IMMEDIATELY.
3.  **Admin Rejection**: In the **Financial Operations**, reject the request.
4.  **Atomic Refund**: Verify the user's wallet balance is restored by ₦5,000 IMMEDIATELY.
5.  **Audit**: Check `admin_audit_logs` for the `payout_rejected` entry.

### **C. Demo System Utility**
1.  **Generation**: In the **User Management**, create a new Demo User.
2.  **Verification**: 
    *   User must be marked with a "DEMO" badge.
    *   User stats must NOT impact homepage counts (Active Challengers, total paid out).
    *   Demo user can be used for marketing screenshots safely.

---

## 🔑 3. Environment Variables (Vault)

Configure these in your production hosting environment (e.g., Vercel, Netlify):

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY` (Required for Atomic RPCs, Admin actions, and Webhooks)
* `PAYSTACK_SECRET_KEY`
* `NEXT_PUBLIC_APP_URL` (Used for absolute webhook verification)

---

## 🗄️ 4. Database Activation: Production Initialize

Run the master script in the **Supabase SQL Editor** to bootstrap the entire platform:

1.  **`supabase/combined_migrations.sql`**: Consolidated Production Schema.

This script contains all tables, constraints, RLS policies, and core logic triggers (including `on_auth_user_created`).

### **System Health Pulse**
```sql
-- Ensure all migrations were effective
SELECT count(*) FROM public.account_tiers; -- Expect 3+
SELECT count(*) FROM public.platform_settings; -- Expect 6+
SELECT count(*) FROM pg_proc WHERE proname LIKE '%_atomic' OR proname LIKE '%_admin'; -- Expect 4+ RPCs
```

---

## 🛡️ 5. Platform Administration

The `/admin` route is the source of truth for the platform.
- **Users**: Search and manage user states (Verify, Suspend, Demo).
- **Finance**: Moderated financial clearing house.
- **Matches**: The match resolution engine. Settle scores to trigger the reward distribution.
- **Settings**: Change platform rules (pricing, banners, maintenance) without code.

© 2026 PredChain Elite. Precision. Integrity. Scale.
