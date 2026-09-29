import { links, name, site } from '../../data/site';
import type { Locale } from '../../data/site';
import { lookup } from './fs';
import { parseArgs } from './parse';
import { displayPath, resolvePath } from './path';
import type { Effect, FsNode, Line, Result, ShellContext, Span, Style } from './types';

export type { ShellContext } from './types';

export const COMMANDS = [
  'cat', 'cd', 'clear', 'date', 'echo', 'exit', 'grep', 'head', 'help', 'history', 'less',
  'ls', 'more', 'neofetch', 'nvim', 'open', 'pwd', 'sudo', 'tail', 'vi', 'vim', 'whoami',
];

// --- COPY ---
const HELP: Record<Locale, [string, string][]> = {
  es: [
    ['help', 'esta ayuda'],
    ['ls [-l] [ruta]', 'lista ficheros'],
    ['cd [ruta]', 'cambia de directorio'],
    ['pwd', 'directorio actual'],
    ['cat <fichero>', 'muestra un fichero'],
    ['head / tail [-n N]', 'principio o final de un fichero'],
    ['grep <texto> [ruta]', 'busca texto en los ficheros'],
    ['vi <fichero>', 'abre el fichero en el visor tipo vim'],
    ['open <destino>', 'abre un post, cv, teclado, github...'],
    ['whoami', 'quién soy'],
    ['neofetch', 'mi setup'],
    ['history', 'comandos anteriores'],
    ['clear', 'limpia la pantalla (Ctrl+L)'],
    ['exit', 'vuelve a la web'],
  ],
  en: [
    ['help', 'this help'],
    ['ls [-l] [path]', 'list files'],
    ['cd [path]', 'change directory'],
    ['pwd', 'current directory'],
    ['cat <file>', 'print a file'],
    ['head / tail [-n N]', 'start or end of a file'],
    ['grep <text> [path]', 'search text in files'],
    ['vi <file>', 'open the file in the vim-like viewer'],
    ['open <target>', 'open a post, cv, teclado, github...'],
    ['whoami', 'who I am'],
    ['neofetch', 'my setup'],
    ['history', 'previous commands'],
    ['clear', 'clear the screen (Ctrl+L)'],
    ['exit', 'back to the web'],
  ],
};

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
    welcome: 'escribe help para empezar',
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
    welcome: 'type help to get started',
  },
} as const;

export const welcomeHint = (locale: Locale) => MSG[locale].welcome;

// --- HELPERS ---
const line = (text: string, style?: Style, run?: string): Line => [{ text, style, run }];
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
  const rows = HELP[ctx.locale];
  const width = Math.max(...rows.map(([c]) => c.length)) + 2;
  return out(rows.map(([c, d]) => [{ text: c.padEnd(width), style: 'accent' }, { text: d }]));
};

const ls: Handler = (args, ctx) => {
  const { flags, rest } = partitionArgs(args);
  const long = flags.some((f) => f.includes('l'));
  const target = rest[0] ?? '.';
  const path = resolvePath(ctx.cwd, target);
  const node = lookup(ctx.fs, path);
  if (!node) return err(MSG[ctx.locale].lsNoEntry(target));

  const entries: [string, FsNode][] = node.kind === 'dir' ? Object.entries(node.children) : [[target, node]];
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
    return out([spans]);
  }
  return out(
    entries.map(([n, e]) => [
      { text: `${e.kind === 'dir' ? 'drwxr-xr-x' : e.kind === 'link' ? 'lrwxrwxrwx' : '-rw-r--r--'}  `, style: 'muted' },
      { text: `${String(fileSize(e)).padStart(6)}  `, style: 'muted' },
      { text: `${(e.kind === 'file' && e.date) || '          '}  `, style: 'muted' },
      span(n, e),
    ]),
  );
};

const cd: Handler = (args, ctx, cmd) => {
  const target = args[0] ?? '~';
  const path = resolvePath(ctx.cwd, target);
  const node = lookup(ctx.fs, path);
  if (!node) return err(MSG[ctx.locale].noEntry(cmd, target));
  if (node.kind !== 'dir') return err(MSG[ctx.locale].notDir(cmd, target));
  return out([], [{ type: 'cd', cwd: path }]);
};

const pwd: Handler = (_a, ctx) => out([line(displayPath(ctx.cwd))]);

// Shared by cat/head/tail: resolve each operand and hand its lines to `pick`.
const readFiles = (args: string[], ctx: ShellContext, cmd: string, pick: (lines: string[]) => string[]): Result => {
  const m = MSG[ctx.locale];
  const { rest } = partitionArgs(args);
  if (rest.length === 0) return err(m.missing(cmd, m.file));
  const lines: Line[] = [];
  for (const arg of rest) {
    const node = lookup(ctx.fs, resolvePath(ctx.cwd, arg));
    if (!node) lines.push(line(m.noEntry(cmd, arg), 'error'));
    else if (node.kind === 'dir') lines.push(line(m.isDir(cmd, arg), 'error'));
    else if (node.kind === 'link') lines.push(line(node.note, 'muted'));
    else lines.push(...pick(node.lines).map(styleLine));
  }
  return out(lines);
};

const cat: Handler = (args, ctx, cmd) => readFiles(args, ctx, cmd, (l) => l);

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
  return out([], [{ type: 'openVi', path, buffer: node.buffer }]);
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
        const spans: Span[] = [{ text: relativeTo(ctx.cwd, path), style: 'accent' }, { text: ': ' }];
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
  open, whoami, echo, history, date, sudo, neofetch, grep,
  clear: () => out([], [{ type: 'clear' }]),
  exit: () => out([], [{ type: 'exit' }]),
};

export const run = (input: string, ctx: ShellContext): Result => {
  const [cmd, ...args] = parseArgs(input);
  if (!cmd) return out([]);
  const handler = HANDLERS[cmd];
  if (!handler) return err(MSG[ctx.locale].notFound(cmd));
  return handler(args, ctx, cmd);
};
