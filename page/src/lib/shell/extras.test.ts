import { describe, expect, it } from 'vitest';
import { buildFs, lookup } from './fs';
import { run, textOf, type ShellContext } from './commands';
import { complete } from './complete';
import { posts } from './fixtures';

const ctx = (over: Partial<ShellContext> = {}): ShellContext => ({
  fs: buildFs('es', posts),
  cwd: '~',
  locale: 'es',
  posts,
  history: [],
  ...over,
});
const en = () => ctx({ locale: 'en', fs: buildFs('en', posts) });
const text = (line: string, c = ctx()) => textOf(run(line, c));
const spans = (line: string, c = ctx()) => run(line, c).lines.flat();

describe('nano', () => {
  it('opens a read-only view with the file lines', () => {
    const r = run('nano sobre-mi.md', ctx());
    expect(r.effects).toHaveLength(1);
    expect(r.effects[0]).toMatchObject({ type: 'openNano', path: '~/sobre-mi.md', name: 'sobre-mi.md' });
    const node = lookup(ctx().fs, '~/sobre-mi.md');
    expect(node?.kind === 'file' && (r.effects[0] as { lines: string[] }).lines).toEqual(node?.kind === 'file' ? node.lines : []);
  });
  it('works on posts and from subdirectories', () => {
    expect(run('nano mi-teclado-de-34-teclas.md', ctx({ cwd: '~/blog' })).effects[0]).toMatchObject({
      type: 'openNano',
      name: 'mi-teclado-de-34-teclas.md',
    });
  });
  it('errors on missing operand, dirs, links and missing files', () => {
    expect(text('nano')).toContain('falta');
    expect(text('nano blog')).toContain('es un directorio');
    expect(text('nano cv')).toContain('open cv');
    expect(text('nano nada')).toContain('no existe');
    expect(run('nano blog', ctx()).effects).toEqual([]);
  });
});

describe('man', () => {
  it('prints the four sections in Spanish', () => {
    const out = text('man ls');
    for (const h of ['NOMBRE', 'SINOPSIS', 'DESCRIPCIÓN', 'EJEMPLOS']) expect(out).toContain(h);
    expect(out).toContain('ls -a');
  });
  it('prints the four sections in English', () => {
    const out = text('man ls', en());
    for (const h of ['NAME', 'SYNOPSIS', 'DESCRIPTION', 'EXAMPLES']) expect(out).toContain(h);
  });
  it('examples are tappable', () => {
    expect(spans('man cat').some((s) => s.run === 'cat sobre-mi.md')).toBe(true);
  });
  it('every command in the help has a manual page', () => {
    const cmds = spans('help').filter((s) => s.style === 'accent').map((s) => s.text.trim());
    expect(cmds.length).toBeGreaterThan(10);
    for (const c of cmds) expect(text(`man ${c}`), c).toContain('NOMBRE');
  });
  it('vim and friends share the vi page; exit mentions :q', () => {
    expect(text('man vim')).toBe(text('man vi'));
    expect(text('man exit')).toContain(':q');
  });
  it('asks for a page and reports unknown ones', () => {
    expect(text('man')).toContain('man ls');
    expect(text('man zzz')).toContain('No hay entrada del manual para zzz');
    expect(text('man zzz', en())).toContain('No manual entry for zzz');
  });
});

