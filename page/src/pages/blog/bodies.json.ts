import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Markdown of every published post, keyed by slug. The home page does not ship
 * it inline; the in-page terminal fetches it when it needs to `cat` or open a post.
 */
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft);
  const bodies = Object.fromEntries(posts.map((post) => [post.id, post.body ?? '']));
  return new Response(JSON.stringify(bodies), { headers: { 'Content-Type': 'application/json' } });
};
