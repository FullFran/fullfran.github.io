import { links, name, site } from '../../data/site';
import type { Locale } from '../../data/site';
import { ALIAS_WORDS, closest, fromHome, resolveAlias } from './aliases';
import { HELP, MAN, MAN_ALIASES, MAN_HEADINGS } from './docs';
import { contactFile, lookup } from './fs';
import { parseArgs } from './parse';
import { displayPath, resolvePath } from './path';
import type { Effect, FsNode, Line, Result, ShellContext, Span, Style } from './types';

export type { ShellContext } from './types';

export const COMMANDS = [
  'cat', 'cd', 'clear', 'code', 'date', 'echo', 'emacs', 'exit', 'grep', 'head', 'help', 'history', 'home',
  'less', 'll', 'ls', 'man', 'more', 'nano', 'neofetch', 'notepad', 'nvim', 'open', 'pwd', 'sudo', 'tail',
  'tree', 'vi', 'vim', 'vscode', 'whoami',
];

// --- COPY ---
const HINT = {
  es: { back: 'volver al blog', web: 'abrir en la web', tapPost: 'toca un post para leerlo', tryLs: 'prueba ' },
  en: { back: 'back to the blog', web: 'open on the web', tapPost: 'tap a post to read it', tryLs: 'try ' },
} as const;

const MSG = {
  es: {
    notFound: (c: string) => `${c}: orden no encontrada`,
    missing: (c: string, what: string) => `${c}: falta ${what}`,
    file: 'un fichero',
    pattern: 'el patrón',
    noEntry: (c: string, p: string) => `${c}: ${p}: no existe el fichero o directorio`,
    lsNoEntry: (p: string) => `ls: no se puede acceder a '${p}': no existe el fichero o directorio`,
    isDir: (c: string, p: string) => `${c}: ${p}: es un directorio`,
    notDir: (c: string, p: string) => `${c}: ${p}: no es un directorio`,
    isLink: (c: string, p: string) => `${c}: ${p} es un enlace, usa "open ${p}"`,
    sudo: `sudo: ${'fran'} no aparece en el fichero sudoers. Se avisará a Fran (soy yo).`,
    os: 'SO',
    keyboard: 'Teclado',
    keyboardValue: 'partido de 34 teclas',
    lang: 'Idioma',
    dateLocale: 'es-ES',
    welcome: '¿No sabes por dónde empezar? Toca un botón de abajo o escribe ayuda.',
    placeholder: 'escribe un comando, por ejemplo: blog',
    didYouMean: '¿Quisiste decir ',
    manWhich: '¿Qué página del manual quieres? Prueba man ls',
    manNone: (c: string) => `No hay entrada del manual para ${c}`,
    dir: 'directorio',
    dirs: 'directorios',
    file1: 'fichero',
    files: 'ficheros',
    tryHelp: 'Prueba ',
    helpWord: 'ayuda',
  },
  en: {
    notFound: (c: string) => `${c}: command not found`,
    missing: (c: string, what: string) => `${c}: missing ${what}`,
    file: 'file operand',
    pattern: 'pattern',
    noEntry: (c: string, p: string) => `${c}: ${p}: No such file or directory`,
    lsNoEntry: (p: string) => `ls: cannot access '${p}': No such file or directory`,
    isDir: (c: string, p: string) => `${c}: ${p}: Is a directory`,
    notDir: (c: string, p: string) => `${c}: ${p}: Not a directory`,
    isLink: (c: string, p: string) => `${c}: ${p} is a link, use "open ${p}"`,
    sudo: 'sudo: fran is not in the sudoers file. This incident will be reported (to Fran, that is me).',
    os: 'OS',
    keyboard: 'Keyboard',
    keyboardValue: '34-key split',
    lang: 'Lang',
    dateLocale: 'en-GB',
    welcome: 'Not sure where to start? Tap a button below or type help.',
    placeholder: 'type a command, e.g. blog',
    didYouMean: 'Did you mean ',
    manWhich: 'Which manual page do you want? Try man ls',
    manNone: (c: string) => `No manual entry for ${c}`,
    dir: 'directory',
    dirs: 'directories',
    file1: 'file',
    files: 'files',
    tryHelp: 'Try ',
    helpWord: 'help',
  },
} as const;

