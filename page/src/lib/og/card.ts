import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { create, type Font } from 'fontkitten';

/**
 * Share cards (Open Graph / Twitter) drawn as SVG and rasterized at build time.
 *
 * Every piece of text is converted to glyph outlines, so the PNG does not
 * depend on which fonts the machine running the build happens to have: it
 * comes out the same on a laptop and on the CI runner.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export type Card =
  | { kind: 'home'; name: string; tagline: string }
  | { kind: 'archive'; title: string; intro: string }
  | { kind: 'post'; slug: string; title: string; date: string };

/** Public path of the share image of each page. */
export const ogImage = {
  home: '/og/home.png',
  archive: '/og/blog.png',
  post: (slug: string) => `/og/blog/${slug}.png`,
};

const FONT_DIR = join(process.cwd(), 'src/assets/og-fonts');
const fonts: Record<'sans' | 'mono', Font | undefined> = { sans: undefined, mono: undefined };
const font = (which: 'sans' | 'mono'): Font =>
  (fonts[which] ??= create(
    readFileSync(join(FONT_DIR, which === 'sans' ? 'FiraSans-Bold.otf' : 'FiraMono-Regular.otf')),
  ) as Font);

const C = {
  bg: '#0a0a0f',
  window: '#1a1b26',
  border: '#2f3549',
  bar: '#16161e',
  text: '#c0caf5',
  white: '#ffffff',
  muted: '#828bb8',
  blue: '#7aa2f7',
  cyan: '#7dcfff',
  green: '#9ece6a',
  red: '#f7768e',
  yellow: '#e0af68',
};

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Width in pixels of `text` set in `which` at `size` px. */
export const measure = (text: string, which: 'sans' | 'mono', size: number): number => {
  const f = font(which);
  const units = f.glyphsForString(text).reduce((sum, g) => sum + g.advanceWidth, 0);
  return (units * size) / f.unitsPerEm;
};

/** One run of text as a single SVG path, with its baseline at (x, y). */
const textPath = (text: string, which: 'sans' | 'mono', size: number, x: number, y: number, fill: string) => {
  const f = font(which);
  const scale = size / f.unitsPerEm;
  let pen = 0;
  let d = '';
  for (const glyph of f.glyphsForString(text)) {
    d += glyph.path.translate(pen, 0).toSVG();
    pen += glyph.advanceWidth;
  }
  const r = (n: number) => Math.round(n * 100) / 100;
  return `<path fill="${fill}" transform="translate(${r(x)} ${r(y)}) scale(${r(scale * 1e4) / 1e4} ${-r(scale * 1e4) / 1e4})" d="${d}"/>`;
};

