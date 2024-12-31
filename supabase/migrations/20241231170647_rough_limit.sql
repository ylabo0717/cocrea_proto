/*
  # Fix storage policy configuration

  1. Changes
    - Drop existing policies first
    - Recreate storage bucket with proper settings
    - Add new policies with correct permissions

  2. Security
    - Public read access for attachments
    - Authenticated upload access
    - Owner/developer delete access
*/

-- Drop existing policies first
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;

-- Recreate bucket with proper configuration
DELETE FROM storage.buckets WHERE id = 'issue-attachments';
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) VALUES (
  'issue-attachments',
  'issue-attachments',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]
);

-- Create new storage policies
CREATE POLICY "storage_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "storage_authenticated_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'issue-attachments' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "storage_owner_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'issue-attachments' AND
  (
    EXISTS (
      SELECT 1 FROM contents c
      JOIN attachments a ON a.content_id = c.id
      WHERE c.author_id IN (
        SELECT id FROM users
        WHERE email = current_setting('app.user_email', true)
      )
      AND storage.objects.name = a.file_path
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE email = current_setting('app.user_email', true)
      AND (role = 'developer' OR role = 'admin')
    )
  )
);