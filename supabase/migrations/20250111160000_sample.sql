-- Insert sample data
DO $$ 
DECLARE
  admin_salt text := 'cocrea_secure_salt_2024';
  -- Hash for 'admin123'
  admin_hash text := '10366850544789f8f845ec29eeb60ab7fb6da11c223960e05187fa58c25a595ea1540e2aaef13f0e5ba0e977956a88f97de7d4024448ae26327b5db75b76600b';
  -- Hash for 'CocreaTest2024!'
  test_hash text := 'ba437c9c81a632d1370021fe97d0c96e7bb5c7b309ffc00e56d9d1b1e7bed1e6065f0289585d94c36097f40b3b59f2a2237acee92ce25a9e0f1ba4e573e6ffcc';
BEGIN 
  -- Delete all existing sample data
  DELETE FROM contents;
  DELETE FROM applications;
  DELETE FROM users;

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
     (SELECT id FROM users WHERE email = 'sato@example.com'), 60),
    ('信号解析アプリ', '信号を解析するアプリです', 'development',
     (SELECT id FROM users WHERE email = 'sato@example.com'), 60),
    ('データ取得アプリ', 'データを取得するアプリです', 'development',
     (SELECT id FROM users WHERE email = 'sato@example.com'), 80),
    ('進捗確認アプリ', '進捗確認のためのアプリです', 'development',
     (SELECT id FROM users WHERE email = 'yamada@example.com'), 80),
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

  -- Insert additional sample issues
  INSERT INTO contents (type, title, body, status, priority, author_id, application_id) VALUES
    ('issue', '画像分類アプリのクラッシュ', 
    E'## 現象\n\n画像分類アプリが特定の画像を処理中にクラッシュします。\n\n## 再現手順\n\n1. アプリを起動\n2. 特定の画像をアップロード\n3. クラッシュが発生',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ')),

    ('issue', 'データ解析ダッシュボードのメモリリーク', 
    E'## 現象\n\nデータ解析ダッシュボードを長時間使用するとメモリリークが発生します。\n\n## 再現手順\n\n1. ダッシュボードを開く\n2. 数時間使用する\n3. メモリ使用量が増加し続ける',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード')),

    ('issue', '信号解析アプリのデータ保存エラー', 
    E'## 現象\n\n信号解析アプリでデータ保存時にエラーが発生します。\n\n## 再現手順\n\n1. アプリを起動\n2. データを解析\n3. 保存ボタンをクリック\n4. エラーが表示される',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ')),

    ('issue', 'データ取得アプリのタイムアウト', 
    E'## 現象\n\nデータ取得アプリで大規模データを取得する際にタイムアウトが発生します。\n\n## 再現手順\n\n1. アプリを起動\n2. 大規模データを取得\n3. タイムアウトエラーが発生',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ')),

    ('issue', '進捗確認アプリの進捗バーが更新されない', 
    E'## 現象\n\n進捗確認アプリで進捗バーが正しく更新されません。\n\n## 再現手順\n\n1. アプリを起動\n2. 進捗を更新\n3. 進捗バーが変化しない',
    'open', 'low', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ')),

    ('issue', 'テキスト解析サービスの文字化け', 
    E'## 現象\n\nテキスト解析サービスで特定の文字が文字化けします。\n\n## 再現手順\n\n1. アプリを起動\n2. 特定の文字を含むテキストを解析\n3. 文字化けが発生',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス')),

    ('issue', '画像分類アプリの精度低下', 
    E'## 現象\n\n画像分類アプリの分類精度が低下しています。\n\n## 再現手順\n\n1. アプリを起動\n2. 画像をアップロード\n3. 分類結果が不正確',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ')),

    ('issue', 'データ解析ダッシュボードのグラフ表示エラー', 
    E'## 現象\n\nデータ解析ダッシュボードでグラフが正しく表示されません。\n\n## 再現手順\n\n1. ダッシュボードを開く\n2. データを選択\n3. グラフが表示されない',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード')),

    ('issue', '信号解析アプリの解析結果が不正確', 
    E'## 現象\n\n信号解析アプリの解析結果が不正確です。\n\n## 再現手順\n\n1. アプリを起動\n2. 信号データを解析\n3. 結果が不正確',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ')),

    ('issue', 'データ取得アプリのUIバグ', 
    E'## 現象\n\nデータ取得アプリのUIにバグがあります。\n\n## 再現手順\n\n1. アプリを起動\n2. 特定の操作を行う\n3. UIが崩れる',
    'open', 'low', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ')),

    ('issue', '進捗確認アプリの通知機能が動作しない', 
    E'## 現象\n\n進捗確認アプリの通知機能が動作しません。\n\n## 再現手順\n\n1. アプリを起動\n2. 通知を設定\n3. 通知が届かない',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ')),

    ('issue', 'テキスト解析サービスの結果が遅い', 
    E'## 現象\n\nテキスト解析サービスの解析結果が遅いです。\n\n## 再現手順\n\n1. アプリを起動\n2. テキストを解析\n3. 結果が表示されるまで時間がかかる',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス'));

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