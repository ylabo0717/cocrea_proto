-- Drop existing policies
DROP POLICY IF EXISTS "Allow read contents" ON contents;
DROP POLICY IF EXISTS "Allow create contents" ON contents;
DROP POLICY IF EXISTS "Allow update contents" ON contents;

-- Create new policies
CREATE POLICY "Allow read contents"
  ON contents FOR SELECT
  USING (true);

CREATE POLICY "Allow create contents"
  ON contents FOR INSERT
  WITH CHECK (
    author_id IS NOT NULL AND
    application_id IS NOT NULL AND
    type = 'issue'
  );

CREATE POLICY "Allow update contents"
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