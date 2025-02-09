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
    ('鈴木一郎', 'suzuki@example.com', '事業部', 'user', admin_salt, test_hash),
    ('田中美咲', 'tanaka@example.com', 'データサイエンス部', 'user', admin_salt, test_hash);

  -- Insert additional developers
  INSERT INTO users (name, email, department, role, salt, hashed_password) VALUES
    ('高橋健太', 'takahashi@example.com', '開発部', 'developer', admin_salt, test_hash),
    ('伊藤真一', 'ito@example.com', '開発部', 'developer', admin_salt, test_hash),
    ('中村優子', 'nakamura@example.com', '開発部', 'developer', admin_salt, test_hash),
    ('小林直樹', 'kobayashi@example.com', '開発部', 'developer', admin_salt, test_hash),
    ('加藤美穂', 'kato@example.com', '開発部', 'developer', admin_salt, test_hash);

  -- Insert additional users
  INSERT INTO users (name, email, department, role, salt, hashed_password) VALUES
    ('松本一郎', 'matsumoto@example.com', '事業部', 'user', admin_salt, test_hash),
    ('林美咲', 'hayashi@example.com', 'データサイエンス部', 'user', admin_salt, test_hash),
    ('清水健', 'shimizu@example.com', '事業部', 'user', admin_salt, test_hash),
    ('山本花子', 'yamamoto@example.com', 'データ', 'user', admin_salt, test_hash),
    ('森田太郎', 'morita@example.com', '事業部', 'user', admin_salt, test_hash),
    ('石井直子', 'ishii@example.com', 'データサイエンス', 'user', admin_salt, test_hash),
    ('渡辺健一', 'watanabe@example.com', '事業部', 'user', admin_salt, test_hash),
    ('藤田美穂', 'fujita@example.com', 'データサイエンス部', 'user', admin_salt, test_hash),
    ('長谷川一郎', 'hasegawa@example.com', '事業部', 'user', admin_salt, test_hash),
    ('斎藤花子', 'saito@example.com', 'データサイエンス部', 'user', admin_salt, test_hash);

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
  INSERT INTO contents (type, title, body, status, priority, author_id, application_id, created_at)
  SELECT 
    'issue',
    'ダッシュボードの表示速度改善',
    E'## 問題点\n\n## ダッシュボードの表示が遅いです。 ##再現方法\n\n1. ダッシュボードを開く\n2. データが表示されるまで待つ',
    'open',
    'high',
    (SELECT id FROM users WHERE email = 'suzuki@example.com'),
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-09 10:00:00+00';

  -- Insert additional sample issues
  INSERT INTO contents (type, title, body, status, priority, author_id, application_id, created_at) VALUES
    ('issue', '画像分類アプリのクラッシュ', 
    E'## 現象\n\n画像分類アプリが特定の画像を処理中にクラッシュします。\n\n## 再現手順\n\n1. アプリを起動\n2. 特定の画像をアップロード\n3. クラッシュが発生',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-02-09 11:30:00+00'),

    ('issue', 'データ解析ダッシュボードのメモリリーク', 
    E'## 現象\n\nデータ解析ダッシュボードを長時間使用するとメモリリークが発生します。\n\n## 再現手順\n\n1. ダッシュボードを開く\n2. 数時間使用する\n3. メモリ使用量が増加し続ける',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-09 12:00:00+00'),

    ('issue', '信号解析アプリのデータ保存エラー', 
    E'## 現象\n\n信号解析アプリでデータ保存時にエラーが発生します。\n\n## 再現手順\n\n1. アプリを起動\n2. データを解析\n3. 保存ボタンをクリック\n4. エラーが表示される',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ'),
    '2024-02-09 12:30:00+00'),

    ('issue', 'データ取得アプリのタイムアウト', 
    E'## 現象\n\nデータ取得アプリで大規模データを取得する際にタイムアウトが発生します。\n\n## 再現手順\n\n1. アプリを起動\n2. 大規模データを取得\n3. タイムアウトエラーが発生',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ'),
    '2024-02-09 13:00:00+00'),

    ('issue', '進捗確認アプリの進捗バーが更新されない', 
    E'## 現象\n\n進捗確認アプリで進捗バーが正しく更新されません。\n\n## 再現手順\n\n1. アプリを起動\n2. 進捗を更新\n3. 進捗バーが変化しない',
    'open', 'low', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ'),
    '2024-02-09 13:30:00+00'),

    ('issue', 'テキスト解析サービスの文字化け', 
    E'## 現象\n\nテキスト解析サービスで特定の文字が文字化けします。\n\n## 再現手順\n\n1. アプリを起動\n2. 特定の文字を含むテキストを解析\n3. 文字化けが発生',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス'),
    '2024-02-09 14:00:00+00'),

    ('issue', '画像分類アプリの精度低下', 
    E'## 現象\n\n画像分類アプリの分類精度が低下しています。\n\n## 再現手順\n\n1. アプリを起動\n2. 画像をアップロード\n3. 分類結果が不正確',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-02-09 14:30:00+00'),

    ('issue', 'データ解析ダッシュボードのグラフ表示エラー', 
    E'## 現象\n\nデータ解析ダッシュボードでグラフが正しく表示されません。\n\n## 再現手順\n\n1. ダッシュボードを開く\n2. データを選択\n3. グラフが表示されない',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-09 15:00:00+00'),

    ('issue', '信号解析アプリの解析結果が不正確', 
    E'## 現象\n\n信号解析アプリの解析結果が不正確です。\n\n## 再現手順\n\n1. アプリを起動\n2. 信号データを解析\n3. 結果が不正確',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ'),
    '2024-02-09 15:30:00+00'),

    ('issue', 'データ取得アプリのUIバグ', 
    E'## 現象\n\nデータ取得アプリのUIにバグがあります。\n\n## 再現手順\n\n1. アプリを起動\n2. 特定の操作を行う\n3. UIが崩れる',
    'open', 'low', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ'),
    '2024-02-09 16:00:00+00'),

    ('issue', '進捗確認アプリの通知機能が動作しない', 
    E'## 現象\n\n進捗確認アプリの通知機能が動作しません。\n\n## 再現手順\n\n1. アプリを起動\n2. 通知を設定\n3. 通知が届かない',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ'),
    '2024-02-09 16:30:00+00'),

    ('issue', 'テキスト解析サービスの結果が遅い', 
    E'## 現象\n\nテキスト解析サービスの解析結果が遅いです。\n\n## 再現手順\n\n1. アプリを起動\n2. テキストを解析\n3. 結果が表示されるまで時間がかかる',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス'),
    '2024-02-09 17:00:00+00'),

    ('issue', 'データ解析の処理速度が遅い', 
    E'## 現象\nデータ量が多い場合に処理速度が著しく低下します。\n\n## 再現手順\n1. 1万件以上のデータを読み込む\n2. 解析を実行\n3. 処理に10分以上かかる',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'tanaka@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-05-15 10:00:00+00'),

    ('issue', 'グラフの表示が崩れる', 
    E'## 現象\n特定の条件下でグラフの表示が崩れます。\n\n## 再現手順\n1. 時系列データを表示\n2. 期間を1年以上に設定\n3. グラフの軸が正しく表示されない',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'suzuki@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-07-20 14:30:00+00'),

    ('issue', 'データ解析ダッシュボードのメモリリーク', 
    E'## 現象\n\nデータ解析ダッシュボードを長時間使用するとメモリリークが発生します。\n\n## 再現手順\n\n1. ダッシュボードを開く\n2. 数時間使用する\n3. メモリ使用量が増加し続ける',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-09 12:00:00+00'),

    ('issue', '信号解析アプリのデータ保存エラー', 
    E'## 現象\n\n信号解析アプリでデータ保存時にエラーが発生します。\n\n## 再現手順\n\n1. アプリを起動\n2. データを解析\n3. 保存ボタンをクリック\n4. エラーが表示される',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ'),
    '2024-02-09 12:30:00+00'),

    ('issue', 'データ取得アプリのタイムアウト', 
    E'## 現象\n\nデータ取得アプリで大規模データを取得する際にタイムアウトが発生します。\n\n## 再現手順\n\n1. アプリを起動\n2. 大規模データを取得\n3. タイムアウトエラーが発生',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ'),
    '2024-02-09 13:00:00+00'),

    ('issue', '進捗確認アプリの進捗バーが更新されない', 
    E'## 現象\n\n進捗確認アプリで進捗バーが正しく更新されません。\n\n## 再現手順\n\n1. アプリを起動\n2. 進捗を更新\n3. 進捗バーが変化しない',
    'open', 'low', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ'),
    '2024-02-09 13:30:00+00'),

    ('issue', 'テキスト解析サービスの文字化け', 
    E'## 現象\n\nテキスト解析サービスで特定の文字が文字化けします。\n\n## 再現手順\n\n1. アプリを起動\n2. 特定の文字を含むテキストを解析\n3. 文字化けが発生',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス'),
    '2024-02-09 14:00:00+00'),

    ('issue', '画像分類アプリの精度低下', 
    E'## 現象\n\n画像分類アプリの分類精度が低下しています。\n\n## 再現手順\n\n1. アプリを起動\n2. 画像をアップロード\n3. 分類結果が不正確',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-02-09 14:30:00+00'),

    ('issue', 'データ解析ダッシュボードのグラフ表示エラー', 
    E'## 現象\n\nデータ解析ダッシュボードでグラフが正しく表示されません。\n\n## 再現手順\n\n1. ダッシュボードを開く\n2. データを選択\n3. グラフが表示されない',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-09 15:00:00+00'),

    ('issue', '信号解析アプリの解析結果が不正確', 
    E'## 現象\n\n信号解析アプリの解析結果が不正確です。\n\n## 再現手順\n\n1. アプリを起動\n2. 信号データを解析\n3. 結果が不正確',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ'),
    '2024-02-09 15:30:00+00'),

    ('issue', 'データ取得アプリのUIバグ', 
    E'## 現象\n\nデータ取得アプリのUIにバグがあります。\n\n## 再現手順\n\n1. アプリを起動\n2. 特定の操作を行う\n3. UIが崩れる',
    'open', 'low', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ'),
    '2024-02-09 16:00:00+00'),

    ('issue', '進捗確認アプリの通知機能が動作しない', 
    E'## 現象\n\n進捗確認アプリの通知機能が動作しません。\n\n## 再現手順\n\n1. アプリを起動\n2. 通知を設定\n3. 通知が届かない',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ'),
    '2024-02-09 16:30:00+00'),

    ('issue', 'テキスト解析サービスの結果が遅い', 
    E'## 現象\n\nテキスト解析サービスの解析結果が遅いです。\n\n## 再現手順\n\n1. アプリを起動\n2. テキストを解析\n3. 結果が表示されるまで時間がかかる',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス'),
    '2024-02-09 17:00:00+00'),

    ('issue', 'データ解析の処理速度が遅い', 
    E'## 現象\nデータ量が多い場合に処理速度が著しく低下します。\n\n## 再現手順\n1. 1万件以上のデータを読み込む\n2. 解析を実行\n3. 処理に10分以上かかる',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'tanaka@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-05-15 10:00:00+00'),

    ('issue', 'グラフの表示が崩れる', 
    E'## 現象\n特定の条件下でグラフの表示が崩れます。\n\n## 再現手順\n1. 時系列データを表示\n2. 期間を1年以上に設定\n3. グラフの軸が正しく表示されない',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'suzuki@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-07-20 14:30:00+00');

  -- Insert additional sample knowledge
  INSERT INTO contents (type, title, body, category, tags, author_id, application_id, created_at)
  SELECT 
    'knowledge',
    '画像分類アプリ使ってみた',
    E'# 画像分類アプリのレビュー\n\n## 使用した感想\n\n画像分類アプリを実際に使用してみました。\n\n### 良かった点\n- 分類の精度が高い\n- 操作が直感的\n\n### 改善点\n- 処理速度がもう少し速いと良い\n- 一度に複数画像を処理できると便利',
    'review',
    ARRAY['AI', 'image-processing', 'review'],
    (SELECT id FROM users WHERE email = 'tanaka@example.com'),
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-02-09 14:00:00+00';

  -- Insert additional sample knowledge
  INSERT INTO contents (type, title, body, category, tags, author_id, application_id, created_at) VALUES
    ('knowledge', 'データ解析ダッシュボードの活用事例', 
    E'# データ解析ダッシュボードの活用事例\n\n## 概要\nデータ解析ダッシュボードを使用して、リアルタイムにデータを解析し、ビジネスの意思決定をサポートする事例を紹介します。\n\n## 活用事例\n### 事例1: 販売データのリアルタイム分析\n- 販売データをリアルタイムに解析し、売上のトレンドを把握\n- 在庫管理の最適化に貢献\n\n### 事例2: 顧客行動の分析\n- 顧客の購買行動を解析し、マーケティング戦略を改善\n- 顧客満足度の向上に寄与\n\n## 結論\nデータ解析ダッシュボードは、ビジネスの意思決定を迅速かつ正確に行うための強力なツールです。',
    'use-case', ARRAY['data-analysis', 'dashboard', 'business'], 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-09 15:30:00+00'),

    ('knowledge', '画像分類アプリの活用事例', 
    E'# 画像分類アプリの活用事例\n\n## 概要\n画像分類アプリを使用して、画像データを効率的に分類し、業務の効率化を図る事例を紹介します。\n\n## 活用事例\n### 事例1: 商品画像の自動分類\n- 商品画像を自動で分類し、カタログ作成の手間を削減\n- 商品検索の精度向上に貢献\n\n### 事例2: 医療画像の解析\n- 医療画像を分類し、診断の補助に利用\n- 診断精度の向上に寄与\n\n## 結論\n画像分類アプリは、様々な分野で画像データの効率的な管理と解析に役立つツールです。',
    'use-case', ARRAY['AI', 'image-processing', 'business'], 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-02-09 16:00:00+00'),

    ('knowledge', '信号解析アプリの活用事例', 
    E'# 信号解析アプリの活用事例\n\n## 概要\n信号解析アプリを使用して、信号データを解析し、異常検知や予知保全に役立てる事例を紹介します。\n\n## 活用事例\n### 事例1: 機械の異常検知\n- 機械の動作信号を解析し、異常を早期に検知\n- メンテナンスコストの削減に貢献\n\n### 事例2: 予知保全\n- 信号データを解析し、故障の予兆を検知\n- 計画的な保全活動に寄与\n\n## 結論\n信号解析アプリは、機械の異常検知や予知保全において重要な役割を果たすツールです。',
    'use-case', ARRAY['signal-processing', 'maintenance', 'business'], 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ'),
    '2024-02-09 16:30:00+00'),

    ('knowledge', 'データ取得アプリの活用事例', 
    E'# データ取得アプリの活用事例\n\n## 概要\nデータ取得アプリを使用して、様々なデータソースからデータを効率的に取得し、業務の効率化を図る事例を紹介します。\n\n## 活用事例\n### 事例1: Webスクレイピング\n- Webサイトから必要なデータを自動で取得\n- データ収集の手間を削減\n\n### 事例2: API連携\n- 各種APIからデータを取得し、システム間の連携を強化\n- データの一元管理に貢献\n\n## 結論\nデータ取得アプリは、データ収集の効率化とシステム間の連携強化に役立つツールです。',
    'use-case', ARRAY['data-collection', 'API', 'business'], 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ'),
    '2024-02-09 17:00:00+00'),

    ('knowledge', '進捗確認アプリの活用事例', 
    E'# 進捗確認アプリの活用事例\n\n## 概要\n進捗確認アプリを使用して、プロジェクトの進捗を効率的に管理し、チームの生産性を向上させる事例を紹介します。\n\n## 活用事例\n### 事例1: プロジェクト管理\n- プロジェクトの進捗をリアルタイムで確認\n- タスクの遅延を早期に発見し、対策を講じる\n\n### 事例2: チームの生産性向上\n- 各メンバーの進捗を可視化し、リソースの最適配分を実現\n- チーム全体の生産性向上に寄与\n\n## 結論\n進捗確認アプリは、プロジェクト管理とチームの生産性向上において重要な役割を果たすツールです。',
    'use-case', ARRAY['project-management', 'productivity', 'business'], 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ'),
    '2024-02-09 17:30:00+00'),

    ('knowledge', 'テキスト解析サービスの活用事例', 
    E'# テキスト解析サービスの活用事例\n\n## 概要\nテキスト解析サービスを使用して、テキストデータを解析し、ビジネスインサイトを得る事例を紹介します。\n\n## 活用事例\n### 事例1: 顧客の声の分析\n- 顧客のフィードバックを解析し、製品改善に活用\n- 顧客満足度の向上に貢献\n\n### 事例2: ソーシャルメディアの分析\n- ソーシャルメディアの投稿を解析し、トレンドを把握\n- マーケティング戦略の策定に寄与\n\n## 結論\nテキスト解析サービスは、テキストデータからビジネスインサイトを得るための強力なツールです。',
    'use-case', ARRAY['text-analysis', 'customer-feedback', 'business'], 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス'),
    '2024-02-09 18:00:00+00'),

    ('knowledge', '画像分類アプリの活用事例2', 
    E'# 画像分類アプリの活用事例2\n\n## 概要\n画像分類アプリを使用して、画像データを効率的に分類し、業務の効率化を図る事例を紹介します。\n\n## 活用事例\n### 事例1: セキュリティ監視\n- 監視カメラの映像を解析し、不審者を自動検知\n- セキュリティ強化に貢献\n\n### 事例2: 製造ラインの品質管理\n- 製造ラインの画像を解析し、不良品を自動検出\n- 品質管理の効率化に寄与\n\n## 結論\n画像分類アプリは、セキュリティ監視や品質管理において重要な役割を果たすツールです。',
    'use-case', ARRAY['AI', 'image-processing', 'security'], 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-02-09 18:30:00+00'),

    ('knowledge', 'データ解析ダッシュボードの活用事例2', 
    E'# データ解析ダッシュボードの活用事例2\n\n## 概要\nデータ解析ダッシュボードを使用して、リアルタイムにデータを解析し、ビジネスの意思決定をサポートする事例を紹介します。\n\n## 活用事例\n### 事例1: 生産管理\n- 生産データをリアルタイムに解析し、生産効率を向上\n- 生産計画の最適化に貢献\n\n### 事例2: 財務分析\n- 財務データを解析し、経営戦略の策定に活用\n- 財務健全性の向上に寄与\n\n## 結論\nデータ解析ダッシュボードは、様々な分野でデータ解析を通じてビジネスの意思決定をサポートする強力なツールです。',
    'use-case', ARRAY['data-analysis', 'dashboard', 'business'], 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-09 19:00:00+00'),

    ('knowledge', 'データ解析テクニック集', 
    E'# 効率的なデータ解析の方法\n\n## はじめに\nデータ解析を効率的に行うためのテクニックをまとめました。\n\n## テクニック1\n- フィルタの活用方法\n- グループ化の効果的な使い方\n\n## テクニック2\n- データの前処理のコツ\n- 異常値の扱い方',
    'technique', ARRAY['data-analysis', 'tips'], 
    (SELECT id FROM users WHERE email = 'tanaka@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-08-15 09:00:00+00'),

    ('knowledge', '画像分類のベストプラクティス', 
    E'# 画像分類の精度を上げるコツ\n\n## 概要\n画像分類の精度を向上させるためのベストプラクティスをまとめました。\n\n## 1. データの準備\n- 適切な画像サイズの選択\n- データの前処理の重要性\n\n## 2. パラメータ設定\n- 最適なパラメータの選び方\n- チューニングのポイント',
    'best-practice', ARRAY['AI', 'image-processing'], 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-09-20 11:00:00+00');

  -- Insert sample requests
  INSERT INTO contents (type, title, body, status, priority, author_id, application_id, created_at)
  VALUES
    ('request', 'モバイルアプリ版の開発',
    E'# モバイルアプリ開発の提案\n\n## 背景\n\n多くのユーザーがスマートフォンでの利用を希望しており、モバイルアプリの開発が必要と考えられます。',
    'open', 'high',
    (SELECT id FROM users WHERE email = 'suzuki@example.com'),
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-10 09:00:00+00');

  -- Insert additional sample requests
  INSERT INTO contents (type, title, body, status, priority, author_id, application_id, created_at) VALUES
    ('request', 'データ解析ダッシュボードのリアルタイム更新機能追加', 
    E'# リアルタイム更新機能の追加要望\n\n## 概要\nデータ解析ダッシュボードにリアルタイム更新機能を追加してほしいです。\n\n## 期待する機能\n- データのリアルタイム更新\n- 更新通知の表示\n\n## 期待される効果\n- 最新データの即時反映\n- ユーザーの利便性向上',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-10 10:30:00+00'),

    ('request', '画像分類アプリのバッチ処理機能追加', 
    E'# バッチ処理機能の追加要望\n\n## 概要\n画像分類アプリにバッチ処理機能を追加してほしいです。\n\n## 期待する機能\n- 複数画像の一括分類\n- 処理結果の一括表示\n\n## 期待される効果\n- 作業効率の向上\n- 大量データの迅速な処理',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-02-10 11:00:00+00'),

    ('request', '信号解析アプリのフィルタ機能強化', 
    E'# フィルタ機能強化の要望\n\n## 概要\n信号解析アプリのフィルタ機能を強化してほしいです。\n\n## 期待する機能\n- 高度なフィルタ設定\n- フィルタ結果の保存\n\n## 期待される効果\n- 解析精度の向上\n- ユーザーの利便性向上',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ'),
    '2024-02-10 11:30:00+00'),

    ('request', 'データ取得アプリのAPI連携機能追加', 
    E'# API連携機能の追加要望\n\n## 概要\nデータ取得アプリにAPI連携機能を追加してほしいです。\n\n## 期待する機能\n- 各種APIとの連携\n- データの自動取得\n\n## 期待される効果\n- データ収集の効率化\n- システム間の連携強化',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ'),
    '2024-02-10 12:00:00+00'),

    ('request', '進捗確認アプリのガントチャート機能追加', 
    E'# ガントチャート機能の追加要望\n\n## 概要\n進捗確認アプリにガントチャート機能を追加してほしいです。\n\n## 期待する機能\n- ガントチャートの表示\n- タスクの視覚的管理\n\n## 期待される効果\n- プロジェクト管理の効率化\n- タスクの進捗把握が容易に',
    'open', 'low', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ'),
    '2024-02-10 12:30:00+00'),

    ('request', 'テキスト解析サービスの多言語対応', 
    E'# 多言語対応の要望\n\n## 概要\nテキスト解析サービスに多言語対応機能を追加してほしいです。\n\n## 期待する機能\n- 複数言語の解析\n- 言語自動検出\n\n## 期待される効果\n- グローバル展開の支援\n- 多様なユーザーのニーズに対応',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス'),
    '2024-02-10 13:00:00+00'),

    ('request', '画像分類アプリの精度向上', 
    E'# 精度向上の要望\n\n## 概要\n画像分類アプリの分類精度を向上させてほしいです。\n\n## 期待する機能\n- 高精度な分類アルゴリズム\n- 学習データの拡充\n\n## 期待される効果\n- 分類結果の信頼性向上\n- ユーザー満足度の向上',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-02-10 13:30:00+00'),

    ('request', 'データ解析ダッシュボードのカスタムウィジェット機能追加', 
    E'# カスタムウィジェット機能の追加要望\n\n## 概要\nデータ解析ダッシュボードにカスタムウィジェット機能を追加してほしいです。\n\n## 期待する機能\n- ウィジェットのカスタマイズ\n- ユーザー独自のデータ表示\n\n## 期待される効果\n- ダッシュボードの柔軟性向上\n- ユーザーの利便性向上',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-10 14:00:00+00'),

    ('request', '信号解析アプリのリアルタイム解析機能追加', 
    E'# リアルタイム解析機能の追加要望\n\n## 概要\n信号解析アプリにリアルタイム解析機能を追加してほしいです。\n\n## 期待する機能\n- リアルタイムデータの解析\n- 結果の即時表示\n\n## 期待される効果\n- 異常検知の迅速化\n- ユーザーの利便性向上',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ'),
    '2024-02-10 14:30:00+00'),

    ('request', 'データ取得アプリのデータフォーマット変換機能追加', 
    E'# データフォーマット変換機能の追加要望\n\n## 概要\nデータ取得アプリにデータフォーマット変換機能を追加してほしいです。\n\n## 期待する機能\n- 取得データのフォーマット変換\n- 複数フォーマットのサポート\n\n## 期待される効果\n- データ利用の柔軟性向上\n- ユーザーの利便性向上',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ'),
    '2024-02-10 15:00:00+00'),

    ('request', '進捗確認アプリの通知機能強化', 
    E'# 通知機能強化の要望\n\n## 概要\n進捗確認アプリの通知機能を強化してほしいです。\n\n## 期待する機能\n- 通知のカスタマイズ\n- 通知履歴の保存\n\n## 期待される効果\n- ユーザーの利便性向上\n- タスク管理の効率化',
    'open', 'low', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ'),
    '2024-02-10 15:30:00+00'),

    ('request', 'テキスト解析サービスの感情分析機能追加', 
    E'# 感情分析機能の追加要望\n\n## 概要\nテキスト解析サービスに感情分析機能を追加してほしいです。\n\n## 期待する機能\n- テキストの感情分析\n- 結果の視覚化\n\n## 期待される効果\n- 顧客の感情把握\n- マーケティング戦略の改善',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'テキスト解析サービス'),
    '2024-02-10 16:00:00+00'),

    ('request', '画像分類アプリのUI改善', 
    E'# UI改善の要望\n\n## 概要\n画像分類アプリのUIを改善してほしいです。\n\n## 期待する機能\n- 直感的な操作\n- デザインの一新\n\n## 期待される効果\n- ユーザーエクスペリエンスの向上\n- 利用頻度の増加',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '画像分類アプリ'),
    '2024-02-10 16:30:00+00'),

    ('request', 'データ解析ダッシュボードのエクスポート機能強化', 
    E'# エクスポート機能強化の要望\n\n## 概要\nデータ解析ダッシュボードのエクスポート機能を強化してほしいです。\n\n## 期待する機能\n- 多様なフォーマットでのエクスポート\n- エクスポート設定の保存\n\n## 期待される効果\n- データ共有の効率化\n- ユーザーの利便性向上',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ解析ダッシュボード'),
    '2024-02-10 17:00:00+00'),

    ('request', '信号解析アプリのデータ可視化機能追加', 
    E'# データ可視化機能の追加要望\n\n## 概要\n信号解析アプリにデータ可視化機能を追加してほしいです。\n\n## 期待する機能\n- 解析結果のグラフ表示\n- カスタムチャートの作成\n\n## 期待される効果\n- データの理解が容易に\n- ユーザーの利便性向上',
    'open', 'high', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = '信号解析アプリ'),
    '2024-02-10 17:30:00+00'),

    ('request', 'データ取得アプリのスケジュール機能追加', 
    E'# スケジュール機能の追加要望\n\n## 概要\nデータ取得アプリにスケジュール機能を追加してほしいです。\n\n## 期待する機能\n- データ取得のスケジュール設定\n- 定期的なデータ取得\n\n## 期待される効果\n- データ収集の自動化\n- ユーザーの利便性向上',
    'open', 'medium', 
    (SELECT id FROM users WHERE email = 'sato@example.com'), 
    (SELECT id FROM applications WHERE name = 'データ取得アプリ'),
    '2024-02-10 18:00:00+00'),

    ('request', '進捗確認アプリのレポート機能追加', 
    E'# レポート機能の追加要望\n\n## 概要\n進捗確認アプリにレポート機能を追加してほしいです。\n\n## 期待する機能\n- 進捗レポートの自動生成\n- レポートのカスタマイズ\n\n## 期待される効果\n- プロジェクト管理の効率化\n- ユーザーの利便性向上',
    'open', 'low', 
    (SELECT id FROM users WHERE email = 'yamada@example.com'), 
    (SELECT id FROM applications WHERE name = '進捗確認アプリ'),
    '2024-02-10 18:30:00+00');

END $$;