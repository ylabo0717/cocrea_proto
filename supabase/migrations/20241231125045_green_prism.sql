/*
  # Update content policy without auth.uid()

  1. Changes
    - Remove auth.uid() dependency
    - Use current_setting('app.user_email') instead
    - Allow updates for:
      - Content authors
      - Developers
      - Admins

  2. Security
    - Maintains proper row level security
    - Uses application-level user identification
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Authorized users can update contents" ON contents;

-- Create new restricted update policy without auth.uid()
CREATE POLICY "Authorized users can update contents"
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