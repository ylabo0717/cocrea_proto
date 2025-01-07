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
  public
) VALUES (
  'issue-attachments',
  'issue-attachments',
  true
);

-- Create storage policies
CREATE POLICY "storage_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "storage_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-attachments');

CREATE POLICY "storage_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'issue-attachments');

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