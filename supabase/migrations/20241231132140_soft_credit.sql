/*
  # Update content policies
  
  1. Changes
    - Remove auth.uid() from policies
    - Use app.user_email setting for authentication
    - Simplify policy conditions
  
  2. Security
    - Maintain same security level using email-based authentication
    - Keep developer/admin privileges for content updates
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read contents" ON contents;
DROP POLICY IF EXISTS "Allow create contents" ON contents;
DROP POLICY IF EXISTS "Allow update contents" ON contents;

-- Create new policies
CREATE POLICY "Allow read contents"
  ON contents FOR SELECT
  USING (true);

CREATE POLICY "Allow create contents"
  ON contents FOR INSERT
  WITH CHECK (
    author_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
    )
  );

CREATE POLICY "Allow update contents"
  ON contents FOR UPDATE
  USING (
    author_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE email = current_setting('app.user_email', true)
      AND (role = 'developer' OR role = 'admin')
    )
  )
  WITH CHECK (
    author_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE email = current_setting('app.user_email', true)
      AND (role = 'developer' OR role = 'admin')
    )
  );