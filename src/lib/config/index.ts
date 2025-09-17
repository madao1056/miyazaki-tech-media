import type { Link } from "../types";

export const SITE = {
  title: "BizMap（ビズマップ）",
  description: "宮崎の経営者が語る、挑戦と成長のリアルストーリー。なぜ起業したのか、どう困難を乗り越えたのか。あなたのキャリアの地図になる",
  author: "合同会社bond",
  url: "https://biz-map.bond-llc.jp",
  locale: "ja-JP",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 6,
};

export const NAVIGATION_LINKS: Link[] = [
  {
    href: "/categories/freelance",
    text: "フリーランスの世界",
  },
  {
    href: "/categories/small-business",
    text: "小さな会社経営",
  },
  {
    href: "/categories/new-workstyle",
    text: "新しい働き方",
  },
  {
    href: "/categories/business-ideas",
    text: "事業アイデア",
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
    text: "BizMapについて",
  },
  {
    href: "/authors",
    text: "運営者情報",
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
    text: "人気記事ランキング",
  },
  {
    href: "https://biz-map.bond-llc.jp/rss.xml",
    text: "RSS",
  },
  {
    href: "https://biz-map.bond-llc.jp/sitemap-index.xml",
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
  'freelance': {
    name: 'フリーランスの世界',
    description: '自由な働き方を実現するフリーランスの実態と始め方',
    subcategories: [
      { slug: 'web-design', name: 'Web制作・デザイン' },
      { slug: 'consulting', name: 'コンサルティング' },
      { slug: 'creative', name: 'クリエイティブ' },
      { slug: 'specialized-service', name: '専門サービス' }
    ]
  },
  'small-business': {
    name: '小さな会社経営',
    description: '小規模でも持続可能な事業経営のノウハウと事例',
    subcategories: [
      { slug: 'local-business', name: '地域密着ビジネス' },
      { slug: 'online-business', name: 'オンラインビジネス' },
      { slug: 'tradition-innovation', name: '伝統×革新事業' },
      { slug: 'service-industry', name: 'サービス業' }
    ]
  },
  'new-workstyle': {
    name: '新しい働き方',
    description: '従来の会社員以外の多様な働き方の選択肢',
    subcategories: [
      { slug: 'remote-work', name: 'リモートワーク' },
      { slug: 'side-business', name: '副業・複業' },
      { slug: 'workation', name: 'ワーケーション' },
      { slug: 'rural-relocation', name: '地方移住×仕事' }
    ]
  },
  'business-ideas': {
    name: '事業アイデア',
    description: '新しいビジネスの種となるアイデアと実現方法',
    subcategories: [
      { slug: 'future-business', name: '未来のビジネス' },
      { slug: 'social-solutions', name: '社会課題解決' },
      { slug: 'regional-resources', name: '地域資源活用' },
      { slug: 'tech-utilization', name: 'テクノロジー活用' }
    ]
  }
};

// 業界タグ
export const INDUSTRY_TAGS = [
  '製造業', '建設業', '小売業', '飲食業', '医療・介護',
  '教育', '農業', '観光業', '運輸業', '金融業',
  'クリエイティブ', 'コンサルティング', 'IT・Web', 'サービス業'
];

// 働き方タグ
export const WORKSTYLE_TAGS = [
  'フリーランス', '個人事業主', '小さな会社', '副業',
  'リモートワーク', 'ワーケーション', '地方移住', '起業'
];

// 事業規模タグ
export const BUSINESS_SCALE_TAGS = [
  '一人事業', '小規模チーム', '家族経営', 'スタートアップ',
  '地域密着', 'オンライン完結', '実店舗型', 'サービス型'
];

// キャリアステージタグ
export const CAREER_STAGE_TAGS = [
  '新卒・第二新卒', '20代転職', '30代独立', 'セカンドキャリア',
  '学生起業', '子育て×仕事', 'シニア起業', 'Uターン転職'
];

// 地域タグ
export const REGION_TAGS = [
  '宮崎市', '延岡市', '都城市', '日南市', '小林市',
  '日向市', '串間市', '西都市', 'えびの市'
];
