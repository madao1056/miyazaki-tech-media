# みやびと 開発ガイド

## サイト概要

宮崎で輝く人々の物語を伝えるストーリーメディア - 多様な生き方、働き方、挑戦の物語を発信
URL: https://miyabito.bond-llc.jp
運営: ボンド
コンセプト: 「宮崎の人（みやびと）の物語が、あなたの人生の道しるべになる」

## コンテンツ管理方式：MDX（完全静的）

### 選択理由

- SEO最適化：Core Web Vitals高スコア、最高ページ速度
- 完全無料運用（Vercel無料枠）
- サーバーダウンリスク無し
- Astro画像最適化自動適用
- Claude Codeでの記事作成が効率的

### 記事作成フロー

1. Claude Codeが`src/content/articles/`にMDXファイル作成
2. 画像は`src/assets/images/articles/`に配置
3. 自動的にページ生成・sitemap更新

## 記事作成手順（Claude Code用）

### 1. 記事フォルダとファイルの作成

```bash
# 記事フォルダを作成（URLスラッグになる）
mkdir src/content/articles/article-slug-name

# index.mdxファイルを作成
touch src/content/articles/article-slug-name/index.mdx
```

### 2. 記事の必須フロントマター

```yaml
---
isDraft: false  # 下書きかどうか（公開する場合はfalse）
isMainHeadline: false  # メインヘッドラインに表示するか
isSubHeadline: false  # サブヘッドラインに表示するか
title: "記事タイトル"
description: "記事の説明（SEO用）"
cover: "@assets/images/articles/article-slug-name/cover.jpg"  # カバー画像のパス
category: "freelance"  # カテゴリー（freelance | small-business | new-workstyle | business-ideas）
publishedTime: 2025-01-14T00:00:00.000Z  # 公開日時（ISO形式）
authors:
  - hashiguchi-masaki  # 著者ID（src/content/authors/に定義）
tags: ["フリーランス", "Web制作", "宮崎市"]  # タグ
---
```

### 3. 画像の配置

```bash
# 記事用画像フォルダを作成
mkdir src/assets/images/articles/article-slug-name

# カバー画像を配置（必須）
# src/assets/images/articles/article-slug-name/cover.jpg

# 記事内画像も同じフォルダに配置
# src/assets/images/articles/article-slug-name/image1.jpg
```

### 4. MDXでの画像参照

```mdx
import coverImage from "@assets/images/articles/article-slug-name/cover.jpg";
import image1 from "@assets/images/articles/article-slug-name/image1.jpg";

![説明文](coverImage)
```

### 5. ビルド前の確認事項

- `src/lib/data/article-views.json` が存在すること（空でもOK）
- 著者が`src/content/authors/`に定義されていること
- カテゴリーが有効な値であること

### 6. 公開手順

```bash
# ビルドテスト
npm run build

# 開発サーバーで確認
npm run dev

# Gitにコミット
git add .
git commit -m "feat: 新規記事追加"

# Vercelへデプロイ
git push origin main
```

### ファイル構造

```
project/
├── public/
│   └── images/
│       └── authors/      # 著者用画像（旧）
├── src/
│   ├── assets/images/
│   │   ├── articles/     # 記事用画像
│   │   └── authors/      # 著者用画像
│   └── content/
│       ├── articles/     # 記事MDXファイル
│       ├── authors/      # 著者情報
│       ├── categories/   # カテゴリー定義
│       └── views/        # ページビュー（about, contactなど）
```

### MDX記事テンプレート

```yaml
---
title: "記事タイトル"
description: "記事説明"
category: "freelance" # freelance | small-business | new-workstyle | business-ideas
subcategory: "Web制作・デザイン"
workstyle: "フリーランス"
careerStage: "30代独立"
region: "宮崎市"
author: "橋口真幸"
publishDate: "2025-01-01"
image: "/images/articles/filename.jpg"
tags: ["フリーランス", "Web制作", "宮崎市", "30代独立"]
---
記事本文（MDX形式）
```

### 画像管理

- アップロード先：`src/assets/images/articles/`
- 命名規則：`{category}-{連番}.jpg`（例：`freelance-001.jpg`）
- MDX内参照：記事フォルダ内の画像をインポートして使用
- Astroが自動で最適化・レスポンシブ対応

## カテゴリー分類

### メインカテゴリー

- **フリーランスの世界** (freelance): 自由な働き方を実現するフリーランスの実態と始め方
  - サブカテゴリー: Web制作・デザイン, コンサルティング, クリエイティブ, 専門サービス
- **小さな会社経営** (small-business): 小規模でも持続可能な事業経営のノウハウと事例
  - サブカテゴリー: 地域密着ビジネス, オンラインビジネス, 伝統×革新事業, サービス業
