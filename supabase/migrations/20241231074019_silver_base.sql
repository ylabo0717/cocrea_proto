/*
  # Fix RLS policies for applications

  1. Changes
    - Remove existing policies
    - Add simplified policies without external dependencies
    - Use direct role checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Everyone can read applications" ON applications;
DROP POLICY IF EXISTS "Developers can update applications" ON applications;
DROP POLICY IF EXISTS "Developers can create applications" ON applications;
DROP POLICY IF EXISTS "Developers can delete their applications" ON applications;

-- Create new simplified policies
CREATE POLICY "Allow all reads"
  ON applications FOR SELECT
  USING (true);

CREATE POLICY "Allow developer creates"
  ON applications FOR INSERT
  WITH CHECK (
    developer_id IN (
      SELECT id FROM users WHERE role = 'developer'
    )
  );

CREATE POLICY "Allow developer updates"
  ON applications FOR UPDATE
  USING (
    developer_id IN (
      SELECT id FROM users WHERE role = 'developer'
    )
  );

CREATE POLICY "Allow developer deletes"
  ON applications FOR DELETE
  USING (
    developer_id IN (
      SELECT id FROM users WHERE role = 'developer'
    )
  );