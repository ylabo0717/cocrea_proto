-- Drop existing policies
DROP POLICY IF EXISTS "contents_all_operations" ON contents;

-- Create simplified but secure policies
CREATE POLICY "contents_select"
ON contents FOR SELECT
USING (true);

CREATE POLICY "contents_insert"
ON contents FOR INSERT
WITH CHECK (
  author_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "contents_update"
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

CREATE POLICY "contents_delete"
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