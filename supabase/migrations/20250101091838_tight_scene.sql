-- Insert sample knowledge content
INSERT INTO contents (
  type,
  title,
  body,
  category,
  tags,
  author_id,
  application_id,
  created_at
) VALUES
  -- 開発ガイドライン
  (
    'knowledge',
    'フロントエンド開発ガイドライン',
    E'# フロントエンド開発ガイドライン\n\n## コーディング規約\n\n### 1. ファイル構成\n- コンポーネントは機能単位でディレクトリを分割\n- スタイルは同一ディレクトリ内に配置\n- テストファイルは`__tests__`ディレクトリに配置\n\n### 2. 命名規則\n- コンポーネント: PascalCase\n- 関数: camelCase\n- 定数: UPPER_SNAKE_CASE\n\n### 3. コンポーネント設計\n- 単一責任の原則を守る\n- Props の型定義を明確に\n- カスタムフックを活用した状態管理\n\n## ベストプラクティス\n\n1. パフォーマンス最適化\n   - メモ化の適切な使用\n   - 不要な再レンダリングの防止\n   - 遅延ローディングの活用\n\n2. アクセシビリティ\n   - セマンティックなHTML\n   - WAI-ARIAの適切な使用\n   - キーボード操作の対応\n\n3. セキュリティ\n   - XSS対策\n   - CSRF対策\n   - 適切なバリデーション',
    'guidelines',
    ARRAY['frontend', 'development', 'react'],
    (SELECT id FROM users WHERE email = 'yamada@example.com'),
    (SELECT id FROM applications WHERE name = '営業管理システム'),
    NOW() - INTERVAL '30 days'
  ),
  -- API設計ドキュメント
  (
    'knowledge',
    'REST API設計ガイド',
    E'# REST API設計ガイド\n\n## エンドポイント設計\n\n### 基本原則\n- リソース指向の設計\n- 適切なHTTPメソッドの使用\n- 一貫性のあるURL構造\n\n### URLの構造\n```\nGET    /api/v1/users          # ユーザー一覧取得\nPOST   /api/v1/users          # ユーザー作成\nGET    /api/v1/users/{id}     # 特定ユーザー取得\nPUT    /api/v1/users/{id}     # ユーザー更新\nDELETE /api/v1/users/{id}     # ユーザー削除\n```\n\n## レスポンス形式\n\n### 成功時\n```json\n{\n  "status": "success",\n  "data": {...}\n}\n```\n\n### エラー時\n```json\n{\n  "status": "error",\n  "message": "エラーメッセージ",\n  "code": "ERROR_CODE"\n}\n```\n\n## 認証・認可\n\n1. JWT認証の実装\n2. アクセストークンの管理\n3. リフレッシュトークンの運用',
    'api',
    ARRAY['api', 'rest', 'backend'],
    (SELECT id FROM users WHERE email = 'sato@example.com'),
    (SELECT id FROM applications WHERE name = 'マーケティングハブ'),
    NOW() - INTERVAL '25 days'
  ),
  -- データベース設計
  (
    'knowledge',
    'データベース設計ガイドライン',
    E'# データベース設計ガイドライン\n\n## テーブル設計の基本原則\n\n### 1. 正規化\n- 第1正規形\n- 第2正規形\n- 第3正規形\n\n### 2. 命名規則\n- テーブル名: 複数形、スネークケース\n- カラム名: スネークケース\n- インデックス名: idx_テーブル名_カラム名\n\n## インデックス設計\n\n1. 主キーインデックス\n2. 外部キーインデックス\n3. 検索条件のインデックス\n\n## パフォーマンスチューニング\n\n### クエリの最適化\n```sql\n-- 良い例\nSELECT * FROM users\nWHERE status = \'active\'\nAND created_at > NOW() - INTERVAL \'7 days\'\nLIMIT 100;\n\n-- 悪い例\nSELECT *\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.status = \'active\';\n```',
    'database',
    ARRAY['database', 'sql', 'performance'],
    (SELECT id FROM users WHERE email = 'yamada@example.com'),
    (SELECT id FROM applications WHERE name = '人事ポータル'),
    NOW() - INTERVAL '20 days'
  ),
  -- セキュリティガイドライン
  (
    'knowledge',
    'アプリケーションセキュリティガイドライン',
    E'# セキュリティガイドライン\n\n## 脆弱性対策\n\n### 1. インジェクション対策\n- SQLインジェクション\n- XSSインジェクション\n- コマンドインジェクション\n\n### 2. 認証・認可\n- パスワードハッシュ化\n- セッション管理\n- アクセス制御\n\n### 3. データ保護\n- 暗号化\n- 個人情報保護\n- ログ管理\n\n## セキュリティチェックリスト\n\n- [ ] 入力値のバリデーション\n- [ ] エラーメッセージの適切な制御\n- [ ] セキュアなHTTPS通信\n- [ ] クロスサイトリクエストフォージェリ対策\n- [ ] セキュリティヘッダーの設定',
    'security',
    ARRAY['security', 'authentication', 'encryption'],
    (SELECT id FROM users WHERE email = 'sato@example.com'),
    (SELECT id FROM applications WHERE name = '営業管理システム'),
    NOW() - INTERVAL '15 days'
  ),
  -- テスト戦略
  (
    'knowledge',
    'テスト戦略とベストプラクティス',
    E'# テスト戦略ガイド\n\n## テストピラミッド\n\n1. 単体テスト（Unit Tests）\n2. 統合テスト（Integration Tests）\n3. E2Eテスト（End-to-End Tests）\n\n## テストの種類と目的\n\n### 単体テスト\n```typescript\ndescribe(\'calculateTotal\', () => {\n  it(\'should calculate total with tax\', () => {\n    expect(calculateTotal(1000)).toBe(1100);\n  });\n});\n```\n\n### 統合テスト\n```typescript\ndescribe(\'UserService\', () => {\n  it(\'should create user and send welcome email\', async () => {\n    const user = await createUser(userData);\n    expect(emailService.sent).toBeCalled();\n  });\n});\n```\n\n## テストカバレッジ\n\n- ステートメントカバレッジ: 80%以上\n- ブランチカバレッジ: 70%以上\n- 関数カバレッジ: 90%以上',
    'testing',
    ARRAY['testing', 'quality', 'automation'],
    (SELECT id FROM users WHERE email = 'yamada@example.com'),
    (SELECT id FROM applications WHERE name = 'マーケティングハブ'),
    NOW() - INTERVAL '10 days'
  ),
  -- デプロイメントガイド
  (
    'knowledge',
    'デプロイメントプロセスガイド',
    E'# デプロイメントプロセスガイド\n\n## CI/CDパイプライン\n\n### 1. ビルドプロセス\n```yaml\nbuild:\n  steps:\n    - name: Install dependencies\n      run: npm install\n    - name: Run tests\n      run: npm test\n    - name: Build application\n      run: npm run build\n```\n\n### 2. デプロイメントステージ\n- 開発環境（Development）\n- ステージング環境（Staging）\n- 本番環境（Production）\n\n## ロールバック手順\n\n1. 問題の特定\n2. 前バージョンの確認\n3. ロールバックの実行\n4. 動作確認\n\n## モニタリング\n\n- アプリケーションログ\n- パフォーマンスメトリクス\n- エラー監視',
    'deployment',
    ARRAY['deployment', 'ci-cd', 'devops'],
    (SELECT id FROM users WHERE email = 'sato@example.com'),
    (SELECT id FROM applications WHERE name = '人事ポータル'),
    NOW() - INTERVAL '5 days'
  ),
  -- パフォーマンスチューニング
  (
    'knowledge',
    'パフォーマンス最適化ガイド',
    E'# パフォーマンス最適化ガイド\n\n## フロントエンド最適化\n\n### 1. バンドルサイズの最適化\n- コード分割\n- 遅延ローディング\n- ツリーシェイキング\n\n### 2. レンダリングパフォーマンス\n```typescript\n// 良い例\nconst MemoizedComponent = React.memo(({ data }) => {\n  return <div>{data.map(item => (\n    <Item key={item.id} {...item} />\n  ))}</div>\n});\n\n// 悪い例\nconst Component = ({ data }) => {\n  return <div>{data.map(item => (\n    <Item key={item.id} {...item} />\n  ))}</div>\n};\n```\n\n## バックエンド最適化\n\n1. キャッシュ戦略\n2. データベースインデックス\n3. N+1問題の解決\n\n## 計測と分析\n\n- Lighthouse スコア\n- Core Web Vitals\n- APM ツール',
    'performance',
    ARRAY['performance', 'optimization', 'monitoring'],
    (SELECT id FROM users WHERE email = 'yamada@example.com'),
    (SELECT id FROM applications WHERE name = '営業管理システム'),
    NOW() - INTERVAL '3 days'
  ),
  -- エラーハンドリング
  (
    'knowledge',
    'エラーハンドリングベストプラクティス',
    E'# エラーハンドリングガイド\n\n## グローバルエラーハンドリング\n\n```typescript\nclass AppError extends Error {\n  constructor(\n    public statusCode: number,\n    public message: string,\n    public code: string\n  ) {\n    super(message);\n  }\n}\n\nconst errorHandler = (err: Error, req: Request, res: Response) => {\n  if (err instanceof AppError) {\n    return res.status(err.statusCode).json({\n      status: \'error\',\n      message: err.message,\n      code: err.code\n    });\n  }\n\n  return res.status(500).json({\n    status: \'error\',\n    message: \'Internal Server Error\'\n  });\n};\n```\n\n## エラーの種類\n\n1. バリデーションエラー\n2. 認証エラー\n3. 権限エラー\n4. ビジネスロジックエラー\n\n## ログ管理\n\n### ログレベル\n- ERROR: システムエラー\n- WARN: 警告\n- INFO: 情報\n- DEBUG: デバッグ情報',
    'error-handling',
    ARRAY['error-handling', 'logging', 'debugging'],
    (SELECT id FROM users WHERE email = 'sato@example.com'),
    (SELECT id FROM applications WHERE name = 'マーケティングハブ'),
    NOW() - INTERVAL '1 day'
  ),
  -- アクセシビリティガイド
  (
    'knowledge',
    'Webアクセシビリティガイドライン',
    E'# Webアクセシビリティガイドライン\n\n## WCAG 2.1準拠のポイント\n\n### 1. 知覚可能\n- 適切な代替テキスト\n- キーボード操作対応\n- 色のコントラスト比\n\n### 2. 操作可能\n```html\n<!-- 良い例 -->\n<button\n  aria-label="メニューを開く"\n  onClick={handleClick}\n>\n  <Icon name="menu" />\n</button>\n\n<!-- 悪い例 -->\n<div\n  onClick={handleClick}\n>\n  <Icon name="menu" />\n</div>\n```\n\n### 3. 理解可能\n- 明確なラベル付け\n- 一貫した操作性\n- エラー表示\n\n## テスト方法\n\n1. 自動化テスト\n   - axe-core\n   - WAVE\n   - Lighthouse\n\n2. マニュアルテスト\n   - スクリーンリーダー\n   - キーボード操作\n   - 拡大表示',
    'accessibility',
    ARRAY['accessibility', 'wcag', 'usability'],
    (SELECT id FROM users WHERE email = 'yamada@example.com'),
    (SELECT id FROM applications WHERE name = '人事ポータル'),
    NOW()
  ),
  -- コードレビューガイド
  (
    'knowledge',
    'コードレビューガイドライン',
    E'# コードレビューガイドライン\n\n## レビューの基本原則\n\n### 1. レビューの観点\n- 可読性\n- メンテナンス性\n- パフォーマンス\n- セキュリティ\n\n### 2. コメントの書き方\n```markdown\n// 良いコメント\n- 具体的な改善提案を含める\n- 参考資料へのリンクを提供\n- 建設的な表現を使用\n\n// 悪いコメント\n- 一方的な否定\n- 個人的な好み\n- あいまいな指摘\n```\n\n## チェックリスト\n\n1. コーディング規約の遵守\n2. テストの網羅性\n3. ドキュメントの更新\n4. パフォーマンスへの影響\n\n## レビュープロセス\n\n1. プルリクエストの作成\n2. 自動テストの実行\n3. コードレビュー\n4. フィードバックの反映\n5. 承認とマージ',
    'code-review',
    ARRAY['code-review', 'quality', 'collaboration'],
    (SELECT id FROM users WHERE email = 'sato@example.com'),
    (SELECT id FROM applications WHERE name = '営業管理システム'),
    NOW()
  );