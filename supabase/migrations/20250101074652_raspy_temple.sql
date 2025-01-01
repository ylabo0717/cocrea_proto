-- Drop existing policies
DROP POLICY IF EXISTS "comments_read_policy" ON comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
DROP POLICY IF EXISTS "comments_update_policy" ON comments;
DROP POLICY IF EXISTS "comments_delete_policy" ON comments;

-- Create simple policies for testing
CREATE POLICY "comments_read_policy"
ON comments FOR SELECT
USING (true);

CREATE POLICY "comments_write_policy"
ON comments FOR ALL
USING (true)
WITH CHECK (true);