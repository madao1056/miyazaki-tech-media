import type { APIRoute } from 'astro';
import { articlesHandler } from '@/lib/handlers/articles';

export const GET: APIRoute = async () => {
  const articles = articlesHandler.allArticles();
  
  return new Response(JSON.stringify(articles), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};