export const welcomeHint = (locale: Locale) => MSG[locale].welcome;
export const placeholder = (locale: Locale) => MSG[locale].placeholder;

const QUICK_LABELS: Record<Locale, string[]> = {
  es: ['Sobre mí', 'Blog', 'Contacto', 'CV', 'Ayuda', 'Salir'],
  en: ['About', 'Blog', 'Contact', 'CV', 'Help', 'Exit'],
};

// Labelled buttons: each one types and runs a real command, so the echoed prompt teaches it.
export const quickActions = (locale: Locale, cwd = '~'): { label: string; command: string }[] => {
  const commands = [
    `cat ${fromHome(cwd, site[locale].aboutFile)}`,
    `ls ${fromHome(cwd, 'blog')}`,
    `cat ${fromHome(cwd, contactFile(locale))}`,
    'open cv',
    'help',
    'exit',
  ];
  return QUICK_LABELS[locale].map((label, i) => ({ label, command: commands[i] }));
};

// --- HELPERS ---
const line = (text: string, style?: Style, run?: string): Line => [{ text, style, run }];
// Muted next-step line; string parts are plain text, object parts are tappable.
const hint = (prefix: string, ...parts: (string | { text: string; run: string })[]): Line => [
  { text: prefix, style: 'muted' },
  ...parts.map((p): Span => (typeof p === 'string' ? { text: p, style: 'muted' } : { text: p.text, style: 'muted', run: p.run })),
];
const err = (text: string): Result => ({ lines: [line(text, 'error')], effects: [] });
const out = (lines: Line[], effects: Effect[] = []): Result => ({ lines, effects });

export const textOf = (r: Result): string => r.lines.map((l) => l.map((s) => s.text).join('')).join('\n');

// Light markdown styling for file contents.
const styleLine = (text: string): Line => {
  if (text.startsWith('# ')) return line(text, 'heading');
  if (text.startsWith('## ')) return line(text, 'accent');
  if (text.startsWith('$ ')) return line(text, 'ok');
  return line(text);
};

const partitionArgs = (args: string[]) => ({
  flags: args.filter((a) => a.length > 1 && a.startsWith('-')),
  rest: args.filter((a) => !(a.length > 1 && a.startsWith('-'))),
});

const fileSize = (node: FsNode) => (node.kind === 'file' ? node.lines.join('\n').length : 0);

// Path relative to cwd when possible, like grep prints it.
const relativeTo = (cwd: string, path: string) => (path.startsWith(`${cwd}/`) ? path.slice(cwd.length + 1) : path);

// --- COMMANDS ---
type Handler = (args: string[], ctx: ShellContext, cmd: string) => Result;

const help: Handler = (_a, ctx) => {
  const groups = HELP[ctx.locale];
  const width = Math.max(...groups.flatMap((g) => g.items.map((i) => i.cmd.length))) + 2;
  const summaryWidth = Math.max(...groups.flatMap((g) => g.items.map((i) => i.summary.length))) + 2;
  const lines: Line[] = [];
  groups.forEach((g, gi) => {
    if (gi > 0) lines.push([{ text: '' }]);
    lines.push([{ text: g.title, style: 'heading' }]);
    for (const item of g.items) {
      const example = item.example(ctx.locale);
      lines.push([
        { text: `  ${item.cmd.padEnd(width)}`, style: 'accent' },
        { text: item.summary.padEnd(summaryWidth) },
        { text: example, style: 'link', run: example },
      ]);
    }
  });
  return out(lines);
};

