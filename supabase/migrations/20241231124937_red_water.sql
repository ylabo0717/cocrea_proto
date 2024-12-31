/*
  # Restore content update policy

  1. Changes
    - Drop temporary policy that allowed all updates
    - Create new policy that only allows:
      - Content authors to update their own content
      - Developers to update any content
      - Admins to update any content

  2. Security
    - Enables proper row level security for content updates
    - Restricts updates to authorized users only
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Allow content updates" ON contents;

-- Create new restricted update policy
CREATE POLICY "Authorized users can update contents"
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