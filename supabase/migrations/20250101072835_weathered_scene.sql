-- Drop existing policies
DROP POLICY IF EXISTS "Allow read comments" ON comments;
DROP POLICY IF EXISTS "Allow create comments" ON comments;
DROP POLICY IF EXISTS "Allow update own comments" ON comments;
DROP POLICY IF EXISTS "Allow delete own comments" ON comments;

-- Create new policies
CREATE POLICY "Allow read comments"
ON comments FOR SELECT
USING (true);

CREATE POLICY "Allow create comments"
ON comments FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  )
);

CREATE POLICY "Allow update own comments"
ON comments FOR UPDATE
USING (
  user_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  ) OR
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND (role = 'developer' OR role = 'admin')
  )
)
WITH CHECK (
  user_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  ) OR
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND (role = 'developer' OR role = 'admin')
  )
);

CREATE POLICY "Allow delete own comments"
ON comments FOR DELETE
USING (
  user_id IN (
    SELECT id FROM users 
    WHERE email = current_setting('app.user_email', true)
  ) OR
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND (role = 'developer' OR role = 'admin')
  )
);