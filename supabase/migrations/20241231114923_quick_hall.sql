/*
  # Update contents policies

  1. Changes
    - Allow developers and admins to edit contents
    - Keep existing policies for other operations

  2. Security
    - Enable RLS
    - Add policy for developers and admins to update contents
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Authors can update their contents" ON contents;

-- Create new update policy
CREATE POLICY "Developers and admins can update contents"
  ON contents FOR UPDATE
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