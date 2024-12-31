/*
  # Initial Schema for Cocrea Platform

  1. New Tables
    - `users` - User profiles and authentication
      - `id` (uuid, primary key) - Maps to auth.users
      - `name` (text) - Full name
      - `email` (text) - Email address
      - `department` (text) - Department name
      - `contact` (text) - Contact information
      - `role` (text) - User role (developer/user)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `applications` - Internal applications
      - `id` (uuid, primary key)
      - `name` (text) - Application name
      - `description` (text) - Application description
      - `status` (text) - Development status
      - `next_release_date` (timestamptz) - Next planned release
      - `user_count` (int) - Number of users
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `application_developers` - Mapping between applications and developers
      - `id` (uuid, primary key)
      - `application_id` (uuid) - Reference to applications
      - `user_id` (uuid) - Reference to users
      - `role` (text) - Developer role
      - `created_at` (timestamptz)

    - `contents` - Shared table for Issues and Knowledge
      - `id` (uuid, primary key)
      - `type` (text) - Content type (issue/knowledge)
      - `title` (text) - Content title
      - `body` (text) - Main content
      - `status` (text) - Status for issues
      - `priority` (text) - Priority for issues
      - `category` (text) - Category for knowledge
      - `tags` (text[]) - Tags array
      - `author_id` (uuid) - Reference to users
      - `application_id` (uuid) - Reference to applications
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `comments` - Comments on contents
      - `id` (uuid, primary key)
      - `content_id` (uuid) - Reference to contents
      - `user_id` (uuid) - Reference to users
      - `body` (text) - Comment text
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `likes` - Likes on contents
      - `id` (uuid, primary key)
      - `content_id` (uuid) - Reference to contents
      - `user_id` (uuid) - Reference to users
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('development', 'released', 'discontinued'))
);

-- Create application_developers table
CREATE TABLE application_developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'developer',
  created_at timestamptz DEFAULT now(),
  UNIQUE(application_id, user_id)
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
ALTER TABLE application_developers ENABLE ROW LEVEL SECURITY;
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

-- Developers can update their applications
CREATE POLICY "Developers can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM application_developers
      WHERE application_id = applications.id
      AND user_id = auth.uid()
    )
  );

-- Everyone can read application developers
CREATE POLICY "Everyone can read application developers"
  ON application_developers FOR SELECT
  TO authenticated
  USING (true);

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