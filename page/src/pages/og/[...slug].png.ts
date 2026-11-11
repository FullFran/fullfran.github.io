import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { name, site } from '../../data/site';
import { renderCard, type Card } from '../../lib/og/card';

// One share image for the home, one for the archive and one per published post.
export const getStaticPaths = (async () => {
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft);
  const cards: { slug: string; card: Card }[] = [
    { slug: 'home', card: { kind: 'home', name, tagline: site.es.tagline } },
    { slug: 'blog', card: { kind: 'archive', title: site.es.writingTitle, intro: site.es.writingIntro } },
    ...posts.map((post) => ({
      slug: `blog/${post.id}`,
      card: { kind: 'post', slug: post.id, title: post.data.title, date: post.data.date.toISOString() } as Card,
    })),
  ];
  return cards.map(({ slug, card }) => ({ params: { slug }, props: { card } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await sharp(Buffer.from(renderCard(props.card as Card)))
    .png({ compressionLevel: 9 })
    .toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
