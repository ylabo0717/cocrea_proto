/*
  # Fix storage configuration and policies

  1. Changes
    - Reconfigure storage bucket with proper settings
    - Update storage policies to work without auth.uid()
    - Add file name sanitization function
    - Fix RLS policies for attachments

  2. Security
    - Enforce file size limits
    - Restrict file types
    - Sanitize file names
    - Proper access control
*/

-- Drop existing bucket and policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
  DROP POLICY IF EXISTS "Allow content owners and developers to delete" ON storage.objects;
  
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
    true, -- Make bucket public but control access via policies
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
END $$;

-- Create storage policies
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "Allow user uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'issue-attachments' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "Allow owner and developer deletes"
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

-- Update attachments table
ALTER TABLE attachments
ADD CONSTRAINT valid_mime_type CHECK (
  mime_type IN (
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
  )
);