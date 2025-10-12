# アカウント移行バックアップ情報

**作成日時**: 2025年1月13日  
**目的**: メディア専用アカウントへの移行準備  

## 📊 現在のプロジェクト状態

### リポジトリ情報
- **GitHub URL**: https://github.com/madao1056/miyazaki-tech-media
- **最終コミット**: feat: みやビズブランド変更と記事並び替え機能の実装 (920e44b)
- **ブランチ**: main
- **リモートURL**: git@github.com:madao1056/miyazaki-tech-media.git

### プロジェクト詳細
- **サイト名**: みやびと
- **URL**: https://miyabito.bond-llc.jp
- **フレームワーク**: Astro
- **デプロイ**: Vercel

## 🔧 重要な設定値（移行時に必要）

### 環境変数（.env）
```bash
# Google Analytics 4 設定
GA4_PROPERTY_ID=【GA4プロパティID】
GA4_KEY_FILE=./ga4-key.json
```

### GitHub Secrets（新リポジトリで設定必要）
- `GA4_PROPERTY_ID`: GA4プロパティID
- `GA4_KEY_JSON`: サービスアカウントキーの内容

### Vercel設定
- **プロジェクト名**: media-site
- **カスタムドメイン**: miyabito.bond-llc.jp
- **ビルドコマンド**: npm run build
- **出力ディレクトリ**: dist

### DNS設定（お名前.com）
```
Type: CNAME
Name: miyabito
Value: cname.vercel-dns.com
```

## 📁 バックアップ状況

### ✅ 完了したバックアップ
1. **Gitリポジトリ**: リモートにプッシュ済み
2. **ローカルファイル**: `/Users/hashiguchimasaki/project/media-site-backup-20251012-224212/`

### 📋 実装済み機能
- [x] みやビズブランド変更
- [x] 記事並び替え機能（新着順・人気順）
- [x] Google Analytics API連携
- [x] GitHub Actions自動ビュー数更新
- [x] aboutページの刷新

## 🚀 移行後に必要な作業

### 1. 新GitHubリポジトリで
- [ ] GitHub Secretsの再設定
- [ ] GitHub Actionsの動作確認

### 2. 新Vercelプロジェクトで
- [ ] 環境変数の設定
- [ ] カスタムドメインの追加
- [ ] デプロイの動作確認

### 3. 新Google Accountで
- [ ] GA4プロパティの作成
- [ ] サービスアカウントの作成
- [ ] APIキーの再生成

### 4. DNS設定
- [ ] 新Vercelプロジェクトへの向け先変更

## ⚠️ 注意事項

### データ損失防止
- このバックアップファイルは移行完了まで保持
- 問題発生時は `/Users/hashiguchimasaki/project/media-site-backup-20251012-224212/` から復旧可能
- GitHub原本: https://github.com/madao1056/miyazaki-tech-media

### 移行リスク
- DNS切り替え時のアクセス断絶（数分〜数時間）
- GA4データの継続性（新プロパティでリセット）
- 外部サービス連携の再設定が必要

## 📞 緊急時連絡先

移行中に問題が発生した場合:
1. 元のGitHubリポジトリから復旧
2. ローカルバックアップから復旧
3. Vercel設定の確認

## 🔄 次のステップ

1. 新Googleアカウント作成
2. 新GitHubアカウント作成
3. 新Vercelアカウント作成
4. リポジトリTransfer
5. 各種設定の移行

---

**このファイルは移行完了まで保持してください**