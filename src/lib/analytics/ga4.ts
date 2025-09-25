// Google Analytics Data API (GA4) 連携
import { BetaAnalyticsDataClient } from '@google-analytics/data';

interface PageViewData {
  path: string;
  pageViews: number;
  uniquePageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  engagement: number; // 滞在時間 + 離脱率から算出
}

interface PopularityMetrics {
  articleId: string;
  pageViews: number;
  uniqueViews: number;
  averageTime: number;
  bounceRate: number;
  popularityScore: number;
  trending: boolean; // 急上昇中かどうか
}

export class GoogleAnalyticsService {
  private analyticsClient: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor() {
    // 環境変数から設定を読み込み
    this.propertyId = process.env.GA4_PROPERTY_ID || '';
    
    this.analyticsClient = new BetaAnalyticsDataClient({
      keyFilename: process.env.GA4_SERVICE_ACCOUNT_KEY_FILE,
      // または環境変数から直接認証情報を読み込み
      credentials: process.env.GA4_CREDENTIALS ? JSON.parse(process.env.GA4_CREDENTIALS) : undefined
    });
  }

  /**
   * 過去30日間の記事別ページビューを取得
   */
  async getArticlePageViews(days: number = 30): Promise<PageViewData[]> {
    try {
      const [response] = await this.analyticsClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: `${days}daysAgo`,
            endDate: 'today',
          },
        ],
        dimensions: [
          { name: 'pagePath' },
          { name: 'pageTitle' },
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'engagementRate' },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'CONTAINS',
              value: '/articles/',
            },
          },
        },
        orderBys: [
          {
            metric: {
              metricName: 'screenPageViews',
            },
            desc: true,
          },
        ],
        limit: 50,
      });

      return response.rows?.map(row => {
        const path = row.dimensionValues?.[0]?.value || '';
        const pageViews = parseInt(row.metricValues?.[0]?.value || '0');
        const sessions = parseInt(row.metricValues?.[1]?.value || '0');
        const avgDuration = parseFloat(row.metricValues?.[2]?.value || '0');
        const bounceRate = parseFloat(row.metricValues?.[3]?.value || '0');
        const engagementRate = parseFloat(row.metricValues?.[4]?.value || '0');

        return {
          path,
          pageViews,
          uniquePageViews: sessions,
          averageSessionDuration: avgDuration,
          bounceRate,
          engagement: engagementRate,
        };
      }) || [];
    } catch (error) {
      console.error('GA4 API Error:', error);
      return [];
    }
  }

  /**
   * リアルタイム（過去30分）のページビューを取得
   */
  async getRealTimePageViews(): Promise<PageViewData[]> {
    try {
      const [response] = await this.analyticsClient.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        dimensions: [
          { name: 'unifiedPagePathScreen' },
        ],
        metrics: [
          { name: 'activeUsers' },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'unifiedPagePathScreen',
            stringFilter: {
              matchType: 'CONTAINS',
              value: '/articles/',
            },
          },
        },
        orderBys: [
          {
            metric: {
              metricName: 'activeUsers',
            },
            desc: true,
          },
        ],
        limit: 20,
      });

      return response.rows?.map(row => {
        const path = row.dimensionValues?.[0]?.value || '';
        const activeUsers = parseInt(row.metricValues?.[0]?.value || '0');

        return {
          path,
          pageViews: activeUsers * 10, // リアルタイムユーザーから推定PV
          uniquePageViews: activeUsers,
          averageSessionDuration: 0,
          bounceRate: 0,
          engagement: activeUsers,
        };
      }) || [];
    } catch (error) {
      console.error('GA4 Realtime API Error:', error);
      return [];
    }
  }

  /**
   * 記事IDからページパスを生成
   */
  private getArticlePathFromId(articleId: string): string {
    return `/articles/${articleId}`;
  }

  /**
   * ページパスから記事IDを抽出
   */
  private getArticleIdFromPath(path: string): string | null {
    const match = path.match(/\/articles\/([^/?]+)/);
    return match ? match[1] : null;
  }

  /**
   * 人気度スコアを計算
   * PV数、滞在時間、エンゲージメント率を総合的に評価
   */
  private calculatePopularityScore(data: PageViewData): number {
    const { pageViews, averageSessionDuration, engagement, bounceRate } = data;
    
    // 基本スコア（PV数）
    const baseScore = pageViews;
    
    // 品質ボーナス（滞在時間とエンゲージメント率）
    const qualityBonus = averageSessionDuration * 0.1 + engagement * 10;
    
    // ペナルティ（離脱率）
    const penalty = bounceRate * pageViews * 0.1;
    
    return Math.max(0, baseScore + qualityBonus - penalty);
  }

  /**
   * 記事の人気度指標を取得
   */
  async getArticlePopularityMetrics(articleIds: string[]): Promise<PopularityMetrics[]> {
    const [historicalData, realtimeData] = await Promise.all([
      this.getArticlePageViews(30),
      this.getRealTimePageViews(),
    ]);

    // 記事IDごとのデータをまとめる
    const metricsMap = new Map<string, PopularityMetrics>();

    // 過去30日のデータを処理
    historicalData.forEach(data => {
      const articleId = this.getArticleIdFromPath(data.path);
      if (articleId && articleIds.includes(articleId)) {
        metricsMap.set(articleId, {
          articleId,
          pageViews: data.pageViews,
          uniqueViews: data.uniquePageViews,
          averageTime: data.averageSessionDuration,
          bounceRate: data.bounceRate,
          popularityScore: this.calculatePopularityScore(data),
          trending: false,
        });
      }
    });

    // リアルタイムデータでトレンド判定
    realtimeData.forEach(data => {
      const articleId = this.getArticleIdFromPath(data.path);
      if (articleId && articleIds.includes(articleId)) {
        const existing = metricsMap.get(articleId);
        if (existing) {
          // リアルタイムアクティブユーザーが多い場合はトレンド記事
          existing.trending = data.engagement > 5;
          // トレンド記事にはボーナススコア
          if (existing.trending) {
            existing.popularityScore += data.engagement * 20;
          }
        }
      }
    });

    return Array.from(metricsMap.values())
      .sort((a, b) => b.popularityScore - a.popularityScore);
  }

  /**
   * 急上昇記事を検出
   * 過去24時間 vs 過去7日の比較
   */
  async getTrendingArticles(): Promise<string[]> {
    try {
      const [todayData, weekData] = await Promise.all([
        this.getArticlePageViews(1),
        this.getArticlePageViews(7),
      ]);

      const trendingArticles: { id: string; trendScore: number }[] = [];

      todayData.forEach(today => {
        const articleId = this.getArticleIdFromPath(today.path);
        if (!articleId) return;

        const weekAvg = weekData.find(week => week.path === today.path);
        if (weekAvg) {
          const dailyAvg = weekAvg.pageViews / 7;
          const trendScore = today.pageViews / Math.max(dailyAvg, 1);
          
          // 2倍以上のPVがあれば急上昇とみなす
          if (trendScore > 2) {
            trendingArticles.push({ id: articleId, trendScore });
          }
        }
      });

      return trendingArticles
        .sort((a, b) => b.trendScore - a.trendScore)
        .slice(0, 10)
        .map(item => item.id);
    } catch (error) {
      console.error('Trending analysis error:', error);
      return [];
    }
  }
}

export default GoogleAnalyticsService;