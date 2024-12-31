/*
  # Add issue attachments support

  1. New Tables
    - `attachments`
      - `id` (uuid, primary key)
      - `content_id` (uuid, references contents)
      - `file_name` (text)
      - `file_path` (text)
      - `file_size` (bigint)
      - `mime_type` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Storage
    - Create bucket for issue attachments
    - Set up public access policies

  3. Security
    - Enable RLS on attachments table
    - Add policies for CRUD operations using custom authentication
*/

-- Create attachments table
CREATE TABLE attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES contents(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_file_size CHECK (file_size > 0)
);

-- Create index for performance
CREATE INDEX idx_attachments_content_id ON attachments(content_id);

-- Enable RLS
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-attachments', 'issue-attachments', true);

-- Create storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'issue-attachments' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "Authors and developers can delete files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'issue-attachments' AND
  (
    -- Content author
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
    -- Developer or admin
    EXISTS (
      SELECT 1 FROM users
      WHERE email = current_setting('app.user_email', true)
      AND (role = 'developer' OR role = 'admin')
    )
  )
);

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

-- Create updated_at trigger
CREATE TRIGGER update_attachments_updated_at
  BEFORE UPDATE ON attachments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();