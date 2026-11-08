// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Publication date of every live post, so the sitemap tells crawlers what is new.
const postDates = new Map();
for (const file of readdirSync('./src/content/blog')) {
  if (!file.endsWith('.md')) continue;
  const front = readFileSync(`./src/content/blog/${file}`, 'utf8').split('---')[1] ?? '';
  const date = front.match(/^date:\s*(\S+)/m)?.[1];
  if (date && !/^draft:\s*true/m.test(front)) postDates.set(`/blog/${file.replace(/\.md$/, '')}/`, new Date(date));
}
const newestPost = new Date(Math.max(...[...postDates.values()].map((d) => d.valueOf())));

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * Anything that scrolls sideways has to be reachable from the keyboard, and a
 * wide table has to scroll inside its own box rather than push the page out.
 */
function rehypeScrollables() {
  /** @param {any} node */
  const walk = (node) => {
    if (!Array.isArray(node.children)) return;
    node.children = node.children.map((/** @type {any} */ child) => {
      walk(child);
      if (child.type !== 'element') return child;
      if (child.tagName === 'pre') {
        child.properties = { ...child.properties, tabindex: '0' };
        return child;
      }
      if (child.tagName === 'table') {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'], tabindex: '0' },
          children: [child],
        };
      }
      return child;
    });
  };
  return (/** @type {any} */ tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.fullfran.com',

  markdown: {
    // $inline$ and $$display$$ in posts, rendered to HTML at build time.
    // No client-side math library ships to the reader.
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeScrollables],
    shikiConfig: {
      theme: 'tokyo-night',
      wrap: false,
    },
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        const date = postDates.get(path) ?? (path === '/' || path === '/blog/' ? newestPost : undefined);
        return date ? { ...item, lastmod: date.toISOString() } : item;
      },
    }),
  ]
});
