import { ALIAS_WORDS } from './aliases';
import { COMMANDS } from './commands';
import { lookup } from './fs';
import { parseArgs } from './parse';
import { resolvePath } from './path';
import type { FsNode } from './types';

export interface Completion {
  input: string;
  candidates: string[];
}

const commonPrefix = (words: string[]): string =>
  words.reduce((acc, w) => {
    let i = 0;
    while (i < acc.length && i < w.length && acc[i] === w[i]) i++;
    return acc.slice(0, i);
  });

// Tab completion: commands for the first word, paths (dirs only for `cd`) afterwards.
export const complete = (input: string, cwd: string, fs: FsNode): Completion => {
  const wordStart = input.search(/\S*$/);
  const head = input.slice(0, wordStart);
  const token = input.slice(wordStart);
  const first = head.trim() === '';
  const headWords = parseArgs(head);

  let dirPart = '';
  let names: { name: string; dir: boolean }[];
  if (first || (headWords.length === 1 && headWords[0] === 'man')) {
    names = [...new Set([...COMMANDS, ...ALIAS_WORDS])].map((name) => ({ name, dir: false }));
  } else {
    const slash = token.lastIndexOf('/');
    dirPart = token.slice(0, slash + 1);
    const dir = lookup(fs, resolvePath(cwd, dirPart || '.'));
    const onlyDirs = parseArgs(head)[0] === 'cd';
    names =
      dir?.kind === 'dir'
        ? Object.entries(dir.children)
            .filter(([name]) => token.slice(dirPart.length).startsWith('.') || !name.startsWith('.'))
            .filter(([, n]) => !onlyDirs || n.kind === 'dir')
            .map(([name, n]) => ({ name, dir: n.kind === 'dir' }))
        : [];
  }

  const prefix = token.slice(dirPart.length);
  const matches = names.filter((n) => n.name.startsWith(prefix)).sort((a, b) => a.name.localeCompare(b.name));
  if (matches.length === 0) return { input, candidates: [] };

  const candidates = matches.map((m) => m.name + (m.dir ? '/' : ''));
  if (matches.length === 1) {
    const only = matches[0];
    return { input: `${head}${dirPart}${candidates[0]}${only.dir ? '' : ' '}`, candidates };
  }
  return { input: `${head}${dirPart}${commonPrefix(candidates)}`, candidates };
};
