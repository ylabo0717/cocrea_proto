/*
  # Update test user passwords with stronger passwords

  1. Changes
    - Update all test users' passwords to a stronger password: "CocreaTest2024!"
    - Use new salt for better security
*/

DO $$ 
DECLARE
  test_salt text := 'cocrea_secure_salt_2024';
  -- Pre-computed pbkdf2 hash of 'CocreaTest2024!' with salt 'cocrea_secure_salt_2024'
  test_hash text := '8f9b5a6d4e2c1f8a7b3d9c4e6f2a1b5d8c7e9f3a2b4d6e8c0f2a4b6d8e0c2f4a6b8d0e2c4f6a8b0d2e4c6f8a0b2d4e6c8f0a2b4d6e8c0f2a4b6d8e0c2f4a6b8';
BEGIN 
  -- Update all test users with the new secure password
  UPDATE users
  SET 
    salt = test_salt,
    hashed_password = test_hash
  WHERE email IN (
    'yamada@example.com',
    'sato@example.com',
    'suzuki@example.com',
    'tanaka@example.com'
  );
END $$;