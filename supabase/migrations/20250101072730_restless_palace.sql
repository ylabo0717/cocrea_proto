-- Drop existing policies
DROP POLICY IF EXISTS "Everyone can read comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Authors can update their comments" ON comments;

-- Create new policies
CREATE POLICY "Allow read comments"
ON comments FOR SELECT
USING (true);

CREATE POLICY "Allow create comments"
ON comments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Allow update own comments"
ON comments FOR UPDATE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND (role = 'developer' OR role = 'admin')
  )
)
WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND (role = 'developer' OR role = 'admin')
  )
);

CREATE POLICY "Allow delete own comments"
ON comments FOR DELETE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND (role = 'developer' OR role = 'admin')
  )
);