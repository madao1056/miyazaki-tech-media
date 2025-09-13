// WordPress REST API integration for Miyazaki Technology×Business Media
import type { Post, Category, Author, Media } from '../types/wordpress';

const WORDPRESS_API_BASE = process.env.WORDPRESS_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2';

export class WordPressAPI {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = WORDPRESS_API_BASE;
    this.headers = {
      'Content-Type': 'application/json',
    };
    
    // Basic authentication if credentials are provided
    if (process.env.WORDPRESS_USERNAME && process.env.WORDPRESS_PASSWORD) {
      const auth = btoa(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`);
      this.headers['Authorization'] = `Basic ${auth}`;
    }
  }

  // 記事の取得
  async getPosts(params: {
    page?: number;
    per_page?: number;
    categories?: number[];
    search?: string;
    orderby?: 'date' | 'modified' | 'title' | 'menu_order';
    order?: 'asc' | 'desc';
  } = {}): Promise<Post[]> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${this.baseUrl}/posts?${searchParams}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return response.json();
  }

  // 特定記事の取得
  async getPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return response.json();
  }

  // カテゴリー別記事取得
  async getPostsByCategory(categorySlug: string, limit: number = 10): Promise<Post[]> {
    const categories = await this.getCategories();
    const category = categories.find(cat => cat.slug === categorySlug);
    
    if (!category) {
      throw new Error(`Category not found: ${categorySlug}`);
    }

    return this.getPosts({
      categories: [category.id],
      per_page: limit,
      orderby: 'date',
      order: 'desc'
    });
  }

  // カテゴリー取得
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.baseUrl}/categories`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  // 著者取得
  async getAuthors(): Promise<Author[]> {
    const response = await fetch(`${this.baseUrl}/users`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch authors: ${response.statusText}`);
    }

    return response.json();
  }

  // メディア取得
  async getMedia(id: number): Promise<Media> {
    const response = await fetch(`${this.baseUrl}/media/${id}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    return response.json();
  }

  // 記事投稿（新規作成）
  async createPost(post: {
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
  }): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        ...post,
        status: post.status || 'draft',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`);
    }

    return response.json();
  }

  // 記事更新
  async updatePost(id: number, updates: Partial<Post>): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`);
    }

    return response.json();
  }

  // ランキング用データ取得（カスタムエンドポイント）
  async getRankingData(period: 'week' | 'month' = 'week'): Promise<Post[]> {
    // この機能は WordPress 側でカスタムエンドポイントを作成する必要があります
    const response = await fetch(`${this.baseUrl}/ranking/${period}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      // フォールバック: 通常の記事取得で代替
      return this.getPosts({
        per_page: 10,
        orderby: 'date',
        order: 'desc'
      });
    }

    return response.json();
  }

  // 検索
  async searchPosts(query: string, limit: number = 10): Promise<Post[]> {
    return this.getPosts({
      search: query,
      per_page: limit,
      orderby: 'relevance'
    });
  }
}

// シングルトンインスタンス
export const wordpressAPI = new WordPressAPI();

// ヘルパー関数
export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  return wordpressAPI.getPosts({
    per_page: limit,
    orderby: 'date',
    order: 'desc'
  });
}

export async function getCategoryPosts(categorySlug: string, limit: number = 6): Promise<Post[]> {
  return wordpressAPI.getPostsByCategory(categorySlug, limit);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  // メタフィールドで特集記事をマークしている場合
  return wordpressAPI.getPosts({
    per_page: 3,
    orderby: 'date',
    order: 'desc'
    // meta_query for featured posts would be added here
  });
}