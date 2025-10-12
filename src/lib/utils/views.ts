import viewsData from '../data/article-views.json';

export interface ViewsData {
  lastUpdated: string;
  views: Record<string, number>;
  totalViews: Record<string, number>;
}

// ビュー数データを取得
export function getViewsData(): ViewsData {
  return viewsData as ViewsData;
}

// 特定の記事のビュー数を取得
export function getArticleViews(articleId: string): number {
  try {
    const data = getViewsData();
    return data.views[articleId] || 0;
  } catch (error) {
    // データファイルが存在しない場合はランダム値を返す（開発時用）
    return Math.floor(Math.random() * 1000) + 100;
  }
}

// 全記事のビュー数順でソート
export function sortArticlesByViews<T extends { id: string }>(articles: T[]): T[] {
  return articles.sort((a, b) => {
    const viewsA = getArticleViews(a.id);
    const viewsB = getArticleViews(b.id);
    return viewsB - viewsA;
  });
}

// ビュー数データの最終更新日時を取得
export function getLastUpdated(): string | null {
  try {
    const data = getViewsData();
    return data.lastUpdated;
  } catch (error) {
    return null;
  }
}