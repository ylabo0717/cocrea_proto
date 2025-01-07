-- Drop existing storage related objects
DO $$
BEGIN
  -- Drop storage policies
  DROP POLICY IF EXISTS "storage_all_operations" ON storage.objects;
  
  -- Delete bucket
  DELETE FROM storage.buckets WHERE id = 'issue-attachments';
END $$;

-- Modify attachments table to store file content directly
ALTER TABLE attachments 
ADD COLUMN file_content bytea,
DROP COLUMN file_path;

-- Update attachments policies
DROP POLICY IF EXISTS "attachments_all_operations" ON attachments;

CREATE POLICY "attachments_select"
ON attachments FOR SELECT
USING (true);

CREATE POLICY "attachments_insert"
ON attachments FOR INSERT
WITH CHECK (true);

CREATE POLICY "attachments_delete"
ON attachments FOR DELETE
USING (true);