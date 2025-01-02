-- Drop existing policies
DROP POLICY IF EXISTS "attachments_select" ON attachments;
DROP POLICY IF EXISTS "attachments_insert" ON attachments;
DROP POLICY IF EXISTS "attachments_delete" ON attachments;
DROP POLICY IF EXISTS "storage_select" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete" ON storage.objects;

-- Create simplified policies for attachments
CREATE POLICY "attachments_all_operations"
ON attachments FOR ALL
USING (true)
WITH CHECK (true);

-- Create simplified policies for storage
CREATE POLICY "storage_all_operations"
ON storage.objects FOR ALL
USING (bucket_id = 'issue-attachments')
WITH CHECK (bucket_id = 'issue-attachments');

-- Drop and recreate storage bucket with proper configuration
DELETE FROM storage.buckets WHERE id = 'issue-attachments';
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-attachments', 'issue-attachments', true);

-- Drop existing foreign key constraint
ALTER TABLE attachments
DROP CONSTRAINT IF EXISTS attachments_content_id_fkey;

-- Add new foreign key constraint with DEFERRABLE
ALTER TABLE attachments
ADD CONSTRAINT attachments_content_id_fkey
FOREIGN KEY (content_id) 
REFERENCES contents(id)
ON DELETE CASCADE
DEFERRABLE INITIALLY DEFERRED;