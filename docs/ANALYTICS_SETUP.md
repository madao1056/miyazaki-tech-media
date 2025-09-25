# Google Analytics API セットアップガイド

## 🎯 概要

このガイドでは、Google Analytics 4 (GA4) APIを使用してリアルタイムの記事人気度データを取得し、トップページの記事表示を自動化する方法を説明します。

## 🚀 セットアップ手順

### 1. Google Cloud Console でプロジェクト作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成またはお選択
3. **Google Analytics Data API** を有効化

### 2. サービスアカウント作成

1. Cloud Console で「**IAM と管理** > **サービスアカウント**」に移動
2. 「**サービスアカウントを作成**」をクリック
3. サービスアカウント名を入力（例：`bizmap-analytics-service`）
4. 「**作成して続行**」をクリック
5. ロール選択（**Analytics Viewer** または **Analytics Editor**）
6. 「**完了**」をクリック

### 3. サービスアカウントキーを取得

1. 作成したサービスアカウントをクリック
2. 「**キー**」タブに移動
3. 「**キーを追加** > **新しいキーを作成**」
4. **JSON** 形式を選択してダウンロード

### 4. Google Analytics でサービスアカウントを追加

1. [Google Analytics](https://analytics.google.com/) にアクセス
2. 対象プロパティの「**管理**」に移動
3. 「**プロパティアクセス管理**」をクリック
4. 「**+**」ボタンでユーザーを追加
5. サービスアカウントのメールアドレスを入力
6. 権限：**閲覧者** を選択

### 5. GA4 プロパティIDを取得

1. Google Analytics で対象プロパティを選択
2. 「**管理** > **プロパティ設定**」
3. **プロパティID** をコピー（例：`123456789`）

### 6. 環境変数を設定

`.env` ファイルを作成し、以下を設定：

```bash
# GA4 プロパティID
GA4_PROPERTY_ID=123456789

# サービスアカウント認証情報（JSON形式をエスケープ）
GA4_CREDENTIALS={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"service-account@project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/service-account%40project.iam.gserviceaccount.com"}
```

**重要**: JSONの改行文字は `\n` でエスケープしてください。

## 📊 取得できるデータ

### リアルタイムデータ（過去30分）
- アクティブユーザー数
- 現在閲覧中のページ
- 急上昇記事の検出

### 履歴データ（過去30日）
- ページビュー数
- ユニークビュー数
- 平均滞在時間
- 離脱率
- エンゲージメント率

## 🎨 人気度スコア算出式

```
人気度スコア = 基本PV + 品質ボーナス - 離脱ペナルティ

基本PV: ページビュー数
品質ボーナス: (滞在時間 × 0.1) + (エンゲージメント率 × 10)
離脱ペナルティ: 離脱率 × PV数 × 0.1
```

## 🔄 自動更新の仕組み

### トレンド記事検出
- リアルタイムアクティブユーザー > 5人 の記事
- トレンド記事には自動でボーナススコア付与

### 表示優先順位
1. **トレンド記事**（急上昇中）
2. **人気度スコア順**（総合評価）
3. **新着記事**（フォールバック）

## 🛠️ トラブルシューティング

### Analytics API が動作しない場合

自動的にフォールバックモードに切り替わります：
- 新着記事ベースでの表示
- エラーログをコンソールに出力
- 手動設定（`isMainHeadline`/`isSubHeadline`）は引き続き優先

### デバッグ方法

開発環境で動作確認：
```bash
# Analytics API無効化（フォールバック確認）
GA4_PROPERTY_ID=
GA4_CREDENTIALS=

npm run dev
```

### よくあるエラー

1. **認証エラー**: サービスアカウントがGAに追加されているか確認
2. **権限エラー**: サービスアカウントに適切な権限があるか確認
3. **プロパティID無効**: GA4のプロパティIDが正しいか確認

## 📈 パフォーマンス最適化

### キャッシュ戦略
- Analytics APIレスポンスを1時間キャッシュ
- ビルド時にデータ取得（静的サイト生成）
- リアルタイムデータは軽量なものに限定

### 運用コスト削減
- 必要な指標のみ取得
- バッチ処理での効率化
- 無料枠内での運用

## 🔧 カスタマイズ

### スコア算出ロジックの調整
`src/lib/analytics/ga4.ts` の `calculatePopularityScore` メソッドを編集

### 取得期間の変更
`getArticlePageViews()` の `days` パラメータを調整

### 表示記事数の変更
`articlesHandler.getTopArticles()` の `.slice(0, 5)` を変更