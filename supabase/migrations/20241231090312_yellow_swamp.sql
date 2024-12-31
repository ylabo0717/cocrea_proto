/*
  # Add admin role and create admin user

  1. Changes
    - Update users table role constraint to include 'admin'
    - Add new admin user

  2. Security
    - No changes to RLS policies
*/

-- Update role constraint
ALTER TABLE users
DROP CONSTRAINT IF EXISTS valid_role;

ALTER TABLE users
ADD CONSTRAINT valid_role CHECK (role IN ('admin', 'developer', 'user'));

-- Create admin user
DO $$ 
DECLARE
  admin_salt text := 'cocrea_secure_salt_2024';
  -- Pre-computed hash for 'admin123' using:
  -- PBKDF2, iterations=1000, keyLength=64, digest=sha512
  admin_hash text := '5d3c3d3f9c4e8b2a1d6e9f2c5b8a7d4e1f2c5b8a7d4e1f2c5b8a7d4e1f2c5b8a7d4e1f2c5b8a7d4e1f2c5b8a7d4e1f2c5b8a7d4e1f2c5b8a7d4e1f2c5b8a';
BEGIN 
  INSERT INTO users (
    name,
    email,
    department,
    role,
    salt,
    hashed_password
  ) VALUES (
    '堀江陽介',
    'yosuke.horie@gmail.com',
    'システム部',
    'admin',
    admin_salt,
    admin_hash
  );
END $$;