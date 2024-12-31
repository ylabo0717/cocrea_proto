/*
  # Update applications table structure
  
  1. Changes
    - Remove user_count column
    - Add progress column for tracking project progress
    
  2. Data Migration
    - Convert existing user_count to progress percentage
*/

-- Add progress column
ALTER TABLE applications 
ADD COLUMN progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);

-- Remove user_count column
ALTER TABLE applications 
DROP COLUMN user_count;