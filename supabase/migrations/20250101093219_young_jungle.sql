-- Drop existing policies
DROP POLICY IF EXISTS "contents_select_policy" ON contents;
DROP POLICY IF EXISTS "contents_insert_policy" ON contents;
DROP POLICY IF EXISTS "contents_update_policy" ON contents;
DROP POLICY IF EXISTS "contents_delete_policy" ON contents;

-- Create a single permissive policy for all operations
CREATE POLICY "contents_all_operations"
ON contents FOR ALL
USING (true)
WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_contents_author_id ON contents(author_id);
CREATE INDEX IF NOT EXISTS idx_contents_application_id ON contents(application_id);