-- Drop existing policies
DROP POLICY IF EXISTS "comments_read_policy" ON comments;
DROP POLICY IF EXISTS "comments_write_policy" ON comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
DROP POLICY IF EXISTS "comments_update_policy" ON comments;
DROP POLICY IF EXISTS "comments_delete_policy" ON comments;

-- Create new policies
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
  user_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "comments_delete_policy"
ON comments FOR DELETE
USING (
  user_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  )
);