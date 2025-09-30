# Project Structure: BizMap

## ルートディレクトリ構成

```
media-site/
├── .astro/              # Astro自動生成ファイル（型定義など）
├── .kiro/               # Kiro steering documents
│   └── steering/        # プロジェクト知識管理
├── .vercel/             # Vercelデプロイ設定
├── docs/                # プロジェクトドキュメント
├── node_modules/        # 依存パッケージ
├── public/              # 静的アセット（画像など）
├── src/                 # ソースコード（詳細は下記）
├── CLAUDE.md            # Claude Code プロジェクト設定
├── README.md            # プロジェクト概要
├── astro.config.mjs     # Astro設定ファイル
├── keystatic.config.ts  # Keystatic CMS設定
├── package.json         # 依存関係・スクリプト定義
├── tailwind.config.mjs  # Tailwind CSS設定
└── tsconfig.json        # TypeScript設定
```

## src/ ディレクトリ詳細

### 全体構造

```
src/
├── assets/              # ソース管理される画像・SVG
├── components/          # 再利用可能なAstroコンポーネント
├── content/             # MDXコンテンツ（記事・著者・カテゴリー）
├── layouts/             # ページレイアウトテンプレート
├── lib/                 # ユーティリティ・ビジネスロジック
├── pages/               # ファイルベースルーティング
├── styles/              # グローバルスタイル
├── content.config.ts    # Content Collections定義
└── env.d.ts             # TypeScript環境型定義
```

## コンポーネント構成 (src/components/)

### 階層的なコンポーネント設計

```
components/
├── bases/               # 基本的な再利用パーツ
│   ├── divider.astro           # 区切り線
│   ├── head.astro              # HTML <head> タグ
│   ├── icon.astro              # SVGアイコン表示
│   ├── navbar-item.astro       # ナビゲーション項目
│   ├── script.astro            # スクリプトタグ
│   ├── share-item.astro        # SNSシェアボタン
│   └── theme-controller.astro  # ダークモード切り替え
│
├── cards/               # カード型コンポーネント
│   ├── authorCard.astro        # 著者カード
│   ├── mainHeadline.astro      # メインヘッドライン
│   ├── newsCard.astro          # ニュースカード
│   ├── rankingMainCard.astro   # ランキング1位カード
│   ├── rankingSubCard.astro    # ランキング2位以下カード
│   ├── subHeadlineCard.astro   # サブヘッドライン
│   └── wideCard.astro          # 横長カード
│
├── elements/            # UI要素コンポーネント
│   ├── breadcrumb.astro        # パンくずナビゲーション
│   ├── menu-dropdown.astro     # ドロップダウンメニュー
│   ├── navbar.astro            # ナビゲーションバー
│   ├── search-modal.astro      # 検索モーダル
│   ├── share.astro             # SNSシェアセクション
│   └── top-header.astro        # トップヘッダー
│
├── shared/              # 共通レイアウトパーツ
│   ├── Carousel.astro          # カルーセル（React）
│   ├── banner-section.astro    # バナーセクション
│   ├── footer.astro            # フッター
│   ├── header.astro            # ヘッダー
│   ├── pagination.astro        # ページネーション
│   └── view-list-header.astro  # リストビューヘッダー
│
└── sidebar/             # サイドバーコンポーネント
    ├── ad-space.astro          # 広告スペース
    ├── category-search.astro   # カテゴリー検索
    ├── latest-articles.astro   # 最新記事一覧
    └── popular-articles.astro  # 人気記事一覧
```

### コンポーネント設計原則

