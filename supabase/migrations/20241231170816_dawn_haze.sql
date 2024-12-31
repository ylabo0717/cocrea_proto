/*
  # Simplify storage policies

  1. Changes
    - Drop all existing complex policies
    - Create simple public access policy
    - Create simple upload policy
    - Create simple delete policy

  2. Security
    - Allow public read access
    - Allow authenticated uploads
    - Allow authenticated deletes
*/

-- Drop existing policies
DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "storage_owner_delete" ON storage.objects;

-- Recreate bucket with simple configuration
DELETE FROM storage.buckets WHERE id = 'issue-attachments';
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-attachments', 'issue-attachments', true);

-- Create simple storage policies
CREATE POLICY "allow_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "allow_uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-attachments');

CREATE POLICY "allow_deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'issue-attachments');

-- Update attachments policies to match
DROP POLICY IF EXISTS "Public View" ON attachments;
DROP POLICY IF EXISTS "Owner Upload" ON attachments;
DROP POLICY IF EXISTS "Owner Delete" ON attachments;

CREATE POLICY "allow_view"
ON attachments FOR SELECT
USING (true);

CREATE POLICY "allow_create"
ON attachments FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow_delete"
ON attachments FOR DELETE
USING (true);