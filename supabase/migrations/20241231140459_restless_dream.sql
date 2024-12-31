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
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('issue', 'knowledge')),
  CONSTRAINT valid_status CHECK (status IS NULL OR status IN ('open', 'in_progress', 'resolved')),
  CONSTRAINT valid_priority CHECK (priority IS NULL OR priority IN ('low', 'medium', 'high'))
);

-- Create comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES contents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create likes table
CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES contents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (
    id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
    )
  );

-- Applications policies
CREATE POLICY "Allow all reads"
  ON applications FOR SELECT
  USING (true);

CREATE POLICY "Allow developer creates"
  ON applications FOR INSERT
  WITH CHECK (
    developer_id IN (
      SELECT id FROM users WHERE role = 'developer'
    )
  );

CREATE POLICY "Allow developer updates"
  ON applications FOR UPDATE
  USING (
    developer_id IN (
      SELECT id FROM users WHERE role = 'developer'
    )
  );

CREATE POLICY "Allow developer deletes"
  ON applications FOR DELETE
  USING (
    developer_id IN (
      SELECT id FROM users WHERE role = 'developer'
    )
  );

-- Contents policies
CREATE POLICY "Allow read contents"
  ON contents FOR SELECT
  USING (true);

CREATE POLICY "Allow create contents"
  ON contents FOR INSERT
  WITH CHECK (
    author_id IS NOT NULL AND
    application_id IS NOT NULL AND
    type = 'issue'
  );

CREATE POLICY "Allow update contents"
  ON contents FOR UPDATE
  USING (
    author_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE email = current_setting('app.user_email', true)
      AND (role = 'developer' OR role = 'admin')
    )
  );

-- Comments policies
CREATE POLICY "Everyone can read comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
    )
  );

CREATE POLICY "Authors can update their comments"
  ON comments FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
    )
  );

-- Likes policies
CREATE POLICY "Everyone can read likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their likes"
  ON likes FOR ALL
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE email = current_setting('app.user_email', true)
    )
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
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