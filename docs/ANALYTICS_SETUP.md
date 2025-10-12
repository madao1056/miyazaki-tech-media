# Google Analytics API連携設定ガイド

## 概要

このプロジェクトでは、Google Analytics 4 (GA4) のAPIを使用して記事のページビュー数を自動取得し、人気順ソート機能を実現しています。

## 設定手順

### 1. Google Cloud Console での設定

1. **Google Cloud Console**にアクセス
   - https://console.cloud.google.com/

2. **プロジェクトを作成または選択**
   - 新規プロジェクト作成: `miyabito-analytics`

3. **Google Analytics Reporting API を有効化**
   - APIs & Services → Library
   - "Google Analytics Reporting API" を検索して有効化

4. **サービスアカウントを作成**
   - APIs & Services → Credentials
   - "Create Credentials" → "Service Account"
   - 名前: `miyabito-ga-reader`
   - 権限: Analytics Viewer

5. **キーファイルをダウンロード**
   - サービスアカウント → Keys → Add Key → JSON
   - ダウンロードしたファイルを `ga4-key.json` として保存

### 2. Google Analytics での設定

1. **GA4プロパティ設定**
   - Google Analytics → Admin → Property → Property Details
   - Property ID をコピー（例: 123456789）

2. **サービスアカウントに権限付与**
   - Property → Property Access Management
   - Add Users → サービスアカウントのメールアドレスを追加
   - 権限: Viewer

### 3. 環境変数の設定

#### ローカル開発環境

`.env` ファイルを作成:

```bash
# Google Analytics 4 設定
GA4_PROPERTY_ID=123456789
GA4_KEY_FILE=./ga4-key.json
```

#### GitHub Actions (本番環境)

Repository Settings → Secrets and variables → Actions で設定:

- `GA4_PROPERTY_ID`: GA4プロパティID
- `GA4_KEY_JSON`: キーファイルの内容（JSON全体）

### 4. 実行とテスト

#### 手動実行

```bash
# ビュー数データを更新
npm run update-views
```

#### 自動実行

- 毎日午前2時（UTC）= JST午前11時に自動実行
- GitHub Actions で手動実行も可能

## ファイル構成

```
project/
├── scripts/
│   └── update-views.js          # GA4データ取得スクリプト
├── src/
│   ├── data/
│   │   └── article-views.json   # ビュー数データ
│   └── lib/
│       └── utils/
│           └── views.ts         # ビュー数ユーティリティ
├── .github/
│   └── workflows/
│       └── update-views.yml     # 自動実行設定
├── .env.example                 # 環境変数テンプレート
└── ga4-key.json                 # サービスアカウントキー（gitignore）
```

## データフォーマット

`src/data/article-views.json`:

```json
{
  "lastUpdated": "2025-01-13T13:00:00.000Z",
  "views": {
    "article-slug": 1234,
    "another-article": 5678
  },
  "totalViews": {}
}
```

## トラブルシューティング

### 権限エラー

- サービスアカウントがGA4プロパティにアクセス権限を持っているか確認
- Property IDが正しいか確認

### データが取得できない

- GA4にデータが蓄積されているか確認（設定から数日経過が必要）
- 日付範囲の設定を確認

### GitHub Actions エラー

- Secrets設定が正しいか確認
- キーファイルの形式が正しいか確認

## セキュリティ注意事項

- `ga4-key.json` は **絶対に** Gitにコミットしない
- `.gitignore` に追加済み
- GitHub Secrets は暗号化されて保存される

## 更新頻度について

- 現在: 毎日1回自動更新
- 必要に応じて手動実行可能
- 更新頻度は `.github/workflows/update-views.yml` で変更可能