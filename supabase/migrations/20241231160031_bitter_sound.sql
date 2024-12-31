/*
  # Add assignee to issues

  1. Changes
    - Add assignee_id column to contents table
    - Add foreign key constraint to users table
    - Add index for performance

  2. Security
    - No changes to RLS policies needed as existing policies cover the new column
*/

-- Add assignee_id column to contents table
ALTER TABLE contents
ADD COLUMN assignee_id uuid REFERENCES users(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX idx_contents_assignee_id ON contents(assignee_id)
WHERE type = 'issue';

-- Update existing issues with sample assignees
UPDATE contents
SET assignee_id = (
  SELECT id FROM users 
  WHERE role = 'developer' 
  ORDER BY random() 
  LIMIT 1
)
WHERE type = 'issue';