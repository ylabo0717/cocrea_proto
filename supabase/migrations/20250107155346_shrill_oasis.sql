-- Drop existing policies
DROP POLICY IF EXISTS "Allow all reads" ON applications;
DROP POLICY IF EXISTS "Allow developer creates" ON applications;
DROP POLICY IF EXISTS "Allow developer updates" ON applications;
DROP POLICY IF EXISTS "Allow developer deletes" ON applications;

-- Create new policies
CREATE POLICY "applications_select"
ON applications FOR SELECT
USING (true);

CREATE POLICY "applications_insert"
ON applications FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND role IN ('developer', 'admin')
  )
);

CREATE POLICY "applications_update"
ON applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND role IN ('developer', 'admin')
  )
);

CREATE POLICY "applications_delete"
ON applications FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND role IN ('developer', 'admin')
  )
);