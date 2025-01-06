-- Drop existing tables if they exist
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS contents CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  department text,
  contact text,
  role text NOT NULL DEFAULT 'user',
  hashed_password text NOT NULL,
  salt text NOT NULL,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'developer', 'user'))
);

-- Create applications table
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'development',
  next_release_date timestamptz,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  developer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('development', 'released', 'discontinued'))
);

-- Create contents table
CREATE TABLE contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  status text,
  priority text,
  category text,
  tags text[],
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  assignee_id uuid REFERENCES users(id) ON DELETE SET NULL,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('issue', 'knowledge', 'request')),
  CONSTRAINT valid_status CHECK (status IS NULL OR status IN ('open', 'in_progress', 'resolved')),
  CONSTRAINT valid_priority CHECK (priority IS NULL OR priority IN ('low', 'medium', 'high'))
);

-- Create comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES contents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create attachments table
CREATE TABLE attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES contents(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 52428800),
  CONSTRAINT valid_mime_type CHECK (
    mime_type IN (
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    )
  )
);

-- Create likes table
CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES contents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, user_id)
);

-- Create indexes
CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_contents_author_id ON contents(author_id);
CREATE INDEX idx_contents_application_id ON contents(application_id);
CREATE INDEX idx_comments_content_id ON comments(content_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_attachments_content_id ON attachments(content_id);
CREATE INDEX idx_likes_content_id ON likes(content_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_contents_updated_at
  BEFORE UPDATE ON contents
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_attachments_updated_at
  BEFORE UPDATE ON attachments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;