import type { Article } from "@/lib/types";

/**
 * 画像のalt属性を取得する
 * typoを修正: covert_alt → cover_alt
 */
export function getImageAlt(article: Article): string {
  // 注意: スキーマのtypoを考慮してcovert_altもチェック
  return article.data.cover_alt || article.data.covert_alt || article.data.title;
}

/**
 * ランキングバッジの色を取得する
 */
export function getRankBadgeColor(rank: number): string {
  switch(rank) {
    case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    case 3: return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
    default: return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
  }
}

/**
 * 記事のURLを生成する
 */
export function getArticleUrl(articleId: string): string {
  return `/articles/${articleId}`;
}

/**
 * 日付の範囲をフォーマットする
 */
export function formatWeekDateRange(weeksBack: number = 0): { start: string; end: string } {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - (weeksBack * 7));
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return {
    start: startDate.toLocaleDateString('ja-JP'),
    end: endDate.toLocaleDateString('ja-JP')
  };
}