import type { APIRoute } from 'astro';
import { authorsHandler } from '@/lib/handlers/authors';

export const GET: APIRoute = async () => {
  const authors = authorsHandler.allAuthors();
  
  return new Response(JSON.stringify(authors), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};