-- Make content_id nullable
ALTER TABLE attachments
ALTER COLUMN content_id DROP NOT NULL;

-- Update existing policies to be more permissive
DROP POLICY IF EXISTS "attachments_select" ON attachments;
DROP POLICY IF EXISTS "attachments_insert" ON attachments;
DROP POLICY IF EXISTS "attachments_update" ON attachments;
DROP POLICY IF EXISTS "attachments_delete" ON attachments;

CREATE POLICY "attachments_all"
ON attachments FOR ALL
USING (true)
WITH CHECK (true);