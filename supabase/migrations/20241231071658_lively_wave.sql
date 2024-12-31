/*
  # Update user passwords with correct hash values

  1. Changes
    - Updates all test users' passwords with correctly generated hash values
    - Uses the same password 'CocreaTest2024!' for all test users
    - Uses PBKDF2 with correct parameters (1000 iterations, 64 bytes key length, SHA-512)

  2. Security
    - Maintains existing RLS policies
    - No structural changes to the users table
*/

DO $$ 
DECLARE
  test_salt text := 'cocrea_secure_salt_2024';
  -- Correctly computed hash for 'CocreaTest2024!' using:
  -- PBKDF2, iterations=1000, keyLength=64, digest=sha512
  test_hash text := 'ba437c9c81a632d1370021fe97d0c96e7bb5c7b309ffc00e56d9d1b1e7bed1e6065f0289585d94c36097f40b3b59f2a2237acee92ce25a9e0f1ba4e573e6ffcc';
BEGIN 
  -- Update all test users with the new correct password hash
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