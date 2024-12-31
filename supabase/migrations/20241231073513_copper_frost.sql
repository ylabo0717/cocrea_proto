/*
  # Update application policies for custom authentication

  1. Changes
    - Remove auth.uid() dependencies
    - Use app.user_email for authentication checks
    - Update policies to check user role
    
  2. Security
    - Only developers can create/update/delete applications
    - Everyone can read applications
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Everyone can read applications" ON applications;
DROP POLICY IF EXISTS "Developers can update applications" ON applications;
DROP POLICY IF EXISTS "Developers can create applications" ON applications;
DROP POLICY IF EXISTS "Developers can delete their applications" ON applications;

-- Recreate policies using custom authentication
CREATE POLICY "Everyone can read applications"
  ON applications FOR SELECT
  USING (true);

CREATE POLICY "Developers can create applications"
  ON applications FOR INSERT
  WITH CHECK (
    developer_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
      AND role = 'developer'
    )
  );

CREATE POLICY "Developers can update applications"
  ON applications FOR UPDATE
  USING (
    developer_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
      AND role = 'developer'
    )
  )
  WITH CHECK (
    developer_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
      AND role = 'developer'
    )
  );

CREATE POLICY "Developers can delete their applications"
  ON applications FOR DELETE
  USING (
    developer_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
      AND role = 'developer'
    )
  );