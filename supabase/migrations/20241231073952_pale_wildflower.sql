/*
  # Fix application policies for email-based authentication

  1. Changes
    - Remove existing application policies
    - Add new policies using email-based checks
    
  2. Security
    - Policies check user email and role directly
    - No dependency on external functions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Everyone can read applications" ON applications;
DROP POLICY IF EXISTS "Developers can update applications" ON applications;
DROP POLICY IF EXISTS "Developers can create applications" ON applications;
DROP POLICY IF EXISTS "Developers can delete their applications" ON applications;

-- Create new policies
CREATE POLICY "Everyone can read applications"
  ON applications FOR SELECT
  USING (true);

CREATE POLICY "Developers can create applications"
  ON applications FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = applications.developer_id
    AND users.role = 'developer'
  ));

CREATE POLICY "Developers can update applications"
  ON applications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = applications.developer_id
    AND users.role = 'developer'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = applications.developer_id
    AND users.role = 'developer'
  ));

CREATE POLICY "Developers can delete their applications"
  ON applications FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = applications.developer_id
    AND users.role = 'developer'
  ));