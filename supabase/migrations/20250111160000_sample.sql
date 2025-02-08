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
    'horie@example.com',
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

  -- Insert sample knowledge
  INSERT INTO contents (type, title, body, category, tags, author_id, application_id)
  SELECT 
    'knowledge',
    'フロントエンド開発ガイドライン',
    E'# フロントエンド開発ガイドライン\n\n## コーディング規約\n\n### 1. ファイル構成\n- コンポーネントは機能単位でディレクトリを分割\n- スタイルは同一ディレクトリ内に配置\n- テストファイルは`__tests__`ディレクトリに配置',
    'guidelines',
    ARRAY['frontend', 'development', 'react'],
    (SELECT id FROM users WHERE email = 'yamada@example.com'),
    (SELECT id FROM applications WHERE name = '営業管理システム');

  -- Insert sample requests
  INSERT INTO contents (type, title, body, status, priority, author_id, application_id)
  VALUES
    ('request', 'モバイルアプリ版の開発',
    E'# モバイルアプリ開発の提案\n\n## 背景\n\n多くのユーザーがスマートフォンでの利用を希望しており、モバイルアプリの開発が必要と考えられます。',
    'open', 'high',
    (SELECT id FROM users WHERE email = 'suzuki@example.com'),
    (SELECT id FROM applications WHERE name = '営業管理システム'));
END $$;