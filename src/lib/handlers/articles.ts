import { getCollection } from "astro:content";
import GoogleAnalyticsService from "@/lib/analytics/ga4";
import type { Article, ArticleWithMetrics } from "@/lib/types";

const articlesCollection: Article[] = (
  await getCollection("articles", ({ data }) => {
    return data.isDraft !== true && new Date(data.publishedTime) < new Date();
  })
).sort(
  (a, b) =>
    new Date(b.data.publishedTime).getTime() -
    new Date(a.data.publishedTime).getTime(),
);

/**
 * 日付から経過日数を計算
 */
function getDaysSincePublish(publishedTime: string): number {
  return Math.floor(
    (new Date().getTime() - new Date(publishedTime).getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

/**
 * フォールバック用の人気度スコア計算
 */
function calculateFallbackScore(article: Article, index: number): number {
  const daysSincePublish = getDaysSincePublish(article.data.publishedTime);
  const recencyScore =
    daysSincePublish <= 14
      ? 100 - daysSincePublish * 3
      : 50 - daysSincePublish * 0.5;
  const positionScore = Math.max(0, 100 - index * 2);
  return Math.max(0, recencyScore + positionScore);
}

/**
 * 記事にメトリクスを追加してArticleWithMetrics型に変換
 */
function addMetrics(
  article: Article,
  metrics?: {
    popularityScore: number;
    pageViews: number;
    trending: boolean;
    realTimeData: boolean;
  },
): ArticleWithMetrics {
  return {
    ...article,
    popularityScore: metrics?.popularityScore ?? 0,
    pageViews: metrics?.pageViews ?? 0,
    trending: metrics?.trending ?? false,
    realTimeData: metrics?.realTimeData ?? false,
  };
}

export const articlesHandler = {
  allArticles: (): Article[] => articlesCollection,

  // Google Analytics APIを使用してリアルタイム人気記事を取得
  getTopArticles: async (): Promise<ArticleWithMetrics[]> => {
    try {
      // Google Analytics APIが利用可能な場合
      if (process.env.GA4_PROPERTY_ID && process.env.GA4_CREDENTIALS) {
        const analyticsService = new GoogleAnalyticsService();
        const articleIds = articlesCollection.map((article) => article.id);

        // GA4から実際の人気度データを取得
        const popularityMetrics =
          await analyticsService.getArticlePopularityMetrics(articleIds);

        // Analytics データと記事データをマッピング
        const scoredArticles = articlesCollection.map((article, index) => {
          const metrics = popularityMetrics.find(
            (m) => m.articleId === article.id,
          );

          if (metrics) {
            return addMetrics(article, {
              popularityScore: metrics.popularityScore,
              pageViews: metrics.pageViews,
              trending: metrics.trending,
              realTimeData: true,
            });
          } else {
            // Analytics データがない場合のフォールバック
            const fallbackScore = calculateFallbackScore(article, index);
            return addMetrics(article, {
              popularityScore: fallbackScore,
              pageViews: 0,
              trending: false,
              realTimeData: false,
            });
          }
        });

        return scoredArticles
          .sort((a, b) => {
            // トレンド記事を最優先
            if (a.trending && !b.trending) return -1;
            if (!a.trending && b.trending) return 1;
            // 人気度スコア順
            return b.popularityScore - a.popularityScore;
          })
          .slice(0, 5);
      }
    } catch (error) {
      console.error(
        "Analytics API error, falling back to default sorting:",
        error,
      );
    }

    // フォールバック: Analytics APIが利用できない場合
    return articlesHandler.getTopArticlesFallback();
  },

  // フォールバック用の従来の方法
  getTopArticlesFallback: (): ArticleWithMetrics[] => {
    const scoredArticles = articlesCollection.map((article, index) => {
      const totalScore = calculateFallbackScore(article, index);
      return addMetrics(article, {
        popularityScore: totalScore,
        pageViews: 0,
        trending: false,
        realTimeData: false,
      });
    });

    return scoredArticles
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 5);
  },

  mainHeadline: async (): Promise<Article> => {
    // 手動設定がある場合は優先、なければ自動選出
    const manualHeadline = articlesCollection.filter(
      (article) => article.data.isMainHeadline === true,
    )[0];

    if (manualHeadline) return manualHeadline;

    // 自動選出の場合は人気記事の1位
    const topArticles = await articlesHandler.getTopArticles();
    return topArticles[0];
  },

  subHeadlines: async (): Promise<Article[]> => {
    const mainHeadline = await articlesHandler.mainHeadline();

    // 手動設定がある場合は優先
    const manualSubHeadlines = articlesCollection
      .filter(
        (article) =>
          article.data.isSubHeadline === true && mainHeadline.id !== article.id,
      )
      .slice(0, 4);

    if (manualSubHeadlines.length >= 4) {
      return manualSubHeadlines;
    }

    // 自動選出の場合は人気記事の2-5位
    const topArticles = await articlesHandler.getTopArticles();
    const subHeadlines = topArticles
      .filter((article) => article.id !== mainHeadline.id)
      .slice(0, 4);

    if (subHeadlines.length === 0) {
      // フォールバック：最新記事4件
      return articlesCollection
        .filter((article) => article.id !== mainHeadline.id)
        .slice(0, 4);
    }

    return subHeadlines;
  },
};
