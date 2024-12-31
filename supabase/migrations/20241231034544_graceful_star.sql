/*
  # サンプルデータの追加（日本語）

  1. サンプルデータ
    - ユーザー（開発者と一般ユーザー）
    - アプリケーション
    - コンテンツ（課題とナレッジ）
*/

-- サンプルユーザーの追加
INSERT INTO users (id, name, email, department, role) VALUES
  ('d7b5492f-0d13-4851-9bcd-9c96c9c21b2c', '山田太郎', 'yamada@example.com', '開発部', 'developer'),
  ('c9f3f4d7-8c7b-4d8a-9e5f-7f2c1d3b4a5e', '佐藤花子', 'sato@example.com', '開発部', 'developer'),
  ('e8d9c6b5-4a3f-2e1d-9c8b-7f6e5d4c3b2a', '鈴木一郎', 'suzuki@example.com', '営業部', 'user'),
  ('f7e6d5c4-3b2a-1c9d-8e7f-6a5b4c3d2e1f', '田中美咲', 'tanaka@example.com', 'マーケティング部', 'user');

-- サンプルアプリケーションの追加
INSERT INTO applications (id, name, description, status, developer_id, user_count) VALUES
  ('a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d', '営業管理システム', 'リアルタイム営業データ分析プラットフォーム', 'released', 'd7b5492f-0d13-4851-9bcd-9c96c9c21b2c', 150),
  ('b2c3d4e5-f6a7-5b4c-9d8e-0f1a2b3c4d5e', 'マーケティングハブ', 'キャンペーン管理システム', 'development', 'c9f3f4d7-8c7b-4d8a-9e5f-7f2c1d3b4a5e', 75),
  ('c3d4e5f6-a7b8-6c5d-0e9f-1a2b3c4d5e6f', '人事ポータル', '従業員管理システム', 'released', 'd7b5492f-0d13-4851-9bcd-9c96c9c21b2c', 200);

-- サンプルコンテンツ（課題）の追加
INSERT INTO contents (type, title, body, status, priority, author_id, application_id) VALUES
  ('issue', 'ダッシュボードの読み込み速度改善', '大規模データセット使用時にダッシュボードの読み込みが遅い', 'open', 'high', 'e8d9c6b5-4a3f-2e1d-9c8b-7f6e5d4c3b2a', 'a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d'),
  ('issue', 'キャンペーン作成エラー', '特殊文字を含むキャンペーン作成時にエラーが発生', 'in_progress', 'medium', 'f7e6d5c4-3b2a-1c9d-8e7f-6a5b4c3d2e1f', 'b2c3d4e5-f6a7-5b4c-9d8e-0f1a2b3c4d5e'),
  ('issue', '従業員データインポート失敗', '従業員データの一括インポートが失敗する', 'resolved', 'high', 'e8d9c6b5-4a3f-2e1d-9c8b-7f6e5d4c3b2a', 'c3d4e5f6-a7b8-6c5d-0e9f-1a2b3c4d5e6f');

-- サンプルコンテンツ（ナレッジ）の追加
INSERT INTO contents (type, title, body, category, author_id, application_id) VALUES
  ('knowledge', '営業管理システム利用ガイド', '営業管理システムの効果的な使用方法について', 'guide', 'd7b5492f-0d13-4851-9bcd-9c96c9c21b2c', 'a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d'),
  ('knowledge', 'マーケティングキャンペーンのベストプラクティス', '成功するマーケティングキャンペーンのヒントとコツ', 'best-practices', 'c9f3f4d7-8c7b-4d8a-9e5f-7f2c1d3b4a5e', 'b2c3d4e5-f6a7-5b4c-9d8e-0f1a2b3c4d5e'),
  ('knowledge', '人事ポータルFAQ', '人事ポータルに関するよくある質問と回答', 'faq', 'd7b5492f-0d13-4851-9bcd-9c96c9c21b2c', 'c3d4e5f6-a7b8-6c5d-0e9f-1a2b3c4d5e6f');