- **新しい働き方** (new-workstyle): 従来の会社員以外の多様な働き方の選択肢
  - サブカテゴリー: リモートワーク, 副業・複業, ワーケーション, 地方移住×仕事
- **事業アイデア** (business-ideas): 新しいビジネスの種となるアイデアと実現方法
  - サブカテゴリー: 未来のビジネス, 社会課題解決, 地域資源活用, テクノロジー活用

### タグ運用

- **業界タグ**: 製造業, 建設業, 小売業, 飲食業, 医療・介護, 教育, 農業, 観光業, 運輸業, 金融業, クリエイティブ, コンサルティング, IT・Web, サービス業
- **働き方タグ**: フリーランス, 個人事業主, 小さな会社, 副業, リモートワーク, ワーケーション, 地方移住, 起業
- **事業規模タグ**: 一人事業, 小規模チーム, 家族経営, スタートアップ, 地域密着, オンライン完結, 実店舗型, サービス型
- **キャリアステージタグ**: 新卒・第二新卒, 20代転職, 30代独立, セカンドキャリア, 学生起業, 子育て×仕事, シニア起業, Uターン転職
- **地域タグ**: 宮崎市, 延岡市, 都城市, 日南市, 小林市, 日向市, 串間市, 西都市, えびの市

## コンテンツタイプ

1. **通常記事**: 各カテゴリーに応じた記事
2. **連載コラム**: シリーズ記事（/series）
3. **動画メディア**: 動画コンテンツ（/video）
4. **週間ランキング**: 人気記事ランキング（/ranking）

## 重要な決定事項

- **WordPress不使用**: MDX完全静的方式を採用
- **画像管理**: public/images/articles/ に直接配置
- **記事作成**: Claude Codeが全て担当
- **SEO重視**: 静的サイトの高速性を最大活用

## ドメイン構成

### 現在のサイト構造

- **メディアサイト**: `miyabito.bond-llc.jp` (サブドメイン)
  - みやびと
  - astro-newsテンプレート使用
  - Astro設定: サブドメイン構成

### サイト構成

1. **メインサイト**: `bond-llc.jp/`
   - 会社ホームページ
   - テンプレート: [AstroWind](https://github.com/arthelokyo/astrowind)
2. **メディアサイト**: `miyabito.bond-llc.jp`
   - みやびと
   - サブドメインとして運用

### 実装方法（サブドメイン構成）

```
Vercelプロジェクト構成:
1. bond-llc-main (bond-llc.jp)
   - AstroWindテンプレート
   - ルートドメイン用

2. media-site (miyabito.bond-llc.jp)
   - astro-newsテンプレート
   - サブドメイン設定
```

### DNS設定

```
お名前.com DNS設定:
- A Record: bond-llc.jp → Vercel IP
- CNAME: miyabito.bond-llc.jp → media-site.vercel.app
```

## 実施状況 (2025/01/13)

### 完了済み

1. ✅ メインサイト用リポジトリ作成
   - リポジトリ: `https://github.com/madao1056/bond-llc-main`
   - 場所: `/Users/hashiguchimasaki/project/bond-llc-main`
2. ✅ AstroWindテンプレートをクローン
   - 最新版のAstroWindテンプレートを導入
   - 依存関係インストール済み

### 現在の構成

```
/Users/hashiguchimasaki/project/
├── media-site/        # メディアサイト (miyabito.bond-llc.jp)
│   ├── astro-news テンプレート
│   └── サブドメイン構成
│
└── bond-llc-main/     # メインサイト (bond-llc.jp)
    ├── AstroWind テンプレート
    └── vercel.json (リライト設定含む)
```

### デプロイ完了状況

1. **メインサイト (bond-llc-main)** ✅
   - URL: https://bond-llc-main-jqpidjd8x-madao1056s-projects.vercel.app
   - リポジトリ: https://github.com/madao1056/bond-llc-main
   - AstroWindテンプレート使用
2. **メディアサイト (media-site)** ✅
   - URL: https://media-site-kbx58azxz-madao1056s-projects.vercel.app
   - リポジトリ: https://github.com/madao1056/media-site
   - サブドメイン設定済み

3. **リライト設定** ✅
   - メインサイトの `vercel.json` に設定済み
   - サブドメインで独立運用

### ドメイン設定手順（要手動作業）

1. **DNS設定**（ドメインレジストラで設定）

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

2. **Vercel管理画面での設定**
   - https://vercel.com/madao1056s-projects/bond-llc-main/settings/domains
   - `bond-llc.jp` を追加
   - DNS設定完了後、自動的に有効化

3. **動作確認**
   - `bond-llc.jp` → メインサイト表示
   - `miyabito.bond-llc.jp` → メディアサイト表示

## 開発中の仕様

### OAuth認証追加 (`oauth-authentication`)

既存の認証システムにOAuth認証機能を追加

- ステータス: 初期化完了
- spec path: `.kiro/specs/oauth-authentication/`
