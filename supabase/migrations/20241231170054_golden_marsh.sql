/*
  # Fix attachments storage configuration

  1. Changes
    - Update storage bucket configuration
    - Add file name sanitization function
    - Update storage policies
    - Add file type validation

  2. Security
    - Restrict file types
    - Add file size limits
    - Sanitize file names
*/

-- Create a function to sanitize file names
CREATE OR REPLACE FUNCTION sanitize_filename(filename text)
RETURNS text AS $$
BEGIN
  -- Remove potentially dangerous characters and replace spaces
  RETURN regexp_replace(
    regexp_replace(filename, '[^a-zA-Z0-9._-]', '_', 'g'),
    '\s+', '_',
    'g'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update storage bucket configuration
UPDATE storage.buckets
SET public = false,
    file_size_limit = 52428800, -- 50MB
    allowed_mime_types = ARRAY[
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
WHERE id = 'issue-attachments';

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authors and developers can delete files" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'issue-attachments' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'issue-attachments' AND
  (file_size > 0 AND file_size <= 52428800) AND
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "Allow content owners and developers to delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'issue-attachments' AND
  (
    EXISTS (
      SELECT 1 FROM contents c
      JOIN attachments a ON a.content_id = c.id
      JOIN users u ON u.id = c.author_id
      WHERE u.email = current_setting('app.user_email', true)
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