const ls: Handler = (args, ctx) => {
  const postsHint = (entries: [string, FsNode][]): Line[] =>
    entries.some(([, e]) => e.kind === 'file' && e.slug) ? [hint('', HINT[ctx.locale].tapPost)] : [];
  const { flags, rest } = partitionArgs(args);
  const long = flags.some((f) => f.includes('l'));
  const all = flags.some((f) => f.includes('a'));
  const target = rest[0] ?? '.';
  const path = resolvePath(ctx.cwd, target);
  const node = lookup(ctx.fs, path);
  if (!node) return err(MSG[ctx.locale].lsNoEntry(target));

  const entries: [string, FsNode][] =
    node.kind === 'dir' ? Object.entries(node.children).filter(([n]) => all || !n.startsWith('.')) : [[target, node]];
  entries.sort(([a], [b]) => a.localeCompare(b));
  const dirPrefix = node.kind === 'dir' ? rest[0] ?? '' : '';
  const base = dirPrefix && !dirPrefix.endsWith('/') ? `${dirPrefix}/` : dirPrefix;

  const span = (n: string, e: FsNode): Span => {
    const shown = e.kind === 'dir' ? `${n}/` : n;
    const ref = `${node.kind === 'dir' ? base : ''}${n}`;
    if (e.kind === 'dir') return { text: shown, style: 'dir', run: `cd ${ref}` };
    if (e.kind === 'link') return { text: shown, style: 'link', run: `open ${ref}` };
    return { text: shown, style: 'file', run: `cat ${ref}` };
  };

  if (!long) {
    if (entries.length === 0) return out([]);
    const spans = entries.flatMap(([n, e], i) => (i === 0 ? [span(n, e)] : [{ text: '  ' }, span(n, e)]));
    return out([spans, ...postsHint(entries)]);
  }
  return out([
    ...entries.map(([n, e]): Line => [
      { text: `${e.kind === 'dir' ? 'drwxr-xr-x' : e.kind === 'link' ? 'lrwxrwxrwx' : '-rw-r--r--'}  `, style: 'muted' },
      { text: `${String(fileSize(e)).padStart(6)}  `, style: 'muted' },
      { text: `${(e.kind === 'file' && e.date) || '          '}  `, style: 'muted' },
      span(n, e),
    ]),
    ...postsHint(entries),
  ]);
};

const cd: Handler = (args, ctx, cmd) => {
  const target = args[0] ?? '~';
  const path = resolvePath(ctx.cwd, target);
  const node = lookup(ctx.fs, path);
  if (!node) return err(MSG[ctx.locale].noEntry(cmd, target));
  if (node.kind !== 'dir') return err(MSG[ctx.locale].notDir(cmd, target));
  return out([hint('↳ ', HINT[ctx.locale].tryLs, { text: 'ls', run: 'ls' })], [{ type: 'cd', cwd: path }]);
};

const pwd: Handler = (_a, ctx) => out([line(displayPath(ctx.cwd))]);

// Shared by cat/head/tail: resolve each operand and hand its line indexes to `pick`.
type Pick = <T>(items: T[]) => T[];
const readFiles = (args: string[], ctx: ShellContext, cmd: string, pick: Pick): Result => {
  const m = MSG[ctx.locale];
  const { rest } = partitionArgs(args);
  if (rest.length === 0) return err(m.missing(cmd, m.file));
  const lines: Line[] = [];
  for (const arg of rest) {
    const node = lookup(ctx.fs, resolvePath(ctx.cwd, arg));
    if (!node) lines.push(line(m.noEntry(cmd, arg), 'error'));
    else if (node.kind === 'dir') lines.push(line(m.isDir(cmd, arg), 'error'));
    else if (node.kind === 'link') lines.push(line(node.note, 'muted'));
    else {
      for (const i of pick(node.lines.map((_, idx) => idx))) {
        const run = node.runs?.[i];
        lines.push(run ? line(node.lines[i], 'link', run) : styleLine(node.lines[i]));
      }
    }
  }
  return out(lines);
};

const cat: Handler = (args, ctx, cmd) => {
  const result = readFiles(args, ctx, cmd, (l) => l);
  const { rest } = partitionArgs(args);
  const node = rest.length === 1 ? lookup(ctx.fs, resolvePath(ctx.cwd, rest[0])) : undefined;
  if (node?.kind !== 'file' || !node.slug) return result;
  const h = HINT[ctx.locale];
  const blogPath = ctx.cwd === '~' ? 'blog' : '~/blog';
  return out([
    ...result.lines,
    hint('↩ ', { text: h.back, run: `ls ${blogPath}` }, ' · ', { text: h.web, run: `open ${rest[0]}` }, ' · ', { text: `vi ${rest[0]}`, run: `vi ${rest[0]}` }),
  ]);
};

