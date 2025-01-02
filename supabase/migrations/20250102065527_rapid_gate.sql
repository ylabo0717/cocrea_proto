-- Drop existing foreign key constraint
ALTER TABLE attachments
DROP CONSTRAINT IF EXISTS attachments_content_id_fkey;

-- Add new foreign key constraint with DEFERRABLE and NULL allowed
ALTER TABLE attachments
ALTER COLUMN content_id DROP NOT NULL;

ALTER TABLE attachments
ADD CONSTRAINT attachments_content_id_fkey
FOREIGN KEY (content_id) 
REFERENCES contents(id)
ON DELETE CASCADE
DEFERRABLE INITIALLY DEFERRED;

-- Drop existing policies
DROP POLICY IF EXISTS "attachments_all_operations" ON attachments;

-- Create simplified policies
CREATE POLICY "attachments_select"
ON attachments FOR SELECT
USING (true);

CREATE POLICY "attachments_insert"
ON attachments FOR INSERT
WITH CHECK (true);

CREATE POLICY "attachments_update"
ON attachments FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "attachments_delete"
ON attachments FOR DELETE
USING (true);

-- Update storage policies to be more permissive
DROP POLICY IF EXISTS "storage_all_operations" ON storage.objects;

CREATE POLICY "storage_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "storage_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-attachments');

CREATE POLICY "storage_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'issue-attachments');