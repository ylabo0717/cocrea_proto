/*
  # Fix storage and attachment handling

  1. Changes
    - Reconfigure storage bucket settings
    - Update storage and RLS policies
    - Add proper constraints and validations

  2. Security
    - Enforce file size limits
    - Restrict file types
    - Proper access control
*/

-- Drop existing bucket and policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
  DROP POLICY IF EXISTS "Allow user uploads" ON storage.objects;
  DROP POLICY IF EXISTS "Allow owner and developer deletes" ON storage.objects;
  
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
END $$;

-- Create storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'issue-attachments' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "Owner Delete"
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
ALTER TABLE attachments DROP CONSTRAINT IF EXISTS valid_mime_type;
ALTER TABLE attachments ADD CONSTRAINT valid_mime_type CHECK (
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

-- Update attachments policies
DROP POLICY IF EXISTS "Everyone can view attachments" ON attachments;
DROP POLICY IF EXISTS "Users can create attachments" ON attachments;
DROP POLICY IF EXISTS "Authors and developers can delete attachments" ON attachments;

CREATE POLICY "Public View"
ON attachments FOR SELECT
USING (true);

CREATE POLICY "Owner Upload"
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

CREATE POLICY "Owner Delete"
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