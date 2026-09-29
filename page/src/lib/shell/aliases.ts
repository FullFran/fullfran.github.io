import type { Locale } from '../../data/site';
import { site } from '../../data/site';
import { contactFile } from './fs';

// Lowercase, no accents, single spaces: "Sobre mí" and "sobre mi" are the same word.
export const normalize = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');

// Path as typed from `cwd`: bare at home, anchored with ~/ elsewhere.
export const fromHome = (cwd: string, name: string): string => (cwd === '~' ? name : `~/${name}`);

type Expand = (locale: Locale, cwd: string) => string;

const about: Expand = (l, cwd) => `cat ${fromHome(cwd, site[l].aboutFile)}`;
const contact: Expand = (l, cwd) => `cat ${fromHome(cwd, contactFile(l))}`;
const blog: Expand = (_l, cwd) => `ls ${fromHome(cwd, 'blog')}`;
const constant = (cmd: string): Expand => () => cmd;

// Whole-line natural words, keyed by their normalized form.
const ALIASES: Record<string, Expand> = {
  ayuda: constant('help'),
  '?': constant('help'),
  blog,
  posts: blog,
  'sobre mi': about,
  'sobre-mi': about,
  about,
  contacto: contact,
  contact,
  cv: constant('open cv'),
  curriculum: constant('open cv'),
  resume: constant('open cv'),
  salir: constant('exit'),
  quit: constant('exit'),
  q: constant('exit'),
  ':q': constant('exit'),
  inicio: constant('home'),
  quien: constant('whoami'),
};

export const resolveAlias = (input: string, locale: Locale, cwd: string): string | undefined =>
  ALIASES[normalize(input)]?.(locale, cwd);

// Single words worth offering in Tab completion (no "?" or two-word forms).
export const ALIAS_WORDS = Object.keys(ALIASES).filter((k) => !k.includes(' ') && k !== '?');

// Optimal string alignment distance: counts a swapped pair as one edit.
export const editDistance = (a: string, b: string): number => {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
};

// Closest known word within a small edit distance (1 for very short words, else 2).
export const closest = (word: string, pool: string[]): string | undefined => {
  const w = normalize(word);
  const max = w.length <= 3 ? 1 : 2;
  let best: string | undefined;
  let bestDist = max + 1;
  for (const cand of pool) {
    const dist = editDistance(w, cand);
    // On a tie, a word the input starts with wins (an extra keystroke is the
    // usual typo: "lss" means "ls", not "less"); otherwise pool order decides.
    const extraKey = w.startsWith(cand) && !(best !== undefined && w.startsWith(best));
    if (dist < bestDist || (dist === bestDist && extraKey)) {
      best = cand;
      bestDist = dist;
    }
  }
  return best;
};
