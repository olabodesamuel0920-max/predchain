-- 0005_premium_admin_features.sql
-- Advanced Admin Dashboard and Trust Hardening

-- 1. ENHANCE PROFILES FOR MANAGEMENT
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'under_review', 'demo', 'test')),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- 2. CREATE PLATFORM SETTINGS (No-Code Controls)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed Initial Settings
INSERT INTO public.platform_settings (key, value, description) VALUES
('maintenance_mode', 'false', 'Enable or disable platform maintenance mode.'),
('tier_pricing', '{"starter": 5000, "standard": 10000, "premium": 25000}', 'Pricing for account tiers in NGN.'),
('referral_bonus', '1000', 'Bonus amount for successful referrals in NGN.'),
('payout_limits', '{"min": 5000, "max": 500000}', 'Minimum and maximum payout limits.'),
('announcement_banner', '{"text": "Welcome to PredChain! Round 43 is now live.", "active": true}', 'Homepage announcement banner content.'),
('trust_stats_mode', '"real"', 'Display mode for homepage stats: "real" or "launch".')
ON CONFLICT (key) DO NOTHING;

-- 3. ENHANCE SUPPORT TICKETS
ALTER TABLE public.support_tickets
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- 4. FINANCIAL INTEGRITY (Ledger Entry)
CREATE TABLE IF NOT EXISTS public.admin_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id),
  user_id UUID REFERENCES public.profiles(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- credit, debit, refund
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. FRAUD/RISK REVIEW QUEUE
-- We already have admin_audit_logs, but we add a specific flag for records requiring review
ALTER TABLE public.payout_requests
ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS flagging_reason TEXT;

ALTER TABLE public.referrals
ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT false;

-- 6. RPC: ATOMIC ADMIN WALLET ADJUSTMENT
CREATE OR REPLACE FUNCTION public.adjust_user_wallet_admin(
  p_admin_id UUID,
  p_user_id UUID,
  p_amount INTEGER, -- positive for credit, negative for debit
  p_reason TEXT
) RETURNS VOID AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  -- 1. Verify Admin Role
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required.';
  END IF;

  -- 2. Get and lock wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
  
  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
  END IF;

  -- 3. Update Wallet Balance
  UPDATE public.wallets
  SET balance_ngn = balance_ngn + p_amount
  WHERE id = v_wallet_id;

  -- 4. Record Ledger Entry
  INSERT INTO public.admin_ledger (admin_id, user_id, amount, type, reason)
  VALUES (p_admin_id, p_user_id, p_amount, CASE WHEN p_amount >= 0 THEN 'credit' ELSE 'debit' END, p_reason);

  -- 5. Record Transaction
  INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
  VALUES (v_wallet_id, p_amount, 'admin_adjustment', 'adj_' || now());

  -- 6. Audit Log
  INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, details)
  VALUES (p_admin_id, 'wallet_adjustment', p_user_id, jsonb_build_object('amount', p_amount, 'reason', p_reason));

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
