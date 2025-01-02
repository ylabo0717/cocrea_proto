-- Drop existing policies
DROP POLICY IF EXISTS "attachments_select" ON attachments;
DROP POLICY IF EXISTS "attachments_insert" ON attachments;
DROP POLICY IF EXISTS "attachments_delete" ON attachments;

-- Drop existing foreign key constraint
ALTER TABLE attachments
DROP CONSTRAINT IF EXISTS attachments_content_id_fkey;

-- Add new foreign key constraint with DEFERRABLE
ALTER TABLE attachments
ADD CONSTRAINT attachments_content_id_fkey
FOREIGN KEY (content_id) 
REFERENCES contents(id)
ON DELETE CASCADE
DEFERRABLE INITIALLY DEFERRED;

-- Create simplified policies
CREATE POLICY "attachments_select"
ON attachments FOR SELECT
USING (true);

CREATE POLICY "attachments_insert"
ON attachments FOR INSERT
WITH CHECK (true);

CREATE POLICY "attachments_delete"
ON attachments FOR DELETE
USING (true);

-- Update storage policies
DROP POLICY IF EXISTS "storage_select" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete" ON storage.objects;

CREATE POLICY "storage_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "storage_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-attachments');

CREATE POLICY "storage_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'issue-attachments');