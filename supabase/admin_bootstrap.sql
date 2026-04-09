-- PREDCHAIN ADMIN BOOTSTRAP
-- This script promotes a specific user to the 'admin' role.
-- REPLACE 'your-email@example.com' with your actual account email.

UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);

-- VERIFICATION
SELECT full_name, username, role 
FROM public.profiles 
WHERE role = 'admin';
