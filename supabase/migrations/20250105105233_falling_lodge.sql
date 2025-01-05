-- Update valid_type constraint to include 'request' type
ALTER TABLE contents 
DROP CONSTRAINT IF EXISTS valid_type;

ALTER TABLE contents
ADD CONSTRAINT valid_type 
CHECK (type IN ('issue', 'knowledge', 'request'));