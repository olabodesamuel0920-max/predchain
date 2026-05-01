-- 0001_auth_trigger.sql
-- Create a trigger to automatically create a public profile and initialize a wallet for new auth.users

-- 1. Function to handle profile and wallet creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles
  -- metadata "full_name", "username", and "phone" are expected from the signup form's user_metadata
  INSERT INTO public.profiles (id, full_name, username, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    new.raw_user_meta_data->>'phone'
  );
  
  -- Initialize a wallet for the new user
  INSERT INTO public.wallets (user_id, balance_ngn)
  VALUES (new.id, 0);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger definition
-- Dropping if exists for idempotency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
