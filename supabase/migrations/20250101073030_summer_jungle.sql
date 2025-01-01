-- Drop existing policies
DROP POLICY IF EXISTS "Allow read comments" ON comments;
DROP POLICY IF EXISTS "Allow create comments" ON comments;
DROP POLICY IF EXISTS "Allow update own comments" ON comments;
DROP POLICY IF EXISTS "Allow delete own comments" ON comments;

-- Create simplified policies
CREATE POLICY "comments_read_policy"
ON comments FOR SELECT
USING (true);

CREATE POLICY "comments_insert_policy"
ON comments FOR INSERT
WITH CHECK (true);

CREATE POLICY "comments_update_policy"
ON comments FOR UPDATE
USING (true);

CREATE POLICY "comments_delete_policy"
ON comments FOR DELETE
USING (true);