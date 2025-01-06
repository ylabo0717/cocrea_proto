-- Drop existing policies
DROP POLICY IF EXISTS "likes_select" ON likes;
DROP POLICY IF EXISTS "likes_insert" ON likes;
DROP POLICY IF EXISTS "likes_delete" ON likes;

-- Create simplified policies for likes table
CREATE POLICY "likes_select_policy"
ON likes FOR SELECT
USING (true);

CREATE POLICY "likes_insert_policy"
ON likes FOR INSERT
WITH CHECK (true);

CREATE POLICY "likes_delete_policy"
ON likes FOR DELETE
USING (true);