// head/tail: `-n N` (or `-N`) picks the count, default 10.
const slicer = (from: 'head' | 'tail'): Handler => (args, ctx, cmd) => {
  let count = 10;
  const files: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-n' && args[i + 1]) count = Math.max(0, parseInt(args[++i], 10) || 0);
    else if (/^-\d+$/.test(args[i])) count = parseInt(args[i].slice(1), 10);
    else files.push(args[i]);
  }
  return readFiles(files, ctx, cmd, (l) => (from === 'head' ? l.slice(0, count) : count === 0 ? [] : l.slice(-count)));
};

const vi: Handler = (args, ctx, cmd) => {
  const m = MSG[ctx.locale];
  const { rest } = partitionArgs(args);
  if (rest.length === 0) return err(m.missing(cmd, m.file));
  const path = resolvePath(ctx.cwd, rest[0]);
  const node = lookup(ctx.fs, path);
  if (!node) return err(m.noEntry(cmd, rest[0]));
  if (node.kind === 'dir') return err(m.isDir(cmd, rest[0]));
  if (node.kind === 'link') return err(m.isLink(cmd, rest[0]));
  if (node.raw) return openNano(path, rest[0], node);
  return out([], [{ type: 'openVi', path, buffer: node.buffer }]);
};

const openNano = (path: string, arg: string, node: Extract<FsNode, { kind: 'file' }>): Result =>
  out([], [{ type: 'openNano', path, name: arg.split('/').pop() ?? arg, lines: node.lines }]);

const nano: Handler = (args, ctx, cmd) => {
  const m = MSG[ctx.locale];
  const { rest } = partitionArgs(args);
  if (rest.length === 0) return err(m.missing(cmd, m.file));
  const path = resolvePath(ctx.cwd, rest[0]);
  const node = lookup(ctx.fs, path);
  if (!node) return err(m.noEntry(cmd, rest[0]));
  if (node.kind === 'dir') return err(m.isDir(cmd, rest[0]));
  if (node.kind === 'link') return err(m.isLink(cmd, rest[0]));
  return openNano(path, rest[0], node);
};

const open: Handler = (args, ctx, cmd) => {
  const m = MSG[ctx.locale];
  if (args.length === 0) return err(m.missing(cmd, m.file));
  const arg = args[0];
  if (/^(https?:\/\/|mailto:)/.test(arg)) return out([], [{ type: 'navigate', href: arg }]);

  const node = lookup(ctx.fs, resolvePath(ctx.cwd, arg));
  if (node?.kind === 'link') return out([], [{ type: 'navigate', href: node.href }]);
  if (node?.kind === 'dir') return err(m.isDir(cmd, arg));
  if (node?.kind === 'file') {
    if (node.slug) return out([], [{ type: 'navigate', href: `/blog/${node.slug}/` }]);
    return out([], [{ type: 'openVi', path: resolvePath(ctx.cwd, arg), buffer: node.buffer }]);
  }
  const contact = links.find((l) => l.label.toLowerCase() === arg.toLowerCase());
  if (contact) return out([], [{ type: 'navigate', href: contact.href }]);
  return err(m.noEntry(cmd, arg));
};

const whoami: Handler = (_a, ctx) => out([[{ text: name, style: 'heading' }], line(site[ctx.locale].tagline)]);

const echo: Handler = (args) => out([line(args.join(' '))]);

const history: Handler = (_a, ctx) => out(ctx.history.map((h, i) => line(`${i + 1}  ${h}`)));

const date: Handler = (_a, ctx) => {
  const d = ctx.now ?? new Date();
  const text = d.toLocaleString(MSG[ctx.locale].dateLocale, { dateStyle: 'full', timeStyle: 'short' });
  return out([line(text)]);
};

const sudo: Handler = (_a, ctx) => out([line(MSG[ctx.locale].sudo, 'error')]);

