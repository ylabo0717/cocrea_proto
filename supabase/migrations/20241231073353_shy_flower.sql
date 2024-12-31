/*
  # Update application policies

  1. Changes
    - Add policy for authenticated users to create applications
    - Update existing policies to use auth.uid() instead of current_setting
    
  2. Security
    - Ensure authenticated users can create applications
    - Maintain existing read/update/delete policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Everyone can read applications" ON applications;
DROP POLICY IF EXISTS "Developers can update applications" ON applications;
DROP POLICY IF EXISTS "Developers can create applications" ON applications;
DROP POLICY IF EXISTS "Developers can delete their applications" ON applications;

-- Recreate policies with auth.uid()
CREATE POLICY "Everyone can read applications"
  ON applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Developers can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = developer_id)
  WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can delete their applications"
  ON applications FOR DELETE
  TO authenticated
  USING (auth.uid() = developer_id);