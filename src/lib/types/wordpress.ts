// WordPress REST API types for Miyazaki Technology×Business Media

export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    industry_tags?: string[];
    tech_tags?: string[];
    region_tags?: string[];
    subcategory?: string;
    reading_time?: number;
    view_count?: number;
    share_count?: number;
  };
  categories: number[];
  tags: number[];
  // カスタムフィールド
  acf?: {
    [key: string]: any;
  };
  _embedded?: {
    author?: Author[];
    'wp:featuredmedia'?: Media[];
    'wp:term'?: Array<Category[] | Tag[]>;
  };
}

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'category';
  parent: number;
  meta: any[];
  acf?: {
    subcategories?: {
      slug: string;
      name: string;
    }[];
  };
}

export interface Tag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'post_tag';
  meta: any[];
}

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [size: string]: string;
  };
  meta: any[];
  acf?: {
    position?: string;
    company?: string;
    expertise?: string[];
    social_links?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
}

export interface Media {
  id: number;
  date: string;
  slug: string;
  type: 'attachment';
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  template: string;
  meta: any[];
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: 'image' | 'file' | 'video';
  mime_type: string;
  media_details: {
    width?: number;
    height?: number;
    file?: string;
    sizes?: {
      [size: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

// 日本語コンテンツ用の拡張型
export interface LocalizedPost extends Post {
  japanese_meta: {
    industry: '製造業' | '建設業' | '小売業' | '飲食業' | '医療・介護' | '教育' | '農業' | '観光業' | '運輸業' | '金融業';
    technology: 'ChatGPT' | 'Claude' | 'Microsoft365' | 'Google Workspace' | 'Slack' | 'Zoom' | 'Salesforce' | 'kintone' | 'freee' | 'Power BI' | 'Tableau' | 'RPA' | 'IoT' | 'クラウド';
    region: '宮崎市' | '延岡市' | '都城市' | '日南市' | '小林市' | '日向市' | '串間市' | '西都市' | 'えびの市';
    category: 'dx' | 'ai-business' | 'local-tech' | 'management-it';
    subcategory?: string;
  };
}

// ランキング用の型
export interface RankingPost extends Post {
  ranking_score: number;
  view_count: number;
  share_count: number;
  comment_count: number;
}

// 記事作成用の型
export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  categories: number[];
  tags?: number[];
  featured_media?: number;
  status?: 'draft' | 'publish' | 'pending';
  meta?: {
    industry_tags?: string[];
    tech_tags?: string[];
    region_tags?: string[];
    subcategory?: string;
  };
}

// API レスポンス用の型
export interface WordPressAPIResponse<T> {
  data: T;
  status: number;
  headers: {
    'X-WP-Total'?: string;
    'X-WP-TotalPages'?: string;
  };
}

// エラー型
export interface WordPressAPIError {
  code: string;
  message: string;
  data: {
    status: number;
  };
}