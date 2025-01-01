-- Drop existing policies
DROP POLICY IF EXISTS "comments_read_policy" ON comments;
DROP POLICY IF EXISTS "comments_write_policy" ON comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
DROP POLICY IF EXISTS "comments_update_policy" ON comments;
DROP POLICY IF EXISTS "comments_delete_policy" ON comments;

-- Create a single policy for all operations
CREATE POLICY "comments_all_operations"
ON comments FOR ALL
USING (true)
WITH CHECK (true);