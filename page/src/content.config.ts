import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['es', 'en']).default('es'),
    description: z.string().optional(),
    // Kept out of the site until it is ready: no page, no listing, no feed.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
