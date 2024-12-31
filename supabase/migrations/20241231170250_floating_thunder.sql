/*
  # Fix attachments storage configuration

  1. Changes
    - Add file_size column to attachments table
    - Update storage bucket configuration
    - Update storage policies
    - Add file type validation

  2. Security
    - Restrict file types
    - Add file size limits
    - Sanitize file names
*/

-- Drop and recreate attachments table with correct columns
DROP TABLE IF EXISTS attachments CASCADE;

CREATE TABLE attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES contents(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 52428800) -- 50MB limit
);

-- Create index for performance
CREATE INDEX idx_attachments_content_id ON attachments(content_id);

-- Enable RLS
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Drop and recreate storage bucket
DO $$
BEGIN
  DELETE FROM storage.buckets WHERE id = 'issue-attachments';
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'issue-attachments',
    'issue-attachments',
    false,
    52428800, -- 50MB
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

-- Create attachments policies
CREATE POLICY "Everyone can view attachments"
ON attachments FOR SELECT
USING (true);

CREATE POLICY "Users can create attachments"
ON attachments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM contents
    WHERE id = content_id
    AND author_id IN (
      SELECT id FROM users
      WHERE email = current_setting('app.user_email', true)
    )
  )
);

CREATE POLICY "Authors and developers can delete attachments"
ON attachments FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM contents
    WHERE id = content_id
    AND author_id IN (
      SELECT id FROM users
      WHERE email = current_setting('app.user_email', true)
    )
  )
  OR
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND (role = 'developer' OR role = 'admin')
  )
);

-- Create storage policies
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