-- Drop all existing comment policies
DROP POLICY IF EXISTS "comments_select" ON comments;
DROP POLICY IF EXISTS "comments_update" ON comments;
DROP POLICY IF EXISTS "comments_insert" ON comments;
DROP POLICY IF EXISTS "comments_delete" ON comments;

-- Create a single permissive policy for all operations
CREATE POLICY "comments_all_operations"
ON comments FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure proper function exists for comment retrieval
CREATE OR REPLACE FUNCTION get_comment_with_user(comment_id uuid)
RETURNS TABLE (
  id uuid,
  content_id uuid,
  user_id uuid,
  body text,
  created_at timestamptz,
  updated_at timestamptz,
  user_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.content_id,
    c.user_id,
    c.body,
    c.created_at,
    c.updated_at,
    u.name as user_name
  FROM comments c
  JOIN users u ON u.id = c.user_id
  WHERE c.id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;