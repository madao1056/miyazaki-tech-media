# 不定期予約デプロイ設定ガイド

## セットアップ手順

### 1. Vercel Token の取得

1. [Vercel Dashboard](https://vercel.com/account/tokens) にアクセス
2. 「Create」をクリック
3. Token名を入力（例: `github-actions-deploy`）
4. Scopeは「Full Account」を選択
5. 生成されたトークンをコピー

### 2. Vercel Project ID と Org ID の取得

```bash
# プロジェクトディレクトリで実行
npx vercel link

# プロジェクト情報を確認
cat .vercel/project.json
```

以下の情報をメモ：
- `projectId`: VERCEL_PROJECT_ID
- `orgId`: VERCEL_ORG_ID

### 3. GitHub Secrets の設定

GitHubリポジトリの Settings → Secrets and variables → Actions で以下を追加：

- `VERCEL_TOKEN`: Vercelで取得したトークン
- `VERCEL_ORG_ID`: 組織ID
- `VERCEL_PROJECT_ID`: プロジェクトID
- `PUBLIC_GA_MEASUREMENT_ID`: Google Analytics ID（必要な場合）

### 4. 使用方法

#### 即時デプロイ
1. GitHubの Actions タブを開く
2. 「Manual Deploy with Schedule Option」を選択
3. 「Run workflow」をクリック
4. deploy_time に「now」と入力（デフォルト）
5. 「Run workflow」ボタンをクリック

#### 時刻指定デプロイ（例：20:59にデプロイ）
1. GitHubの Actions タブを開く
2. 「Manual Deploy with Schedule Option」を選択
3. 「Run workflow」をクリック
4. deploy_time に「20:59」と入力（24時間形式、JST）
5. 必要に応じてdeploy_messageを入力
6. 「Run workflow」ボタンをクリック
7. ワークフローが開始され、指定時刻まで待機してからデプロイ

**注意**: 
- 時刻は日本時間（JST）で指定
- 現在時刻より過去を指定した場合は翌日の同時刻にデプロイ
- GitHub Actionsの最大実行時間は6時間なので、5時間以内の時刻を推奨

### 5. 動作確認

```bash
# GitHubにプッシュ
git add .github/workflows/
git commit -m "Add scheduled deployment workflows"
git push origin main
```

GitHubの Actions タブで確認：
- ワークフローが表示されること
- 手動実行ボタンが使えること

## トラブルシューティング

### デプロイが失敗する場合

1. **Secrets の確認**
   - GitHubのSecretsが正しく設定されているか確認
   - トークンの有効期限を確認

2. **権限の確認**
   - GitHub Actions の権限設定を確認
   - Settings → Actions → General → Workflow permissions
   - 「Read and write permissions」を選択

3. **時刻設定の確認**
   - cronの時刻はUTC基準
   - JST = UTC + 9時間
   - 20:59 JST = 11:59 UTC

### 一時的な無効化

ワークフローを無効化する場合：
1. GitHubの Actions タブへ
2. 対象のワークフローを選択
3. 「...」メニューから「Disable workflow」を選択

## 注意事項

- GitHub Actions の無料枠：2,000分/月（Publicリポジトリは無制限）
- Vercel の無料枠：100デプロイ/日
- 最大待機時間は約5時間（GitHub Actionsの制限）
- 時刻指定は日本時間（JST）で入力
- 不定期デプロイなので、都度手動で実行する必要あり