-- Drop existing policies
DROP POLICY IF EXISTS "comments_select" ON comments;
DROP POLICY IF EXISTS "comments_insert" ON comments;
DROP POLICY IF EXISTS "comments_update" ON comments;
DROP POLICY IF EXISTS "comments_delete" ON comments;

-- Create simple policies for testing
CREATE POLICY "comments_select"
ON comments FOR SELECT
USING (true);

CREATE POLICY "comments_insert"
ON comments FOR INSERT
WITH CHECK (true);

CREATE POLICY "comments_update"
ON comments FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "comments_delete"
ON comments FOR DELETE
USING (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_comments_content_id ON comments(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);