/*
  # Update admin user password hash

  1. Changes
    - Update password hash for admin user
*/

DO $$ 
DECLARE
  admin_salt text := 'cocrea_secure_salt_2024';
  -- Correct hash for 'admin123' using:
  -- PBKDF2, iterations=1000, keyLength=64, digest=sha512
  admin_hash text := '10366850544789f8f845ec29eeb60ab7fb6da11c223960e05187fa58c25a595ea1540e2aaef13f0e5ba0e977956a88f97de7d4024448ae26327b5db75b76600b';
BEGIN 
  -- Update admin user password
  UPDATE users
  SET 
    salt = admin_salt,
    hashed_password = admin_hash
  WHERE email = 'yosuke.horie@gmail.com';
END $$;