1. **bases/**: 最小単位の再利用パーツ（アトミックコンポーネント）
2. **cards/**: 記事表示用のカード型コンポーネント（モレキュラー）
3. **elements/**: ナビゲーションなどのUI要素（モレキュラー）
4. **shared/**: 複数ページで共有される大きなセクション（オーガニズム）
5. **sidebar/**: サイドバー専用コンポーネント（特化型）

## コンテンツ構成 (src/content/)

### Content Collections構造

```
content/
├── articles/            # 記事コンテンツ（MDX）
│   └── {article-slug}/
│       └── index.mdx
│
├── authors/             # 著者情報（MDX）
│   └── {author-id}/
│       └── index.mdx
│
├── categories/          # カテゴリー定義（JSON）
│   ├── ai-business/index.json
│   ├── business-ideas/index.json
│   ├── dx/index.json
│   ├── freelance/index.json
│   ├── it-web/index.json
│   ├── local-tech/index.json
│   ├── management-it/index.json
│   ├── new-workstyle/index.json
│   └── small-business/index.json
│
└── views/               # 固定ページ（MDX）
    ├── about.mdx        # サイト概要
    ├── articles.mdx     # 記事一覧ページ説明
    ├── author.mdx       # 著者ページ説明
    ├── authors.mdx      # 著者一覧説明
    ├── categories.mdx   # カテゴリー一覧説明
    ├── contact.mdx      # お問い合わせ
    ├── error404.mdx     # 404エラー
    ├── home.mdx         # ホームページ説明
    ├── operator.mdx     # 運営者情報
    ├── privacy.mdx      # プライバシーポリシー
    ├── ranking.mdx      # ランキングページ説明
    ├── search.mdx       # 検索ページ説明
    ├── series.mdx       # 連載ページ説明
    ├── terms.mdx        # 利用規約
    └── video.mdx        # 動画ページ説明
```

### 記事フロントマター構造

```yaml
---
title: "記事タイトル"
description: "記事説明"
category: "freelance" # カテゴリーID
subcategory: "Web制作・デザイン" # サブカテゴリー
workstyle: "フリーランス" # 働き方
careerStage: "30代独立" # キャリアステージ
region: "宮崎市" # 地域
author: "橋口真幸" # 著者名
publishDate: "2025-01-01" # 公開日
image: "/images/articles/xxx.jpg" # アイキャッチ
tags: ["タグ1", "タグ2"] # タグ配列
---
```

## ページルーティング (src/pages/)

### ファイルベースルーティング

```
pages/
├── index.astro                  # トップページ (/)
├── 404.astro                    # 404エラーページ
│
├── _home/                       # トップページ専用コンポーネント
│   ├── authors.astro
│   ├── headerSection.astro
│   ├── headlines.astro
│   ├── latestNews.astro
│   └── news-ticker.astro
│
├── articles/                    # 記事セクション (/articles)
│   ├── index.astro              # 記事一覧
│   ├── [page].astro             # ページネーション (/articles/2)
│   ├── [id].astro               # 記事詳細 (/articles/slug)
│   └── _components/
│       └── article-header.astro
│
├── authors/                     # 著者セクション (/authors)
│   ├── index.astro              # 著者一覧
│   └── [id]/
│       ├── index.astro          # 著者詳細
│       └── [page].astro         # 著者記事ページネーション
│
├── categories/                  # カテゴリーセクション (/categories)
│   ├── index.astro              # カテゴリー一覧
│   └── [category]/
│       ├── index.astro          # カテゴリー記事一覧
│       └── [page].astro         # ページネーション
│
├── search/                      # 検索 (/search)
│   └── index.astro
│
├── search-tags/                 # タグ検索 (/search-tags)
│   └── index.astro
│
├── ranking/                     # ランキング (/ranking)
│   └── index.astro
│
├── series/                      # 連載 (/series)
│   └── index.astro
│
├── video/                       # 動画 (/video)
│   └── index.astro
│
├── about.astro                  # サイト概要 (/about)
├── contact.astro                # お問い合わせ (/contact)
├── operator.astro               # 運営者情報 (/operator)
├── privacy.astro                # プライバシーポリシー (/privacy)
├── terms.astro                  # 利用規約 (/terms)
└── rss.xml.js                   # RSSフィード (/rss.xml)
```

### 動的ルート規則

- `[id].astro`: 動的パラメータ（記事スラッグなど）
- `[page].astro`: ページネーション番号
- `[category]/`: カテゴリー動的ルート

## ライブラリ・ユーティリティ (src/lib/)

```
lib/
├── types/                       # TypeScript型定義
│   ├── index.ts                 # 共通型定義
│   └── wordpress.ts             # WordPress関連型（レガシー）
│
├── schema/                      # Content Collections スキーマ
│   └── index.ts
│
├── handlers/                    # データ取得・処理ロジック
│   ├── articles.ts              # 記事データハンドリング
│   ├── authors.ts               # 著者データハンドリング
│   └── categories.ts            # カテゴリーデータハンドリング
│
├── utils/                       # ユーティリティ関数
│   ├── card.ts                  # カード表示用ヘルパー
│   ├── date.ts                  # 日付フォーマット
│   ├── getMeta.ts               # メタタグ生成
│   ├── letter.ts                # 文字列処理
│   ├── remarks.mjs              # MDX用remarkプラグイン
│   └── wordpress-helpers.ts     # WordPress関連（レガシー）
│
├── config/                      # 設定ファイル
│   └── index.ts                 # サイト設定（タイトル、URLなど）
│
├── analytics/                   # 分析機能
│   └── ga4.ts                   # Google Analytics 4連携
│
├── services/                    # 外部サービス連携
│   └── wordpress.ts             # WordPress API（レガシー）
│
└── keystatic/                   # Keystatic CMS設定（レガシー）
    ├── index.ts
    ├── articlesKs.ts
    ├── authorsKs.ts
    └── categoriesKs.ts
```

### 主要ユーティリティ関数

#### `src/lib/handlers/articles.ts`

```typescript
// 記事一覧取得、フィルタリング、ソート
export const getArticles = () => {
  /* ... */
};
export const getArticlesByCategory = (category: string) => {
  /* ... */
};
export const getArticlesByAuthor = (author: string) => {
  /* ... */
};
```

#### `src/lib/utils/date.ts`

```typescript
// 日付フォーマット（date-fns使用）
export const formatDate = (date: string) => {
  /* ... */
};
```

#### `src/lib/utils/getMeta.ts`

```typescript
// メタタグ・OGP生成
export const getMeta = (entry: Entry): Meta => {
  /* ... */
};
```

## レイアウト構成 (src/layouts/)

```
layouts/
├── base.astro       # ベースレイアウト（HTML構造、head、header、footer）
├── content.astro    # コンテンツページレイアウト（記事詳細など）
└── list.astro       # 一覧ページレイアウト（記事一覧、カテゴリー一覧など）
```

### レイアウト継承

```
base.astro
  ├── content.astro  (記事詳細、固定ページ)
  └── list.astro     (一覧ページ、検索結果)
