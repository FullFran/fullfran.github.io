// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

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

  integrations: [react()]
});
