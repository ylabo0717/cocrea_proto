-- Drop auth related extensions and triggers if they exist
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Remove auth_id column from users table
ALTER TABLE users 
DROP COLUMN IF EXISTS auth_id;

-- Create function to set app.user_email
CREATE OR REPLACE FUNCTION set_user_email(email text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.user_email', email, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check password
CREATE OR REPLACE FUNCTION check_password(
  input_email text,
  input_password text
) RETURNS TABLE (
  id uuid,
  email text,
  role text
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.role
  FROM users u
  WHERE u.email = input_email
  AND u.hashed_password = public.crypt(
    input_password,
    u.salt
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;