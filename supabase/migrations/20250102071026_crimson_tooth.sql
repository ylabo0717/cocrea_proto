-- Drop existing policies and constraints
DROP POLICY IF EXISTS "attachments_all_operations" ON attachments;
DROP POLICY IF EXISTS "storage_all_operations" ON storage.objects;
ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_content_id_fkey;

-- Make content_id nullable without constraints
ALTER TABLE attachments 
ALTER COLUMN content_id DROP NOT NULL;

-- Create simple permissive policies
CREATE POLICY "attachments_all"
ON attachments FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "storage_all"
ON storage.objects FOR ALL
USING (bucket_id = 'issue-attachments')
WITH CHECK (bucket_id = 'issue-attachments');

-- Make sure storage bucket is public and unrestricted
UPDATE storage.buckets
SET public = true,
    file_size_limit = null,
    allowed_mime_types = null
WHERE id = 'issue-attachments';