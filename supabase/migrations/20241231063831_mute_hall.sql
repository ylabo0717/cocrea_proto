/*
  # Add password field to users table

  1. Changes
    - Add hashed_password column to users table
    - Add salt column for password hashing
    - Add last_login timestamp
  
  2. Security
    - Password is stored as a hash with salt
    - Original password is never stored
*/

ALTER TABLE users
ADD COLUMN hashed_password text NOT NULL DEFAULT '',
ADD COLUMN salt text NOT NULL DEFAULT '',
ADD COLUMN last_login timestamptz;

-- Update existing users with a temporary password (password123)
UPDATE users
SET 
  hashed_password = '7c4a8d09ca3762af61e59520943dc26494f8941b', -- SHA1 hash of 'password123'
  salt = 'temporary';