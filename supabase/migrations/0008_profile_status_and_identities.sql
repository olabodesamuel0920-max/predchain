-- 0008_profile_status_and_identities.sql
-- Add status and improve profile fields

-- 1. Add status column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'under_review', 'demo'));

-- 2. Ensure username uniqueness is strict (already exists but good to reinforce)
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);

-- 3. Add index for performance on status and role
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
