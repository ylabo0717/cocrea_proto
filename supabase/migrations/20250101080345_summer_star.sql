-- Keep existing SELECT policy
DROP POLICY IF EXISTS "comments_update" ON comments;

-- Create new UPDATE policy with simplified conditions
CREATE POLICY "comments_update"
ON comments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = current_setting('app.user_email', true)
    AND id = comments.user_id
  )
);

-- Ensure proper return type for single row updates
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