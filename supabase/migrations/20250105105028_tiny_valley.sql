-- Insert sample requests
INSERT INTO contents (
  type,
  title,
  body,
  status,
  priority,
  author_id,
  application_id,
  created_at
) VALUES
  -- モバイルアプリ対応の要望
  (
    'request',
    'モバイルアプリ版の開発',
    E'# モバイルアプリ開発の提案\n\n## 背景\n\n多くのユーザーがスマートフォンでの利用を希望しており、モバイルアプリの開発が必要と考えられます。\n\n## 期待される効果\n\n1. ユーザビリティの向上\n   - オフライン対応\n   - プッシュ通知\n   - ネイティブ機能の活用\n\n2. 業務効率の改善\n   - 外出先での利用\n   - リアルタイム更新\n   - カメラ機能の活用\n\n## 要望詳細\n\n- iOS/Android両対応\n- 主要機能のモバイル最適化\n- セキュアな認証',
    'open',
    'high',
    (SELECT id FROM users WHERE email = 'suzuki@example.com'),
    (SELECT id FROM applications WHERE name = '営業管理システム'),
    NOW() - INTERVAL '7 days'
  ),
  -- UI/UX改善の提案
  (
    'request',
    'ダッシュボードのカスタマイズ機能',
    E'# ダッシュボードカスタマイズ機能の提案\n\n## 現状の課題\n\n現在のダッシュボードは固定レイアウトのため、各ユーザーの必要な情報にアクセスしづらい状況です。\n\n## 改善案\n\n1. ウィジェットの追加/削除\n2. レイアウトの自由な配置\n3. データ表示期間の選択\n\n## 技術要件\n\n- ドラッグ&ドロップ対応\n- レスポンシブデザイン\n- 設定の永続化',
    'in_progress',
    'medium',
    (SELECT id FROM users WHERE email = 'tanaka@example.com'),
    (SELECT id FROM applications WHERE name = 'マーケティングハブ'),
    NOW() - INTERVAL '5 days'
  ),
  -- 新機能の提案
  (
    'request',
    'AIを活用した分析機能の追加',
    E'# AI分析機能の提案\n\n## 目的\n\nAIを活用してデータ分析を自動化し、より深い洞察を得られるようにする。\n\n## 期待される機能\n\n1. 予測分析\n   - 売上予測\n   - トレンド分析\n   - 異常検知\n\n2. レポート自動生成\n   - 週次/月次レポート\n   - カスタムレポート\n\n3. アクションの提案\n   - 最適化提案\n   - リスク警告',
    'open',
    'medium',
    (SELECT id FROM users WHERE email = 'yamada@example.com'),
    (SELECT id FROM applications WHERE name = '営業管理システム'),
    NOW() - INTERVAL '3 days'
  ),
  -- インテグレーション要望
  (
    'request',
    '外部サービス連携の拡充',
    E'# 外部サービス連携機能の要望\n\n## 連携希望サービス\n\n1. Slack\n   - 通知連携\n   - コマンド実行\n\n2. Google Workspace\n   - カレンダー連携\n   - ドライブ連携\n\n3. Microsoft 365\n   - Teams連携\n   - SharePoint連携\n\n## 期待される効果\n\n- 業務効率の向上\n- 情報共有の円滑化\n- 重複作業の削減',
    'open',
    'low',
    (SELECT id FROM users WHERE email = 'sato@example.com'),
    (SELECT id FROM applications WHERE name = '人事ポータル'),
    NOW() - INTERVAL '2 days'
  ),
  -- パフォーマンス改善要望
  (
    'request',
    'レスポンス速度の改善',
    E'# パフォーマンス改善要望\n\n## 現状の問題点\n\n1. 一覧表示が遅い\n2. 検索結果の表示に時間がかかる\n3. レポート生成が重い\n\n## 改善要望\n\n- ページ読み込みを3秒以内に\n- 検索結果の即時表示\n- レポート生成の非同期処理化\n\n## 優先度の高い画面\n\n1. ダッシュボード\n2. 検索画面\n3. レポート画面',
    'in_progress',
    'high',
    (SELECT id FROM users WHERE email = 'tanaka@example.com'),
    (SELECT id FROM applications WHERE name = 'マーケティングハブ'),
    NOW() - INTERVAL '1 day'
  );