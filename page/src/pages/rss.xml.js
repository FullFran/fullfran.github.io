import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: 'Francisco Olmedo — Writing',
    description: 'Notes on production AI, physics, keyboards, and whatever else comes up.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      // No per-post pages yet: the writing lives in the single-page app,
      // so each item links to the site root with a slug fragment.
      link: `/#${post.id}`,
    })),
  });
}
