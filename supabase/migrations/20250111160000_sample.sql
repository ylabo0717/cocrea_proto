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
    ('データ解析ダッシュボード', 'リアルタイムにデータを解析してダッシュボードとして表示するWebサービスです', 'released', 
     (SELECT id FROM users WHERE email = 'yamada@example.com'), 80),
    ('画像分類アプリ', '画像を分類するアプリです', 'development',
     (SELECT id FROM users WHERE email = 'sato@example.com'), 45),
    ('テキスト解析サービス', 'テキスト解析するアプリです', 'released',
     (SELECT id FROM users WHERE email = 'yamada@example.com'), 95);

  -- Insert sample issues
  INSERT INTO contents (type, title, body, status, priority, author_id, application_id)
  SELECT 
    'issue',
    'ダッシュボードの表示速度改善',
    E'## 問題点\n\n## ダッシュボードの表示が遅いです。 ##再現方法\n\n1. ダッシュボードを開く\n2. データが表示されるまで待つ',
    'open',
    'high',
    (SELECT id FROM users WHERE email = 'suzuki@example.com'),
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード');

  -- Insert sample knowledge
  INSERT INTO contents (type, title, body, category, tags, author_id, application_id)
  SELECT 
    'knowledge',
    '画像分類アプリ使ってみた',
    E'# 画像分類アプリのレビュー\n\n## 使用した感想\n\n画像分類アプリを実際に使用してみました。\n\n### 良かった点\n- 分類の精度が高い\n- 操作が直感的\n\n### 改善点\n- 処理速度がもう少し速いと良い\n- 一度に複数画像を処理できると便利',
    'review',
    ARRAY['AI', 'image-processing', 'review'],
    (SELECT id FROM users WHERE email = 'tanaka@example.com'),
    (SELECT id FROM applications WHERE name = '画像分類アプリ');

  -- Insert sample requests
  INSERT INTO contents (type, title, body, status, priority, author_id, application_id)
  VALUES
    ('request', 'テキストファイルの類似度分析機能追加',
    E'# テキストファイル類似度分析機能の追加要望\n\n## 概要\n複数のテキストファイル間の類似度を分析する機能が必要です。\n\n## 期待する機能\n- 複数のテキストファイルをアップロード可能\n- ファイル間の類似度をパーセンテージで表示\n- 類似箇所のハイライト表示\n\n## 期待される効果\n- 重複文書の特定が容易になる\n- 文書の盗用チェックが効率化される',
    'open', 'medium',
    (SELECT id FROM users WHERE email = 'tanaka@example.com'),
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス'));

END $$;