-- Drop existing policies
DROP POLICY IF EXISTS "likes_all_operations" ON likes;
DROP POLICY IF EXISTS "likes_select" ON likes;
DROP POLICY IF EXISTS "likes_insert" ON likes;
DROP POLICY IF EXISTS "likes_delete" ON likes;

-- Create proper RLS policies for likes table
CREATE POLICY "likes_select"
ON likes FOR SELECT
USING (true);

CREATE POLICY "likes_insert"
ON likes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND id = user_id
  )
);

CREATE POLICY "likes_delete"
ON likes FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND id = user_id
  )
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_content_id ON likes(content_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);