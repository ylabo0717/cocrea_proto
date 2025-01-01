-- Drop existing policies
DROP POLICY IF EXISTS "Allow read contents" ON contents;
DROP POLICY IF EXISTS "Allow create contents" ON contents;
DROP POLICY IF EXISTS "Allow update contents" ON contents;

-- Create new policies with proper permissions
CREATE POLICY "contents_select_policy"
ON contents FOR SELECT
USING (true);

CREATE POLICY "contents_insert_policy"
ON contents FOR INSERT
WITH CHECK (
  author_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "contents_update_policy"
ON contents FOR UPDATE
USING (
  author_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  ) OR
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND (role = 'developer' OR role = 'admin')
  )
);

CREATE POLICY "contents_delete_policy"
ON contents FOR DELETE
USING (
  author_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  ) OR
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND (role = 'developer' OR role = 'admin')
  )
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_contents_author_id ON contents(author_id);
CREATE INDEX IF NOT EXISTS idx_contents_application_id ON contents(application_id);