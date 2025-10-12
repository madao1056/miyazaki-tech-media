import { BetaAnalyticsDataClient } from '@google-analytics/data';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Analytics設定
const propertyId = process.env.GA4_PROPERTY_ID; // GA4プロパティID
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GA4_KEY_FILE // サービスアカウントキーファイルのパス
});

async function getPageViews() {
  try {
    // 過去30日間のページビューを取得
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'pagePath',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
    });

    // ページパスとビュー数のマップを作成
    const pageViews = {};
    response.rows?.forEach(row => {
      const path = row.dimensionValues[0].value;
      const views = parseInt(row.metricValues[0].value);
      pageViews[path] = views;
    });

    return pageViews;
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    return {};
  }
}

async function updateArticleViews() {
  try {
    // GA4からビュー数を取得
    const pageViews = await getPageViews();
    
    // ビュー数データをJSONファイルに保存
    const viewsFilePath = path.join(__dirname, '..', 'src', 'data', 'article-views.json');
    
    // ディレクトリが存在しない場合は作成
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // 記事ごとのビュー数を整理
    const articleViews = {};
    
    // ページパスから記事IDを抽出してビュー数をマッピング
    for (const [pagePath, views] of Object.entries(pageViews)) {
      // /articles/[article-id] のパターンをマッチ
      const match = pagePath.match(/^\/articles\/([^\/]+)$/);
      if (match) {
        const articleId = match[1];
        articleViews[articleId] = views;
      }
    }
    
    // タイムスタンプを追加
    const data = {
      lastUpdated: new Date().toISOString(),
      views: articleViews,
      totalViews: pageViews
    };
    
    // JSONファイルに書き込み
    await fs.writeFile(viewsFilePath, JSON.stringify(data, null, 2));
    
    console.log('✅ Article views updated successfully');
    console.log(`📊 Updated ${Object.keys(articleViews).length} articles`);
    console.log(`📅 Last updated: ${data.lastUpdated}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error updating article views:', error);
    process.exit(1);
  }
}

// スクリプトを実行
updateArticleViews();