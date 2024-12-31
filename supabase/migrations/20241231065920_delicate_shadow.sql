/*
  # Update test user passwords

  1. Changes
    - Update test users' passwords with correctly hashed values using pbkdf2
    - Set default salt for test accounts
*/

DO $$ 
DECLARE
  test_salt text := 'default_salt_123';
  -- Pre-computed pbkdf2 hash of 'password123' with salt 'default_salt_123'
  test_hash text := '7c9e0b0b54c988e23f9816e30b1e70d46dbe8f2c654fe03098a7e824d6b33a61a0487e55c460f9f95c76417792ba8123c7099f6675fa75a58577d07c8d9c0958';
BEGIN 
  -- Update yamada's password
  UPDATE users
  SET 
    salt = test_salt,
    hashed_password = test_hash
  WHERE email = 'yamada@example.com';

  -- Update other test users with the same password
  UPDATE users
  SET 
    salt = test_salt,
    hashed_password = test_hash
  WHERE email IN ('sato@example.com', 'suzuki@example.com', 'tanaka@example.com');
END $$;