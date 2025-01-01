-- Drop existing policies
DROP POLICY IF EXISTS "comments_read_policy" ON comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
DROP POLICY IF EXISTS "comments_update_policy" ON comments;
DROP POLICY IF EXISTS "comments_delete_policy" ON comments;

-- Create new policies with proper checks
CREATE POLICY "comments_read_policy"
ON comments FOR SELECT
USING (true);

CREATE POLICY "comments_insert_policy"
ON comments FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "comments_update_policy"
ON comments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND (
      id = user_id
      OR role IN ('developer', 'admin')
    )
  )
);

CREATE POLICY "comments_delete_policy"
ON comments FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND (
      id = user_id
      OR role IN ('developer', 'admin')
    )
  )
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_content_id ON comments(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);