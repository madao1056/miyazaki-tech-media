# 宮崎テクノロジー×ビジネスメディア 開発ガイド

## サイト概要
宮崎県のテクノロジー×ビジネス特化型メディアサイト
URL: https://bond-llc.jp
運営: 合同会社bond

## コンテンツ管理方式：MDX（完全静的）

### 選択理由
- SEO最適化：Core Web Vitals高スコア、最高ページ速度
- 完全無料運用（Vercel無料枠）
- サーバーダウンリスク無し
- Astro画像最適化自動適用
- Claude Codeでの記事作成が効率的

### 記事作成フロー
1. Claude Codeが`src/content/posts/`にMDXファイル作成
2. 画像は`public/images/articles/`に配置
3. 自動的にページ生成・sitemap更新

### ファイル構造
```
project/
├── public/
│   └── images/
│       ├── articles/     # 記事用画像
│       └── authors/      # 著者用画像
├── src/content/
│   ├── posts/           # 記事MDXファイル
│   └── categories/      # カテゴリー定義
```

### MDX記事テンプレート
```yaml
---
title: "記事タイトル"
description: "記事説明"
category: "dx" # dx | ai-business | local-tech | management-it
subcategory: "導入事例"
industry: "製造業"
technology: "ChatGPT"
region: "宮崎市"
author: "執筆者名"
publishDate: "2025-01-01"
image: "/images/articles/filename.jpg"
tags: ["製造業", "ChatGPT", "宮崎市"]
---

記事本文（MDX形式）
```

### 画像管理
- アップロード先：`public/images/articles/`
- 命名規則：`{category}-{連番}.jpg`（例：`dx-case-001.jpg`）
- MDX内参照：`![説明](/images/articles/filename.jpg)`
- Astroが自動で最適化・レスポンシブ対応

## カテゴリー分類

### メインカテゴリー
- **DX推進** (dx): 宮崎県内企業のデジタル変革事例・導入ガイド
  - サブカテゴリー: 導入事例, ツール比較, 戦略立案, 補助金情報
- **AIビジネス** (ai-business): AI活用による業務効率化・新サービス開発
  - サブカテゴリー: 業務自動化, データ分析, 顧客対応, マーケティング活用
- **地域テック** (local-tech): 宮崎発のテクノロジー企業・人材・イノベーション
  - サブカテゴリー: 地域スタートアップ, 技術人材, イノベーション拠点, 地域政策
- **経営×IT** (management-it): 経営者向けIT戦略・システム導入・ROI分析
  - サブカテゴリー: IT戦略, システム統合, セキュリティ対策, コスト最適化

### タグ運用
- **業界タグ**: 製造業, 建設業, 小売業, 飲食業, 医療・介護, 教育, 農業, 観光業, 運輸業, 金融業
- **技術タグ**: ChatGPT, Claude, Microsoft365, Google Workspace, Slack, Zoom, Salesforce, kintone, freee, Power BI, Tableau, RPA, IoT, クラウド
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
- **メディアサイト**: `bond-llc.jp/tech/` (サブディレクトリ)
  - テクノロジー×ビジネスメディア
  - astro-newsテンプレート使用
  - Astro設定: `base: "/tech/"` で配信

### 今後の展開計画
1. **メインサイト**: `bond-llc.jp/` 
   - 会社ホームページ
   - テンプレート候補: [AstroWind](https://github.com/arthelokyo/astrowind)
   
2. **メディアサイト**: `bond-llc.jp/tech/`
   - 現在開発中のサイト
   - サブディレクトリとして運用

### 実装方法（シンプルな構成）
```
Vercelプロジェクト構成:
1. bond-llc-main (bond-llc.jp) 
   - AstroWindテンプレート
   - ルートドメイン用
   
2. bond-llc-tech (bond-llc.jp/tech)
   - 現在のmedia-site
   - Vercel設定でパスリライト
```

または

```
単一リポジトリ構成（モノレポ）:
/
├── apps/
│   ├── main/     # bond-llc.jp用
│   └── tech/     # /tech/用
└── package.json
```

### Vercel設定でのパス管理
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/tech/:path*",
      "destination": "https://bond-llc-tech.vercel.app/tech/:path*"
    }
  ]
}
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
├── media-site/        # メディアサイト (bond-llc.jp/tech/)
│   ├── astro-news テンプレート
│   └── basePath: "/tech/"
│
└── bond-llc-main/     # メインサイト (bond-llc.jp)
    ├── AstroWind テンプレート
    └── vercel.json (リライト設定含む)
```

### 次のステップ
1. **メインサイト (bond-llc-main)**
   - Vercelにデプロイ
   - カスタムドメイン `bond-llc.jp` を設定
   
2. **メディアサイト (media-site)**
   - Vercelにデプロイ（プロジェクト名: bond-llc-tech）
   - サブディレクトリ `/tech/` として動作

3. **Vercel設定**
   - メインサイトの `vercel.json` でリライト設定
   - `/tech/*` へのアクセスをメディアサイトに転送