describe('tree', () => {
  it('draws the home tree with box characters', () => {
    const out = text('tree');
    expect(out.split('\n')[0]).toBe('.');
    expect(out).toContain('├── ahora.txt');
    expect(out).toContain('├── blog');
    expect(out).toContain('│   ├── cuando-la-fisica-huele-a-ia.md');
    expect(out).toContain('│   └── mi-teclado-de-34-teclas.md');
    expect(out).toContain('└── teclado');
    expect(out).not.toContain('.bashrc');
    expect(out).toContain('1 directorio, 7 ficheros');
  });
  it('takes a path and shows it as root', () => {
    const out = text('tree blog');
    expect(out.split('\n')[0]).toBe('blog');
    expect(out).toContain('└── mi-teclado-de-34-teclas.md');
    expect(out).not.toContain('sobre-mi');
  });
  it('-a includes hidden files', () => {
    expect(text('tree -a')).toContain('.bashrc');
  });
  it('is tappable', () => {
    const flat = spans('tree');
    expect(flat.find((s) => s.text === 'sobre-mi.md')?.run).toBe('cat sobre-mi.md');
    expect(flat.find((s) => s.text === 'mi-teclado-de-34-teclas.md')?.run).toBe('cat blog/mi-teclado-de-34-teclas.md');
    expect(flat.find((s) => s.text === 'blog')?.run).toBe('ls blog');
    expect(flat.find((s) => s.text === 'cv')?.run).toBe('open cv');
  });
  it('errors on missing paths and localizes the summary', () => {
    expect(text('tree nada')).toContain('no existe');
    expect(text('tree', en())).toContain('1 directory, 7 files');
  });
});

describe('editor jokes', () => {
  it('emacs', () => {
    expect(text('emacs')).toBe('emacs: buen sistema operativo, le falta un buen editor. Prueba vi o nano.');
  });
  it('code, vscode and notepad reply and point to vi or nano', () => {
    for (const c of ['code', 'vscode', 'notepad']) {
      const out = text(c);
      expect(out.startsWith(`${c}:`), c).toBe(true);
      expect(out).toContain('nano');
      expect(run(c, ctx()).effects).toEqual([]);
    }
  });
  it('suggestions are tappable and localized', () => {
    expect(spans('emacs').find((s) => s.text === 'nano')?.run).toBe('nano sobre-mi.md');
    expect(text('emacs', en())).toContain('Try vi or nano');
  });
});

describe('hidden .bashrc', () => {
  it('ls hides it, ls -a shows it', () => {
    expect(text('ls')).not.toContain('.bashrc');
    expect(text('ls -a')).toContain('.bashrc');
    expect(text('ls -la')).toContain('.bashrc');
  });
  it('cat prints harmless aliases and a hint', () => {
    const out = text('cat .bashrc');
    expect(out).toContain("alias ll='ls -l'");
    expect(out).toContain("alias q='exit'");
    expect(out).toContain("alias :q='exit'");
    expect(out).toContain('# si has llegado hasta aquí, escríbeme: contacto.md');
    expect(text('cat .bashrc', en())).toContain('# if you got this far, write to me: contact.md');
  });
  it('the hint line is tappable', () => {
    expect(spans('cat .bashrc').some((s) => s.run === 'cat contacto.md')).toBe(true);
  });
  it('nano and vi open it in the nano view', () => {
    expect(run('nano .bashrc', ctx()).effects[0]).toMatchObject({ type: 'openNano', name: '.bashrc' });
    expect(run('vi .bashrc', ctx()).effects[0]).toMatchObject({ type: 'openNano' });
  });
  it('ll is the alias it advertises', () => {
    expect(text('ll')).toContain('rw-r--r--');
  });
});

describe('help lists the new commands', () => {
  it('shows tree, nano and man', () => {
    const out = text('help');
    for (const c of ['tree', 'nano', 'man']) expect(out).toContain(c);
  });
});

describe('complete: new commands', () => {
  const c = ctx();
  it('completes new command names', () => {
    expect(complete('nan', c.cwd, c.fs).input).toBe('nano ');
    expect(complete('tre', c.cwd, c.fs).input).toBe('tree ');
    expect(complete('ema', c.cwd, c.fs).input).toBe('emacs ');
    expect(complete('vsc', c.cwd, c.fs).input).toBe('vscode ');
  });
  it('man completes command names', () => {
    expect(complete('man tre', c.cwd, c.fs).input).toBe('man tree ');
  });
  it('hides dotfiles unless asked', () => {
    expect(complete('cat ', c.cwd, c.fs).candidates).not.toContain('.bashrc');
    expect(complete('cat .b', c.cwd, c.fs).input).toBe('cat .bashrc ');
  });
});
