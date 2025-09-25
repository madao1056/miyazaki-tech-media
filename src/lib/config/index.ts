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
    href: "/categories/business-ideas",
    text: "飲食店",
  },
  {
    href: "/categories/management-it",
    text: "小売・小店舗",
  },
  {
    href: "/categories/local-tech",
    text: "サービス業",
  },
  {
    href: "/categories/freelance",
    text: "IT・ウェブ",
  },
  {
    href: "/categories/new-workstyle",
    text: "製造・工業",
  },
  {
    href: "/categories/small-business",
    text: "医療・介護",
  },
  {
    href: "/categories/dx",
    text: "教育・スクール",
  },
  {
    href: "/categories/ai-business",
    text: "建設・不動産",
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

// 業界カテゴリー（店舗・事業ジャンル別）
export const INDUSTRY_CATEGORIES = [
  '飲食店', '小売・小店舗', 'サービス業', 'IT・ウェブ',
  '製造・工業', '医療・介護', '教育・スクール', '建設・不動産'
];

// 地域タグ（宮崎県内）
export const REGION_TAGS = [
  '宮崎市', '延岡市', '都城市', '日南市', '小林市',
  '日向市', '串間市', '西都市', 'えびの市'
];
