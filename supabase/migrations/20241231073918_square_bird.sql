/*
  # Add set_claim function for custom authentication

  1. Changes
    - Add function to set user_email claim for RLS policies
    
  2. Security
    - Function is accessible to all authenticated users
    - Claims are used for RLS policy checks
*/

CREATE OR REPLACE FUNCTION set_claim(claim text, value text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.' || claim, value, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;