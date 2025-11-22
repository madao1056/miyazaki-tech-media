import type { Article } from "@/lib/types";

/**
 * 画像のalt属性を取得する
 * typoを修正: covert_alt → cover_alt
 */
export function getImageAlt(article: Article): string {
  // 注意: スキーマのtypoを考慮してcovert_altもチェック
  return (
    article.data.cover_alt || article.data.covert_alt || article.data.title
  );
}

/**
 * ランキングバッジの色を取得する
 */
export function getRankBadgeColor(rank: number): string {
  switch (rank) {
    case 1:
      return "border-r-yellow-500 border-t-yellow-500";
    case 2:
      return "border-r-gray-500 border-t-gray-500";
    case 3:
      return "border-r-orange-500 border-t-orange-500";
    default:
      return "border-r-blue-500 border-t-blue-500";
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
export function formatWeekDateRange(weeksBack: number = 0): {
  start: string;
  end: string;
} {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - weeksBack * 7);
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    start: startDate.toLocaleDateString("ja-JP"),
    end: endDate.toLocaleDateString("ja-JP"),
  };
}
