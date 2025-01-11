-- Drop existing policies
DROP POLICY IF EXISTS "applications_all_operations" ON applications;
DROP POLICY IF EXISTS "contents_select" ON contents;
DROP POLICY IF EXISTS "contents_insert" ON contents;
DROP POLICY IF EXISTS "contents_update" ON contents;
DROP POLICY IF EXISTS "contents_delete" ON contents;
DROP POLICY IF EXISTS "comments_select" ON comments;
DROP POLICY IF EXISTS "comments_insert" ON comments;
DROP POLICY IF EXISTS "comments_update" ON comments;
DROP POLICY IF EXISTS "comments_delete" ON comments;
DROP POLICY IF EXISTS "attachments_all_operations" ON attachments;
DROP POLICY IF EXISTS "likes_all_operations" ON likes;

-- Create simple permissive policies for all tables
CREATE POLICY "applications_all_operations"
ON applications FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "contents_all_operations"
ON contents FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "comments_all_operations"
ON comments FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "attachments_all_operations"
ON attachments FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "likes_all_operations"
ON likes FOR ALL
USING (true)
WITH CHECK (true);