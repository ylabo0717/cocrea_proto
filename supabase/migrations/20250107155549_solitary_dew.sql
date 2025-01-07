-- Drop existing policies
DROP POLICY IF EXISTS "applications_select" ON applications;
DROP POLICY IF EXISTS "applications_insert" ON applications;
DROP POLICY IF EXISTS "applications_update" ON applications;
DROP POLICY IF EXISTS "applications_delete" ON applications;

-- Create single permissive policy for all operations
CREATE POLICY "applications_all_operations"
ON applications FOR ALL
USING (true)
WITH CHECK (true);