-- Drop all existing policies
DROP POLICY IF EXISTS "attachments_all" ON attachments;
DROP POLICY IF EXISTS "storage_public_select" ON storage.objects;
DROP POLICY IF EXISTS "storage_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_public_delete" ON storage.objects;

-- Create a single permissive policy for attachments
CREATE POLICY "attachments_all_operations"
ON attachments FOR ALL
USING (true)
WITH CHECK (true);

-- Create a single permissive policy for storage
CREATE POLICY "storage_all_operations"
ON storage.objects FOR ALL
USING (bucket_id = 'issue-attachments')
WITH CHECK (bucket_id = 'issue-attachments');

-- Make sure storage bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'issue-attachments';

-- Make sure content_id is nullable
ALTER TABLE attachments
ALTER COLUMN content_id DROP NOT NULL;