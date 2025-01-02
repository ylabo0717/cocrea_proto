-- Drop existing policies
DROP POLICY IF EXISTS "Public View" ON attachments;
DROP POLICY IF EXISTS "Owner Upload" ON attachments;
DROP POLICY IF EXISTS "Owner Delete" ON attachments;

-- Create simplified policies
CREATE POLICY "attachments_select"
ON attachments FOR SELECT
USING (true);

CREATE POLICY "attachments_insert"
ON attachments FOR INSERT
WITH CHECK (true);

CREATE POLICY "attachments_delete"
ON attachments FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM contents c
    WHERE c.id = content_id
    AND (
      c.author_id IN (
        SELECT id FROM users 
        WHERE email = current_setting('app.user_email', true)
      ) OR
      EXISTS (
        SELECT 1 FROM users
        WHERE email = current_setting('app.user_email', true)
        AND (role = 'developer' OR role = 'admin')
      )
    )
);

-- Update storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;

CREATE POLICY "storage_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "storage_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-attachments');

CREATE POLICY "storage_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'issue-attachments');