/** Greedy word wrap. Returns null when a single word is wider than the box. */
export const wrap = (text: string, which: 'sans' | 'mono', size: number, maxWidth: number): string[] | null => {
  const lines: string[] = [];
  let line = '';
  for (const word of text.trim().split(/\s+/)) {
    if (measure(word, which, size) > maxWidth) return null;
    const candidate = line ? `${line} ${word}` : word;
    if (line && measure(candidate, which, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
};

/**
 * Biggest size at which `text` fits in the box. If even the smallest size
 * overflows, the last line is cut with an ellipsis rather than spilling out.
 */
export const fitText = (
  text: string,
  which: 'sans' | 'mono',
  sizes: number[],
  maxWidth: number,
  maxHeight: number,
  lineHeight: number,
): { size: number; lines: string[] } => {
  for (const size of sizes) {
    const lines = wrap(text, which, size, maxWidth);
    if (lines && lines.length * size * lineHeight <= maxHeight) return { size, lines };
  }
  const size = sizes[sizes.length - 1];
  const maxLines = Math.max(1, Math.floor(maxHeight / (size * lineHeight)));
  // Words wider than the box are cut into pieces that fit, so nothing overflows sideways.
  const pieces = text
    .trim()
    .split(/\s+/)
    .flatMap((word) => {
      if (measure(word, which, size) <= maxWidth) return [word];
      const out: string[] = [];
      let piece = '';
      for (const ch of word) {
        if (piece && measure(piece + ch, which, size) > maxWidth) {
          out.push(piece);
          piece = ch;
        } else piece += ch;
      }
      return piece ? [...out, piece] : out;
    });
  const lines = wrap(pieces.join(' '), which, size, maxWidth) ?? pieces;
  if (lines.length <= maxLines) return { size, lines };
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last.length > 0 && measure(`${last}…`, which, size) > maxWidth) last = last.slice(0, -1).trimEnd();
  kept[maxLines - 1] = `${last}…`;
  return { size, lines: kept };
};

/** Inner markup of the site logo (public/favicon.svg), drawn on a 64x64 grid. */
const logo = (() => {
  let cached: string | undefined;
  return () =>
    (cached ??= readFileSync(join(process.cwd(), 'public/favicon.svg'), 'utf8')
      .replace(/^[\s\S]*?<svg[^>]*>/, '')
      .replace(/<\/svg>[\s\S]*$/, '')
      .trim());
})();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// Terminal window geometry.
const WIN = { x: 56, y: 56, w: OG_WIDTH - 112, h: OG_HEIGHT - 112, bar: 52 };
const PAD = 64;
const CONTENT_X = WIN.x + PAD;
const CONTENT_W = WIN.w - PAD * 2;

const frame = (windowTitle: string, body: string, footerRight: string) => {
  const footerY = WIN.y + WIN.h - 48;
  const dots = [C.red, C.yellow, C.green]
    .map((fill, i) => `<circle cx="${WIN.x + 30 + i * 24}" cy="${WIN.y + WIN.bar / 2}" r="7" fill="${fill}"/>`)
    .join('');
  const titleW = measure(windowTitle, 'mono', 20);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
<defs>
<radialGradient id="glowA" cx="0.15" cy="0.1" r="0.7"><stop offset="0" stop-color="${C.blue}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.blue}" stop-opacity="0"/></radialGradient>
<radialGradient id="glowB" cx="0.95" cy="1" r="0.6"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0.16"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${C.blue}" stroke-opacity="0.06" stroke-width="1"/></pattern>
<clipPath id="win"><rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" rx="18"/></clipPath>
</defs>
<rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="${C.bg}"/>
<rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#grid)"/>
<rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#glowA)"/>
<rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#glowB)"/>
<g clip-path="url(#win)">
<rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" fill="${C.window}" fill-opacity="0.94"/>
<rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.bar}" fill="${C.bar}"/>
<rect x="${WIN.x}" y="${WIN.y + WIN.bar}" width="${WIN.w}" height="1" fill="${C.border}"/>
</g>
<rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" rx="18" fill="none" stroke="${C.border}" stroke-width="2"/>
${dots}
${textPath(windowTitle, 'mono', 20, WIN.x + WIN.w / 2 - titleW / 2, WIN.y + WIN.bar / 2 + 7, C.muted)}
${body}
<g transform="translate(${CONTENT_X} ${footerY - 34}) scale(0.75)">${logo()}</g>
${textPath('fullfran.com', 'mono', 26, CONTENT_X + 64, footerY, C.blue)}
${footerRight ? textPath(footerRight, 'mono', 24, CONTENT_X + CONTENT_W - measure(footerRight, 'mono', 24), footerY, C.muted) : ''}
</svg>`;
};

const prompt = (command: string, y: number) => {
  const size = 26;
  const sign = '$ ';
  const signW = measure(sign, 'mono', size);
  return (
    textPath(sign, 'mono', size, CONTENT_X, y, C.green) +
    textPath(command, 'mono', size, CONTENT_X + signW, y, C.cyan) +
    `<rect x="${CONTENT_X + signW + measure(command, 'mono', size) + 8}" y="${y - 22}" width="14" height="28" rx="2" fill="${C.cyan}"/>`
  );
};

// Vertical band where the main text lives, between the prompt and the footer.
const TEXT_TOP = WIN.y + WIN.bar + 112;
const TEXT_BOTTOM = WIN.y + WIN.h - 100;

const stack = (lines: string[], size: number, lineHeight: number, fill: string, top: number) =>
  lines.map((line, i) => textPath(line, 'sans', size, CONTENT_X, top + size * 0.8 + i * size * lineHeight, fill)).join('');

/** Accessible description of the card, for og:image:alt. */
export const cardAlt = (card: Card): string => {
  if (card.kind === 'home') return `${card.name}. ${card.tagline} fullfran.com`;
  if (card.kind === 'archive') return `${card.title}: ${card.intro} fullfran.com`;
  return `${card.title} · ${formatDate(card.date)} · fullfran.com`;
};

export const renderCard = (card: Card): string => {
  const promptY = WIN.y + WIN.bar + 66;
  const svg = (() => {
    if (card.kind === 'home') {
      const name = fitText(card.name, 'sans', [96, 84, 72], CONTENT_W, 130, 1.1);
      const tag = fitText(card.tagline, 'sans', [44, 38, 32], CONTENT_W, 110, 1.2);
      const nameH = name.lines.length * name.size * 1.1;
      return frame(
        'fran@fullfran: ~',
        prompt('whoami', promptY) +
          stack(name.lines, name.size, 1.1, C.white, TEXT_TOP + 8) +
          stack(tag.lines, tag.size, 1.2, C.cyan, TEXT_TOP + 8 + nameH + 22),
        '',
      );
    }
    if (card.kind === 'archive') {
      const title = fitText(card.title, 'sans', [96, 84], CONTENT_W, 130, 1.1);
      const intro = fitText(card.intro, 'sans', [40, 34, 30], CONTENT_W, 110, 1.25);
      const titleH = title.lines.length * title.size * 1.1;
      return frame(
        '~/blog',
        prompt('ls ~/blog', promptY) +
          stack(title.lines, title.size, 1.1, C.white, TEXT_TOP + 8) +
          stack(intro.lines, intro.size, 1.25, C.cyan, TEXT_TOP + 8 + titleH + 22),
        '',
      );
    }
    const title = fitText(card.title, 'sans', [72, 66, 60, 54, 48, 42], CONTENT_W, TEXT_BOTTOM - TEXT_TOP, 1.14);
    const file = `${card.slug}.md`;
    const maxCmd = CONTENT_W - measure('$ cat ', 'mono', 26) - 30;
    let shown = file;
    while (measure(`cat ${shown}`, 'mono', 26) > maxCmd && shown.length > 4) shown = shown.slice(0, -1);
    const command = shown === file ? `cat ${file}` : `cat ${shown}…`;
    return frame(
      '~/blog',
      prompt(command, promptY) + stack(title.lines, title.size, 1.14, C.white, TEXT_TOP),
      formatDate(card.date),
    );
  })();
  // Text is already outlines; the escaped title in <title> only aids debugging.
  return svg.replace('<defs>', `<title>${escapeXml(cardAlt(card))}</title><defs>`);
};
