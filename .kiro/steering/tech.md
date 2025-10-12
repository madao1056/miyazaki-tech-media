# Technology Stack: みやびと

## アーキテクチャ概要

みやびとは**完全静的サイト生成 (SSG)** アーキテクチャを採用した高速メディアサイトです。

### コアコンセプト

- **Static Site Generation**: ビルド時に全ページを事前生成
- **MDX-based Content**: マークダウン+JSXによるコンテンツ管理
- **Zero Runtime JavaScript**: 必要最小限のJSのみクライアント送信
- **Edge Deployment**: Vercelによるグローバル配信

## フロントエンド技術

### フレームワーク

- **[Astro v5](https://astro.build)** (v5.13.2)
  - 静的サイトジェネレーター
  - アイランドアーキテクチャによる部分的なハイドレーション
  - ビルドイン画像最適化
  - Content Collections API

### UIライブラリ

- **[React](https://react.dev)** (v19.1.1)
  - インタラクティブコンポーネント用
  - 検索モーダル、カルーセルなどで使用

### スタイリング

- **[Tailwind CSS](https://tailwindcss.com)** (v4.1.12)
  - ユーティリティファーストCSS
  - `@tailwindcss/vite` プラグイン使用
  - `@tailwindcss/typography` でMarkdown表示最適化
- **[DaisyUI](https://daisyui.com)** (v5.0.50)
  - Tailwindベースのコンポーネントライブラリ
  - テーマシステム（ライト/ダーク切り替え）

### コンテンツ処理

- **[@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/)** (v4.3.4)
  - MDXファイルのパース・レンダリング
  - rehype/remark プラグインエコシステム
- **[remark-gfm](https://github.com/remarkjs/remark-gfm)**
  - GitHub Flavored Markdown対応
- **[remark-smartypants](https://github.com/silvenon/remark-smartypants)**
  - タイポグラフィ最適化

### 検索機能

- **[Pagefind](https://pagefind.app/)** (v1.3.0)
  - 静的サイト向け全文検索
  - ビルド時インデックス生成
  - オフライン検索対応
- **[astro-pagefind](https://github.com/shishkin/astro-pagefind)** (v1.8.3)
  - Astro統合パッケージ

## データ管理・型システム

### TypeScript

- **[TypeScript](https://www.typescriptlang.org/)** (v5.9.2)
  - 厳格な型チェック (`astro/tsconfigs/strict` 拡張)
  - パスエイリアス: `@/*` → `src/*`, `@assets/*` → `src/assets/*`
  - JSX設定: `react-jsx` with React import source

### コンテンツ型定義

```typescript
// src/lib/types/index.ts
export type Article = CollectionEntry<"articles">;
export type ArticleWithMetrics = Article & {
  popularityScore?: number;
  pageViews?: number;
  trending?: boolean;
};
```

### Content Collections

- `articles`: 記事コンテンツ（MDX）
- `authors`: 著者情報（MDX）
- `categories`: カテゴリー定義（JSON）
- `views`: 固定ページ（MDX）

## 分析・計測

### Google Analytics 4

- **[@google-analytics/data](https://www.npmjs.com/package/@google-analytics/data)** (v5.2.0)
  - GA4 Data APIクライアント
  - リアルタイムデータ取得
  - ランキング生成用

実装位置: `src/lib/analytics/ga4.ts`

## ビルド・開発ツール

### パッケージマネージャー

- **npm** (標準)

### 開発サーバー

```bash
npm run dev
```

- デフォルトポート: `4321`
- ホットリロード対応

### ビルド

```bash
npm run build
```

- 静的ファイルを `dist/` に出力
- Pagefindインデックス自動生成

### プレビュー

```bash
npm run preview
```

- ビルド後のサイトをローカルプレビュー

### 型チェック

```bash
npx astro check
```

- Astroファイルの型チェック
- TypeScriptコンパイルエラー検出

## デプロイメント

### ホスティング

- **[Vercel](https://vercel.com)**
  - サブドメイン構成: `miyabito.bond-llc.jp`
  - 自動デプロイ: Gitプッシュ時
  - エッジネットワーク配信

### ビルド設定

- フレームワークプリセット: Astro
- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- Node.js バージョン: 18.x以上推奨

## 依存関係の主要バージョン

### Core Dependencies

```json
{
  "astro": "^5.13.2",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "typescript": "^5.9.2",
  "tailwindcss": "^4.1.12"
}
```

### Astro Integrations

```json
{
  "@astrojs/check": "^0.9.4",
  "@astrojs/mdx": "^4.3.4",
  "@astrojs/react": "^4.3.0",
  "@astrojs/rss": "^4.0.12",
  "@astrojs/sitemap": "^3.5.0"
}
```

## 環境変数

### 必須環境変数

なし（完全静的サイトのため、ビルド時に全て解決）

### オプション環境変数

- **GA4関連**（ランキング機能使用時のみ）
  - `GOOGLE_APPLICATION_CREDENTIALS`: GA4 APIサービスアカウントキー
  - `GA4_PROPERTY_ID`: Google Analytics 4 プロパティID

設定方法: `docs/ANALYTICS_SETUP.md` を参照

## ポート構成

### 開発環境

- **4321**: Astro開発サーバー（デフォルト）

### プレビュー環境

- **4322**: Astro プレビューサーバー（デフォルト）

## コード品質ツール

### 使用中のツール

- **TypeScript Compiler**: 型チェック
- **Astro Check**: Astroファイルの型チェック

### 未使用（今後検討可能）

- ESLint: Lintルール
- Prettier: コードフォーマット
- Husky: Git hooks

## パフォーマンス最適化

### 画像最適化

- Astroビルトイン画像最適化
- 自動的にWebP/AVIF形式に変換
- レスポンシブ画像の自動生成
- 遅延ロード（lazy loading）

### フォント最適化

- **[@fontsource-variable/source-serif-4](https://fontsource.org/)** (v5.2.8)
- **[@fontsource/source-sans-pro](https://fontsource.org/)** (v5.2.5)
- セルフホスティングでCDN依存を排除

### CSS最適化

- Tailwind CSS の PurgeCSS による未使用CSS削除
- クリティカルCSS のインライン化

## セキュリティ考慮事項

### 静的サイトの利点

- サーバーサイド攻撃ベクトル無し
- データベース不要
- 認証/セッション管理不要

### コンテンツセキュリティ

- Markdown/MDXのサニタイゼーション（remark/rehypeで処理）
- XSS対策はフレームワークレベルで対応

## トラブルシューティング

### よくある問題

#### ビルドエラー

```bash
# 型エラーが出る場合
npx astro check

# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install
```

#### Pagefind検索が動かない

```bash
# ビルド後にPagefindインデックスを確認
ls dist/_pagefind/
# index.json が存在するか確認
```

#### GA4データが取得できない

- `docs/ANALYTICS_SETUP.md` の設定を確認
- サービスアカウントの権限を確認
- プロパティIDが正しいか確認

## 技術的な決定事項

### WordPress不使用の理由

1. SEO最適化: 静的サイトの高速性
2. コスト: 完全無料運用（Vercel無料枠）
3. 保守性: サーバー管理不要
4. 信頼性: ダウンタイムリスク無し
5. 開発効率: Claude Codeでの記事作成が効率的

### MDX採用の理由

1. 柔軟性: Markdown + React コンポーネント
2. 型安全性: Content Collections API
3. エコシステム: remark/rehype プラグイン豊富
4. パフォーマンス: ビルド時処理で高速