const neofetch: Handler = (_a, ctx) => {
  const m = MSG[ctx.locale];
  const art = ['  ,--.   ', ' / F  \\  ', ' \\  F /  ', "  `--'   ", '         ', '         ', '         '];
  const info: [string, string][] = [
    [m.os, 'Pop!_OS (tiling)'],
    ['Terminal', 'Ghostty'],
    ['Editor', 'Neovim'],
    [m.keyboard, m.keyboardValue],
    [m.lang, ctx.locale],
    ['Posts', String(ctx.posts.length)],
  ];
  const header: Line = [{ text: art[0], style: 'link' }, { text: 'fran', style: 'ok' }, { text: '@' }, { text: 'fullfran', style: 'accent' }];
  const rows = info.map(([k, v], i): Line => [
    { text: art[i + 1], style: 'link' },
    { text: `${k}: `, style: 'accent' },
    { text: v },
  ]);
  return out([header, ...rows]);
};

const man: Handler = (args, ctx) => {
  const m = MSG[ctx.locale];
  const asked = args[0];
  if (!asked) return err(m.manWhich);
  const key = MAN_ALIASES[asked] ?? asked;
  const page = MAN[ctx.locale][key];
  if (!page) return err(m.manNone(asked));
  const summary = page.summary ?? HELP[ctx.locale].flatMap((g) => g.items).find((i) => i.cmd === key)?.summary ?? '';
  const h = MAN_HEADINGS[ctx.locale];
  const about = site[ctx.locale].aboutFile;
  const heading = (t: string): Line => [{ text: t, style: 'heading' }];
  const body = (t: string): Line => [{ text: `    ${t}` }];
  return out([
    heading(h.name), [{ text: `    ${key} - ${summary}` }], [{ text: '' }],
    heading(h.synopsis), [{ text: `    ${page.synopsis}`, style: 'accent' }], [{ text: '' }],
    heading(h.description), body(page.description), [{ text: '' }],
    heading(h.examples),
    ...page.examples.map((e): Line => {
      const example = e.replace('{about}', about);
      return [{ text: '    ' }, { text: example, style: 'link', run: example }];
    }),
  ]);
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const tree: Handler = (args, ctx, cmd) => {
  const m = MSG[ctx.locale];
  const { flags, rest } = partitionArgs(args);
  const all = flags.some((f) => f.includes('a'));
  const target = rest[0] ?? '.';
  const start = lookup(ctx.fs, resolvePath(ctx.cwd, target));
  if (!start) return err(m.noEntry(cmd, target));
  const base = rest[0] ? rest[0].replace(/\/$/, '') : '';

  const lines: Line[] = [[{ text: target, style: 'dir', run: `ls ${target}` }]];
  let dirs = 0;
  let files = 0;
  const walk = (node: FsNode, prefix: string, ref: string) => {
    if (node.kind !== 'dir') return;
    const kids = Object.entries(node.children)
      .filter(([n]) => all || !n.startsWith('.'))
      .sort(([a], [b]) => a.localeCompare(b));
    kids.forEach(([n, child], i) => {
      const last = i === kids.length - 1;
      const childRef = ref ? `${ref}/${n}` : n;
      const branch = { text: `${prefix}${last ? '└── ' : '├── '}`, style: 'muted' as const };
      if (child.kind === 'dir') {
        dirs++;
        lines.push([branch, { text: n, style: 'dir', run: `ls ${childRef}` }]);
        walk(child, `${prefix}${last ? '    ' : '│   '}`, childRef);
      } else if (child.kind === 'link') {
        files++;
        lines.push([branch, { text: n, style: 'link', run: `open ${childRef}` }]);
      } else {
        files++;
        lines.push([branch, { text: n, style: 'file', run: `cat ${childRef}` }]);
      }
    });
  };
  walk(start, '', base);
  lines.push([{ text: '' }], [{ text: `${plural(dirs, m.dir, m.dirs)}, ${plural(files, m.file1, m.files)}`, style: 'muted' }]);
  return out(lines);
};

// Playful replies for other editors; the suggestion words are tappable.
const editorJoke = (text: (cmd: string, l: Locale) => [string, string, string]): Handler => (_a, ctx, cmd) => {
  const [before, or, after] = text(cmd, ctx.locale);
  const about = site[ctx.locale].aboutFile;
  return out([[
    { text: before },
    { text: 'vi', style: 'link', run: `vi ${about}` },
    { text: or },
    { text: 'nano', style: 'link', run: `nano ${about}` },
    { text: after },
  ]]);
};

const grep: Handler = (args, ctx, cmd) => {
  const m = MSG[ctx.locale];
  const { rest } = partitionArgs(args);
  if (rest.length === 0) return err(m.missing(cmd, m.pattern));
  const needle = rest[0].toLowerCase();
  const target = rest[1] ?? '.';
  const root = resolvePath(ctx.cwd, target);
  const start = lookup(ctx.fs, root);
  if (!start) return err(m.noEntry(cmd, target));

  const lines: Line[] = [];
  const scan = (node: FsNode, path: string) => {
    if (node.kind === 'dir') {
      for (const [n, child] of Object.entries(node.children).sort(([a], [b]) => a.localeCompare(b))) scan(child, `${path}/${n}`);
    } else if (node.kind === 'file') {
      for (const text of node.lines) {
        if (!text.toLowerCase().includes(needle)) continue;
        const spans: Span[] = [{ text: relativeTo(ctx.cwd, path), style: 'accent', run: `cat ${relativeTo(ctx.cwd, path)}` }, { text: ': ' }];
        let from = 0;
        for (let at = text.toLowerCase().indexOf(needle); at !== -1; at = text.toLowerCase().indexOf(needle, from)) {
          if (at > from) spans.push({ text: text.slice(from, at) });
          spans.push({ text: text.slice(at, at + needle.length), style: 'match' });
          from = at + needle.length;
        }
        if (from < text.length) spans.push({ text: text.slice(from) });
        lines.push(spans);
      }
    }
  };
  scan(start, root);
  return out(lines);
};

const HANDLERS: Record<string, Handler> = {
  help, ls, cd, pwd, cat, head: slicer('head'), tail: slicer('tail'),
  vi, vim: vi, nvim: vi, less: vi, more: vi,
  home: (_a, ctx, cmd) => cd(['~'], ctx, cmd),
  ll: (a, ctx, cmd) => ls(['-l', ...a], ctx, cmd),
  nano, man, tree,
  emacs: editorJoke((c, l) => (l === 'es' ? [`${c}: buen sistema operativo, le falta un buen editor. Prueba `, ' o ', '.'] : [`${c}: a great operating system, it just lacks a good editor. Try `, ' or ', '.'])),
  code: editorJoke((c, l) => (l === 'es' ? [`${c}: muy buen editor, pero aquí dentro solo hay `, ' y ', '.'] : [`${c}: a fine editor, but in here there is only `, ' and ', '.'])),
  vscode: editorJoke((c, l) => (l === 'es' ? [`${c}: muy buen editor, pero aquí dentro solo hay `, ' y ', '.'] : [`${c}: a fine editor, but in here there is only `, ' and ', '.'])),
  notepad: editorJoke((c, l) => (l === 'es' ? [`${c}: eso es de otro sistema. Aquí tienes `, ' o ', '.'] : [`${c}: that belongs to another system. Here you have `, ' or ', '.'])),
  open, whoami, echo, history, date, sudo, neofetch, grep,
  clear: () => out([], [{ type: 'clear' }]),
  exit: () => out([], [{ type: 'exit' }]),
};

// Every word the "did you mean" search may suggest.
const SUGGESTIONS = [...new Set([...COMMANDS, ...ALIAS_WORDS.filter((w) => w.length > 2)])];

const notFound = (cmd: string, ctx: ShellContext): Result => {
  const m = MSG[ctx.locale];
  const guess = closest(cmd, SUGGESTIONS);
  const next: Line = guess
    ? [{ text: m.didYouMean }, { text: guess, style: 'link', run: guess }, { text: '?' }]
    : [{ text: m.tryHelp }, { text: m.helpWord, style: 'link', run: 'help' }];
  return out([line(m.notFound(cmd), 'error'), next]);
};

export const run = (input: string, ctx: ShellContext): Result => {
  const alias = resolveAlias(input, ctx.locale, ctx.cwd);
  if (alias) return run(alias, ctx);
  const [cmd, ...args] = parseArgs(input);
  if (!cmd) return out([]);
  const handler = HANDLERS[cmd];
  if (!handler) return notFound(cmd, ctx);
  return handler(args, ctx, cmd);
};
