-- Drop existing update policy
DROP POLICY IF EXISTS "Developers and admins can update contents" ON contents;

-- Create new update policy with simplified conditions
CREATE POLICY "Allow content updates"
  ON contents FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Note: This is a temporary policy for debugging. 
-- In production, you should implement proper RLS.