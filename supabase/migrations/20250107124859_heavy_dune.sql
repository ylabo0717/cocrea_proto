-- Drop existing storage objects and policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "storage_all_operations" ON storage.objects;
  DROP POLICY IF EXISTS "storage_public_select" ON storage.objects;
  DROP POLICY IF EXISTS "storage_public_insert" ON storage.objects;
  DROP POLICY IF EXISTS "storage_public_delete" ON storage.objects;
  
  -- Delete existing bucket
  DELETE FROM storage.buckets WHERE id = 'issue-attachments';
END $$;

-- Create storage bucket
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  owner
) VALUES (
  'issue-attachments',
  'issue-attachments',
  false, -- privateに変更
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
  ],
  'authenticated'
);

-- Create storage policies
-- 認証済みユーザーのみ閲覧可能
CREATE POLICY "authenticated users can select"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'issue-attachments' 
  AND auth.role() = 'authenticated'
);

-- 認証済みユーザーのみアップロード可能
CREATE POLICY "authenticated users can insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'issue-attachments'
  AND auth.role() = 'authenticated'
  AND (file_size > 0 AND file_size <= 52428800)
);

-- コンテンツの作成者とadmin/developerのみ削除可能
CREATE POLICY "content owners and admins can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'issue-attachments'
  AND (
    auth.uid() IN (
      SELECT c.author_id 
      FROM contents c
      JOIN attachments a ON a.content_id = c.id
      WHERE storage.objects.name = a.file_path
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'developer')
    )
  )
);

-- Create function to sanitize filenames
CREATE OR REPLACE FUNCTION storage.sanitize_filename(filename text)
RETURNS text AS $$
BEGIN
  RETURN regexp_replace(
    regexp_replace(filename, '[^a-zA-Z0-9._-]', '_', 'g'),
    '\s+', '_',
    'g'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;