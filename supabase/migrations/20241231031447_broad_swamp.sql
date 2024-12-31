/*
  # Initial Schema for Cocrea Platform

  1. Tables
    - users: ユーザー情報
    - applications: アプリケーション情報（開発者情報を含む）
    - contents: Issues/Knowledge共通のコンテンツ
    - comments: コンテンツへのコメント
    - likes: コンテンツへのいいね

  2. Security
    - すべてのテーブルでRLSを有効化
    - 適切なポリシーを設定
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  department text,
  contact text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('developer', 'user'))
);

-- Create applications table
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'development',
  next_release_date timestamptz,
  user_count int DEFAULT 0,
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
-- Users can read all users
CREATE POLICY "Users can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Everyone can read applications
CREATE POLICY "Everyone can read applications"
  ON applications FOR SELECT
  TO authenticated
  USING (true);

-- Developers can update applications
CREATE POLICY "Developers can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = developer_id)
  WITH CHECK (auth.uid() = developer_id);

-- Developers can create applications
CREATE POLICY "Developers can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = developer_id);

-- Developers can delete their applications
CREATE POLICY "Developers can delete their applications"
  ON applications FOR DELETE
  TO authenticated
  USING (auth.uid() = developer_id);

-- Everyone can read contents
CREATE POLICY "Everyone can read contents"
  ON contents FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create contents
CREATE POLICY "Authenticated users can create contents"
  ON contents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their contents
CREATE POLICY "Authors can update their contents"
  ON contents FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Everyone can read comments
CREATE POLICY "Everyone can read comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authors can update their comments
CREATE POLICY "Authors can update their comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Everyone can read likes
CREATE POLICY "Everyone can read likes"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage their likes
CREATE POLICY "Authenticated users can manage their likes"
  ON likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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