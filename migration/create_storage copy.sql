-- Drop existing storage objects and policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "storage_all_operations" ON storage.objects;
  DROP POLICY IF EXISTS "storage_select" ON storage.objects;
  DROP POLICY IF EXISTS "storage_insert" ON storage.objects;
  DROP POLICY IF EXISTS "storage_delete" ON storage.objects;
  
  -- Delete existing bucket
  DELETE FROM storage.buckets WHERE id = 'issue-attachments';
END $$;

-- Create storage bucket with minimal configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-attachments', 'issue-attachments', true);

-- Create single permissive policy for all operations
CREATE POLICY "storage_all_operations"
ON storage.objects FOR ALL
USING (bucket_id = 'issue-attachments')
WITH CHECK (bucket_id = 'issue-attachments');
