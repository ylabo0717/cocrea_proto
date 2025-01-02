-- Drop existing foreign key constraint
ALTER TABLE attachments
DROP CONSTRAINT IF EXISTS attachments_content_id_fkey;

-- Make content_id nullable and add deferred constraint
ALTER TABLE attachments
ALTER COLUMN content_id DROP NOT NULL;

-- Add new foreign key constraint that allows NULL
ALTER TABLE attachments
ADD CONSTRAINT attachments_content_id_fkey
FOREIGN KEY (content_id) 
REFERENCES contents(id)
ON DELETE CASCADE
DEFERRABLE INITIALLY DEFERRED;

-- Update storage bucket configuration
UPDATE storage.buckets
SET public = true
WHERE id = 'issue-attachments';

-- Drop existing storage policies
DROP POLICY IF EXISTS "storage_select" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete" ON storage.objects;

-- Create more permissive storage policies
CREATE POLICY "storage_public_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "storage_public_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-attachments');

CREATE POLICY "storage_public_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'issue-attachments');