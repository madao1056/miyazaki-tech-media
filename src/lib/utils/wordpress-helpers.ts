// Helper utilities for WordPress integration
import type { Post, LocalizedPost, Category } from "../types/wordpress";
import { wordpressAPI } from "../services/wordpress";
import { CATEGORIES } from "../config";

// HTMLをプレーンテキストに変換
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

// 読了時間を計算（日本語対応）
export function calculateReadingTime(content: string): number {
  const plainText = stripHtml(content);
  const japaneseChars = (
    plainText.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []
  ).length;
  const englishWords = plainText
    .replace(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // 日本語: 500文字/分、英語: 250単語/分
  const readingTimeMinutes = Math.ceil(
    japaneseChars / 500 + englishWords / 250,
  );
  return Math.max(1, readingTimeMinutes);
}

// WordPress記事をAstro形式に変換
export function transformWordPressPost(post: Post): LocalizedPost {
  const readingTime = calculateReadingTime(post.content.rendered);

  return {
    ...post,
    meta: {
      ...post.meta,
      reading_time: readingTime,
    },
    japanese_meta: {
      industry: (post.meta?.industry_tags?.[0] as any) || "製造業",
      technology: (post.meta?.tech_tags?.[0] as any) || "クラウド",
      region: (post.meta?.region_tags?.[0] as any) || "宮崎市",
      category: (post.meta?.subcategory?.split("-")[0] as any) || "dx",
      subcategory: post.meta?.subcategory,
    },
  };
}

// カテゴリーIDからスラッグを取得
export function getCategorySlug(
  categoryId: number,
  categories: Category[],
): string {
  const category = categories.find((cat) => cat.id === categoryId);
  return category?.slug || "other";
}

// 日本語カテゴリー名を取得
export function getJapaneseCategoryName(slug: string): string {
  const categoryConfig = CATEGORIES[slug as keyof typeof CATEGORIES];
  return categoryConfig?.name || slug;
}

// 記事の抜粋を生成（日本語対応）
export function generateExcerpt(
  content: string,
  maxLength: number = 120,
): string {
  const plainText = stripHtml(content);
  if (plainText.length <= maxLength) {
    return plainText;
  }

  // 日本語の場合は文字数、英語の場合は単語で区切る
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const lastJapaneseChar = truncated.match(
    /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF](?=[\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]*$)/,
  );

  if (lastJapaneseChar) {
    return truncated + "...";
  } else if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + "...";
  } else {
    return truncated + "...";
  }
}

// URLスラッグを生成（日本語対応）
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "") // 日本語文字を削除
    .replace(/[^a-z0-9\s-]/g, "") // 英数字とスペース、ハイフン以外を削除
    .trim()
    .replace(/\s+/g, "-") // スペースをハイフンに変換
    .replace(/-+/g, "-") // 連続するハイフンを1つに
    .replace(/^-|-$/g, ""); // 先頭と末尾のハイフンを削除
}

// 画像URLを取得
export function getFeaturedImageUrl(
  post: Post,
  size: string = "medium_large",
): string | null {
  if (post._embedded?.["wp:featuredmedia"]?.[0]) {
    const media = post._embedded["wp:featuredmedia"][0];
    return media.media_details?.sizes?.[size]?.source_url || media.source_url;
  }
  return null;
}

// 著者情報を取得
export function getAuthorInfo(
  post: Post,
): { name: string; avatar?: string } | null {
  if (post._embedded?.author?.[0]) {
    const author = post._embedded.author[0];
    return {
      name: author.name,
      avatar: author.avatar_urls?.["96"] || author.avatar_urls?.["48"],
    };
  }
  return null;
}

// 関連記事を取得
export async function getRelatedPosts(
  post: Post,
  limit: number = 3,
): Promise<Post[]> {
  try {
    // 同じカテゴリーの記事を取得（現在の記事を除く）
    const relatedPosts = await wordpressAPI.getPosts({
      categories: post.categories,
      per_page: limit + 1,
      orderby: "date",
      order: "desc",
    });

    return relatedPosts.filter((p) => p.id !== post.id).slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch related posts:", error);
    return [];
  }
}

// 記事の公開日をフォーマット
export function formatPublishDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 記事の更新日をフォーマット
export function formatModifiedDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) {
    return "今日更新";
  } else if (diffInDays === 1) {
    return "昨日更新";
  } else if (diffInDays < 7) {
    return `${diffInDays}日前更新`;
  } else {
    return formatPublishDate(dateString);
  }
}
