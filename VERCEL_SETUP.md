# 🏔️ PredChain: Master Vercel Deployment Walkthrough

This guide provides the final systematic steps to move from local development to a globally distributed, high-integrity production environment on Vercel.

## 🔗 1. GitHub Integration

The hardened codebase has been synced to your repository:
[https://github.com/olabodesamuel0920-max/predchain](https://github.com/olabodesamuel0920-max/predchain)

### **Deployment Steps**:
1. Login to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** → **"Project"**.
3. Import the `predchain` repository from your GitHub account.
4. Set the **Framework Preset** to **Next.js**.
5. Leave the **Build Command** and **Output Directory** as defaults.

---

## 🔑 2. Environment Variables (Vault)

Configure these variables in the Vercel Project Settings → **Environment Variables**. These are **CRITICAL** for the platform's financial and database integrity.

| Variable | Source / Description | Importance |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings → API → URL | **Critical** (DB Connection) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings → API → Anon Key | **Critical** (Client Auth) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings → API → Service Role | **High** (Admin RPCs & Webhooks) |
| `PAYSTACK_SECRET_KEY` | Paystack Settings → API Keys → Secret Key | **High** (Payment Verification) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`| Paystack Settings → API Keys → Public Key | **High** (Payment Widget UI) |
| `NEXT_PUBLIC_APP_URL` | Your Vercel Domain (e.g., `https://predchain.vercel.app`) | **High** (Referrals & Webhooks) |
| `NODE_ENV` | Set automatically to `production` by Vercel | **Verified** |

---

## 🗄️ 3. Database Activation: Supabase Pulse

Before testing the live site, ensure the production database is correctly bootstrapped.

1.  **Run Master Script**: Copy the content of `supabase/combined_migrations.sql` and run it in the **Supabase SQL Editor**.
2.  **Verify Atomic Hooks**: Run the pulse check to confirm the environment is alive:
    ```sql
    -- Check for the 4+ core RPCs (Atomic Payouts, Admin Wallet Adjustment, etc.)
    SELECT count(*) FROM pg_proc WHERE proname LIKE '%_atomic' OR proname LIKE '%_admin';

    -- Confirm unique phone number constraint is active
    SELECT column_name, is_nullable, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone';
    ```

---

## 🧪 4. Final Production Smoke Test

Once the Vercel build completes and the status is "Ready":

1.  **Access Site**: Open your Vercel deployment URL.
2.  **Registration**: Sign up with a new test account. Verify that the **Phone Number** is required and unique.
3.  **Admin Promote**: Manually promote your first account to `admin` in the Supabase `profiles` table:
    ```sql
    UPDATE public.profiles SET role = 'admin' WHERE username = 'your_username';
    ```
4.  **Admin UI**: Visit `/admin` and confirm the **User Management**, **Finance**, and **Settings** views are pulling real-time data.

---

## 🚀 5. Performance & Security Notes

- **ISR/Revalidation**: PredChain uses `revalidatePath` for real-time dashboard updates. Vercel handles this automatically via its Edge Network.
- **RLS (Row Level Security)**: Ensure all tables have RLS enabled (included in migrations) so users can only access their own financial data.
- **Paystack Webhooks**: Update your Paystack Webhook URL to `${NEXT_PUBLIC_APP_URL}/api/webhooks/paystack`.

© 2026 PredChain Elite. Precision. Integrity. Scale.
