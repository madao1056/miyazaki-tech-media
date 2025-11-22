import type { Link } from "../types";

export const SITE = {
  title: "みやびと",
  ogTitle: "みやびと｜宮崎で輝く人々の物語をつなぐストーリーメディア",
  description:
    "宮崎で輝く人々の物語を届ける「みやびと」。フリーランスや起業家、新しい働き方を実践する人々のリアルな挑戦と想いを記録し、あなたの人生の道しるべに。",
  author: "ぼんど",
  url: "https://miyabito.bond-llc.jp",
  locale: "ja-JP",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 6,
};

export const NAVIGATION_LINKS: Link[] = [
  {
    href: "/about",
    text: "みやびとについて",
  },
  {
    href: "/contact",
    text: "お問い合わせ",
  },
];

export const OTHER_LINKS: Link[] = [
  {
    href: "/about",
    text: "みやびとについて",
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
    href: "https://miyabito.bond-llc.jp/rss.xml",
    text: "RSS",
  },
  {
    href: "https://miyabito.bond-llc.jp/sitemap-index.xml",
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
  "飲食店",
  "小売・小店舗",
  "サービス業",
  "IT・ウェブ",
  "製造・工業",
  "医療・介護",
  "教育・スクール",
  "建設・不動産",
];

// 地域タグ（宮崎県内）
export const REGION_TAGS = [
  "宮崎市",
  "延岡市",
  "都城市",
  "日南市",
  "小林市",
  "日向市",
  "串間市",
  "西都市",
  "えびの市",
];
