import type { Link } from "../types";

export const SITE = {
  title: "宮崎テクノロジー×ビジネスメディア",
  description: "宮崎県のテクノロジー×ビジネス特化型メディアサイト",
  author: "合同会社bond",
  url: "https://bond-llc.jp/tech",
  locale: "ja-JP",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/tech/",
  postsPerPage: 6,
};

export const NAVIGATION_LINKS: Link[] = [
  {
    href: "/categories/dx",
    text: "DX推進",
  },
  {
    href: "/categories/ai-business",
    text: "AIビジネス",
  },
  {
    href: "/categories/local-tech",
    text: "地域テック",
  },
  {
    href: "/categories/management-it",
    text: "経営×IT",
  },
  {
    href: "/series",
    text: "連載コラム",
  },
  {
    href: "/video",
    text: "動画メディア",
  },
];

export const OTHER_LINKS: Link[] = [
  {
    href: "/about",
    text: "会社概要",
  },
  {
    href: "/authors",
    text: "執筆者一覧",
  },
  {
    href: "/contact",
    text: "お問い合わせ",
  },
  {
    href: "/privacy",
    text: "プライバシーポリシー",
  },
  {
    href: "/terms",
    text: "利用規約",
  },
  {
    href: "/ranking",
    text: "週間ランキング",
  },
  {
    href: "https://bond-llc.jp/tech/rss.xml",
    text: "RSS",
  },
  {
    href: "https://bond-llc.jp/tech/sitemap-index.xml",
    text: "サイトマップ",
  },
];

export const SOCIAL_LINKS: Link[] = [
  {
    href: "https://twitter.com/bondllc_jp",
    text: "Twitter",
    icon: "newTwitter",
  },
  {
    href: "https://www.facebook.com/bondllc.jp",
    text: "Facebook",
    icon: "facebook",
  },
];

// 新しいカテゴリ設定
export const CATEGORIES = {
  'dx': {
    name: 'DX推進',
    description: '宮崎県内企業のデジタル変革事例・導入ガイド',
    subcategories: [
      { slug: 'dx-case-study', name: '導入事例' },
      { slug: 'dx-tools', name: 'ツール比較' },
      { slug: 'dx-strategy', name: '戦略立案' },
      { slug: 'dx-subsidy', name: '補助金情報' }
    ]
  },
  'ai-business': {
    name: 'AIビジネス',
    description: 'AI活用による業務効率化・新サービス開発',
    subcategories: [
      { slug: 'ai-automation', name: '業務自動化' },
      { slug: 'ai-analytics', name: 'データ分析' },
      { slug: 'ai-customer-service', name: '顧客対応' },
      { slug: 'ai-marketing', name: 'マーケティング活用' }
    ]
  },
  'local-tech': {
    name: '地域テック',
    description: '宮崎発のテクノロジー企業・人材・イノベーション',
    subcategories: [
      { slug: 'local-startup', name: '地域スタートアップ' },
      { slug: 'tech-talent', name: '技術人材' },
      { slug: 'innovation-hub', name: 'イノベーション拠点' },
      { slug: 'regional-policy', name: '地域政策' }
    ]
  },
  'management-it': {
    name: '経営×IT',
    description: '経営者向けIT戦略・システム導入・ROI分析',
    subcategories: [
      { slug: 'it-strategy', name: 'IT戦略' },
      { slug: 'system-integration', name: 'システム統合' },
      { slug: 'security', name: 'セキュリティ対策' },
      { slug: 'cost-optimization', name: 'コスト最適化' }
    ]
  }
};

// 業界タグ
export const INDUSTRY_TAGS = [
  '製造業', '建設業', '小売業', '飲食業', '医療・介護',
  '教育', '農業', '観光業', '運輸業', '金融業'
];

// 技術タグ
export const TECH_TAGS = [
  'ChatGPT', 'Claude', 'Microsoft365', 'Google Workspace',
  'Slack', 'Zoom', 'Salesforce', 'kintone', 'freee',
  'Power BI', 'Tableau', 'RPA', 'IoT', 'クラウド'
];

// 地域タグ
export const REGION_TAGS = [
  '宮崎市', '延岡市', '都城市', '日南市', '小林市',
  '日向市', '串間市', '西都市', 'えびの市'
];
