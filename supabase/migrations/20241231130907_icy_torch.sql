/*
  # Fix RLS policies for contents table

  1. Changes
    - Drop existing policies for contents table
    - Create new simplified policies that allow authenticated users to:
      - Read all contents
      - Create new contents
      - Update their own contents (or if they are developer/admin)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Everyone can read contents" ON contents;
DROP POLICY IF EXISTS "Users can create contents" ON contents;
DROP POLICY IF EXISTS "Authorized users can update contents" ON contents;

-- Create new policies
CREATE POLICY "Allow read contents"
  ON contents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow create contents"
  ON contents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Allow update contents"
  ON contents FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'developer' OR users.role = 'admin')
    )
  )
  WITH CHECK (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'developer' OR users.role = 'admin')
    )
  );