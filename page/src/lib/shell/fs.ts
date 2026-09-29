import { keyboardHref, links, site } from '../../data/site';
import type { Locale, Post } from '../../data/site';
import { markdownToLines } from './markdown';
import { segmentsOf } from './path';
import type { FsNode } from './types';

const T = {
  es: {
    cv: 'cv: enlace a /cv (no es un fichero de texto). Usa "open cv" para abrirlo.',
    keyboard: 'teclado: enlace al visualizador del teclado de 34 teclas. Usa "open teclado" para abrirlo.',
    now: 'ahora.txt',
    contact: 'contacto.md',
  },
  en: {
    cv: 'cv: link to /cv (not a text file). Use "open cv" to open it.',
    keyboard: 'teclado: link to the 34-key keyboard visualizer. Use "open teclado" to open it.',
    now: 'now.txt',
    contact: 'contact.md',
  },
} as const;

export const contactFile = (locale: Locale) => T[locale].contact;

const postFile = (post: Post): FsNode => ({
  kind: 'file',
  lines: [`# ${post.title}`, post.date.slice(0, 10), '', ...markdownToLines(post.body)],
  date: post.date.slice(0, 10),
  slug: post.slug,
  buffer: { tab: 'blog', slug: post.slug },
});

// Home directory built from the site content. The root node is `~`.
export const buildFs = (locale: Locale, posts: Post[]): FsNode => {
  const copy = site[locale];
  const t = T[locale];
  const blog: Record<string, FsNode> = {};
  for (const p of posts) blog[`${p.slug}.md`] = postFile(p);

  return {
    kind: 'dir',
    children: {
      [copy.aboutFile]: {
        kind: 'file',
        lines: [`# ${copy.aboutTitle}`, '', ...copy.about.flatMap((p) => [p, '']).slice(0, -1)],
        buffer: { tab: 'about' },
      },
      [t.now]: {
        kind: 'file',
        lines: [`# ${copy.nowTitle}`, ...copy.now.map((n) => `- ${n}`)],
        buffer: { tab: 'about' },
      },
      [t.contact]: {
        kind: 'file',
        lines: [
          `# ${copy.contactTitle}`,
          copy.contactText,
          '',
          ...links.map((l) => `${l.label.padEnd(9)}${l.href.replace('mailto:', '')}`),
        ],
        buffer: { tab: 'contact' },
        // Tappable contact lines (they start after title, text and a blank line).
        runs: Object.fromEntries(links.map((l, i) => [3 + i, `open ${l.label.toLowerCase()}`])),
      },
      blog: { kind: 'dir', children: blog },
      cv: { kind: 'link', href: '/cv', note: t.cv },
      teclado: { kind: 'link', href: keyboardHref, note: t.keyboard },
    },
  };
};

export const lookup = (root: FsNode, path: string): FsNode | undefined => {
  let node: FsNode | undefined = root;
  for (const seg of segmentsOf(path)) {
    if (!node || node.kind !== 'dir') return undefined;
    node = node.children[seg];
  }
  return node;
};
