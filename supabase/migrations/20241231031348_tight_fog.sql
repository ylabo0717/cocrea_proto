/*
  # Simplify Schema by removing application_developers table

  1. Changes
    - Remove `application_developers` table
    - Add `developer_id` to `applications` table
    - Update RLS policies

  2. Security
    - Maintain RLS on all tables
    - Update policies to use developer_id directly
*/

-- Add developer_id to applications
ALTER TABLE applications
ADD COLUMN developer_id uuid REFERENCES users(id) ON DELETE SET NULL;

-- Drop application_developers table and related policies
DROP TABLE IF EXISTS application_developers CASCADE;

-- Update applications policies
DROP POLICY IF EXISTS "Developers can update applications" ON applications;

CREATE POLICY "Developers can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = developer_id)
  WITH CHECK (auth.uid() = developer_id);

-- Add policy for creating applications
CREATE POLICY "Developers can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = developer_id);

-- Add policy for deleting applications
CREATE POLICY "Developers can delete their applications"
  ON applications FOR DELETE
  TO authenticated
  USING (auth.uid() = developer_id);