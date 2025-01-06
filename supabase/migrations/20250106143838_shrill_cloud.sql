-- Drop existing policies
DROP POLICY IF EXISTS "likes_all_operations" ON likes;
DROP POLICY IF EXISTS "likes_select" ON likes;
DROP POLICY IF EXISTS "likes_insert" ON likes;
DROP POLICY IF EXISTS "likes_delete" ON likes;

-- Create a single permissive policy for all operations
CREATE POLICY "likes_policy"
ON likes FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_likes_content_id ON likes(content_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
