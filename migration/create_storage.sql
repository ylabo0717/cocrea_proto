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

DROP POLICY IF EXISTS "attachments_all_operations" ON attachments;

CREATE POLICY "attachments_select"
ON attachments FOR SELECT
USING (true);

CREATE POLICY "attachments_insert"
ON attachments FOR INSERT
WITH CHECK (true);

CREATE POLICY "attachments_delete"
ON attachments FOR DELETE
USING (true);
