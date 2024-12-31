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

-- Insert sample data
DO $$ 
DECLARE
  admin_salt text := 'cocrea_secure_salt_2024';
  -- Hash for 'admin123'
  admin_hash text := '10366850544789f8f845ec29eeb60ab7fb6da11c223960e05187fa58c25a595ea1540e2aaef13f0e5ba0e977956a88f97de7d4024448ae26327b5db75b76600b';
  -- Hash for 'CocreaTest2024!'
  test_hash text := 'ba437c9c81a632d1370021fe97d0c96e7bb5c7b309ffc00e56d9d1b1e7bed1e6065f0289585d94c36097f40b3b59f2a2237acee92ce25a9e0f1ba4e573e6ffcc';
BEGIN 
  -- Insert admin user
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

  -- Insert test users
  INSERT INTO users (name, email, department, role, salt, hashed_password) VALUES
    ('山田太郎', 'yamada@example.com', '開発部', 'developer', admin_salt, test_hash),
    ('佐藤花子', 'sato@example.com', '開発部', 'developer', admin_salt, test_hash),
    ('鈴木一郎', 'suzuki@example.com', '営業部', 'user', admin_salt, test_hash),
    ('田中美咲', 'tanaka@example.com', 'マーケティング部', 'user', admin_salt, test_hash);

  -- Insert sample applications
  INSERT INTO applications (name, description, status, developer_id, progress) VALUES
    ('営業管理システム', 'リアルタイム営業データ分析プラットフォーム', 'released', 
     (SELECT id FROM users WHERE email = 'yamada@example.com'), 80),
    ('マーケティングハブ', 'キャンペーン管理システム', 'development',
     (SELECT id FROM users WHERE email = 'sato@example.com'), 45),
    ('人事ポータル', '従業員管理システム', 'released',
     (SELECT id FROM users WHERE email = 'yamada@example.com'), 95);

  -- Insert sample issues
  INSERT INTO contents (type, title, body, status, priority, author_id, application_id)
  SELECT 
    'issue',
    'ダッシュボードの表示速度改善',
    E'# 課題の概要\n\nダッシュボードの初期表示に時間がかかりすぎている（3秒以上）。\n\n## 現状の問題点\n\n- 大量のデータを一度に取得している\n- 画像の最適化ができていない\n- クエリの実行回数が多い',
    'open',
    'high',
    (SELECT id FROM users WHERE email = 'suzuki@example.com'),
    (SELECT id FROM applications WHERE name = '営業管理システム');
END $$;