# 社内アプリ共創プラットフォーム Cocrea 要件定義

## 概要

社内で開発・運用されているアプリを一覧化し、重複開発の防止やユーザーとの共創を促進するためのプラットフォームです。下記の主要機能を提供します。

- Dashboard: 各アプリの開発状況や次リリース予定を一覧表示  
- Issues: 「お困りごと」や「改善要望」をユーザーと開発者が共有・管理する場  
- Knowledge: アプリの利用事例・ノウハウを蓄積し、ユーザー同士が学び合える場  
- Users: ユーザー情報を管理し、アプリ開発者とユーザーをつなぐ

---

### 目的

1. 社内アプリ情報の**可視化**と**透明性の向上**  
2. **重複開発や類似アプリの乱立**を防ぐ  
3. ユーザー・開発者間の**共創**(フィードバックのやり取りと迅速な改善)  
4. 社内ノウハウの蓄積と再利用による**開発効率向上**  

---

### 利用シーン

1. **新規アプリ開発**を企画する際、類似アプリの有無を検索し、重複を防ぐ  
2. ユーザーが**改善要望**や**お困りごと**(バグ報告など)を投稿・共有し、開発者が優先度を判断  
3. **部署横断的な事例共有**: 他部門のアプリの使い方・導入効果を知り、ノウハウを取り入れる  
4. **経営層や部門責任者**が全社的な開発状況を把握し、予算・リソースを最適配分する  
 
---

### 機能概要

1. **Dashboard**  
    - アプリ一覧表示  
    - アプリの開発状況(開発中、リリース済み、停止中など)  
    - 次回リリース予定  
    - 開発者情報(担当者、連絡先)  
    - ユーザー数、利用状況  
    - 関連するIssues、Knowledgeの一覧表示

2. **Issues**

    - ユーザーが投稿した「お困りごと」や「改善要望」を一覧表示  
    - 投稿者情報(名前、部署、連絡先)  
    - 投稿日時、優先度、ステータス(未対応、対応中、対応済み)  
    - 関連するアプリ、Knowledgeのリンク  
    - 開発者がコメントを返信し、対応状況を更新

3. **Knowledge**

    - アプリの利用事例やノウハウを一覧表示  
    - 投稿者情報(名前、部署、連絡先)  
    - 投稿日時、カテゴリ、タグ  
    - 関連するアプリ、Issuesのリンク  
    - 他ユーザーがコメントを返信し、評価(いいね)を付ける

4. **Users**

    - ユーザー情報を一覧表示  
    - ユーザー名、部署、連絡先  
    - 関連するアプリ、Issues、Knowledgeのリンク  
    - ユーザーが投稿したIssues、Knowledgeの一覧表示


### 設計・実装方針

* フレームワークや言語は下記を利用するものとする

- Next.js 14
- app router
- shadcn/ui
- typescript

* 全体の構造や処理をシンプルにし保守性を高めるためにIssuesとKnowledgeはデータベースを共通化する

    contentsというテーブルを実装し、IssuesとKnowledgeのデータを格納する
    



---