```

## 静的アセット (public/)

```
public/
├── icons/                       # サイトアイコン（favicon等）
├── images/
│   └── articles/                # 記事用画像
│       └── {記事スラッグ}.jpg
└── _pagefind/                   # Pagefind検索インデックス（ビルド時生成）
```

### 画像配置ルール

- **ソース管理画像**: `src/assets/images/` (Astro最適化対象)
- **記事画像**: `public/images/articles/` (直接配信)
- **SVGアイコン**: `src/assets/svgs/` (Astroコンポーネント化)

## インポート組織

### パスエイリアス

```typescript
// tsconfig.json で定義
"paths": {
  "@/*": ["src/*"],
  "@assets/*": ["src/assets/*"]
}
```

### インポート例

```typescript
// 型定義
import type { Article } from "@/lib/types";

// コンポーネント
import BaseLayout from "@/layouts/base.astro";

// ユーティリティ
import { formatDate } from "@/lib/utils/date";

// アセット
import Logo from "@assets/images/logo.png";
```

## 主要アーキテクチャ原則

### 1. コンポーネント設計

- **Atomic Design風**: bases → cards/elements → shared
- **単一責任**: 各コンポーネントは1つの役割のみ
- **Props型定義**: 必ず TypeScript interface で定義

### 2. データフロー

```
Content Collections (MDX/JSON)
  ↓
Handlers (データ取得・加工)
  ↓
Pages (ルーティング・レンダリング)
  ↓
Layouts (共通構造)
  ↓
Components (表示パーツ)
```

### 3. ファイル命名規則

- **Astroコンポーネント**: `kebab-case.astro` (例: `news-card.astro`)
- **TypeScriptファイル**: `camelCase.ts` (例: `getMeta.ts`)
- **コンテンツディレクトリ**: `kebab-case/` (例: `ai-business/`)
- **ページルート**: `kebab-case.astro` または `[param].astro`

### 4. コード組織パターン

- **Handlers**: ビジネスロジック・データ取得を集約
- **Utils**: 純粋関数・ヘルパー関数
- **Types**: 型定義を集中管理
- **Config**: 環境依存しない設定値

## レガシーコード

以下は過去の実装で現在は使用していない可能性あり：

- `src/lib/keystatic/`: Keystatic CMS関連
- `src/lib/services/wordpress.ts`: WordPress API連携
- `src/lib/types/wordpress.ts`: WordPress型定義
- `src/lib/utils/wordpress-helpers.ts`: WordPressヘルパー

新機能開発時は**Content Collections + MDX**パターンを優先してください。
