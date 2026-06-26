-- 0009_backend_integrity_repair.sql
-- Synchronizes platform pricing and backfills missing user profile/wallet data

BEGIN;

-- 1. UNIFY PLATFORM PRICING TRUTH
-- Ensuring platform_settings exactly matches the 5k/10k/20k model
UPDATE public.platform_settings
SET value = '{"starter": 5000, "standard": 10000, "premium": 20000}'::jsonb
WHERE key = 'tier_pricing';

-- 2. BACKFILL ORPHANED PROFILES
-- Creates missing profile rows for users in auth.users who lack a public.profiles entry
INSERT INTO public.profiles (id, username, full_name, role)
SELECT 
    u.id, 
    COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1) || '_' || substr(u.id::text, 1, 4)),
    COALESCE(u.raw_user_meta_data->>'full_name', 'Guest Player'),
    'user'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3. BACKFILL ORPHANED WALLETS
-- Ensures every profile (new or existing) has an initialized wallet
INSERT INTO public.wallets (user_id, balance_ngn)
SELECT p.id, 0
FROM public.profiles p
LEFT JOIN public.wallets w ON p.id = w.user_id
WHERE w.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 4. REINFORCE AUTH TRIGGER (Resilient Idempotency)
-- Ensures new users never become orphaned even if triggers are re-run or partially fail
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Profile Creation (Idempotent)
  INSERT INTO public.profiles (id, full_name, username, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    new.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- 2. Wallet Initialization (Idempotent)
  INSERT INTO public.wallets (user_id, balance_ngn)
  VALUES (new.id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
