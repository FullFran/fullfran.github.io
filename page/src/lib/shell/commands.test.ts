import { describe, expect, it } from 'vitest';
import { buildFs } from './fs';
import { run, textOf, type ShellContext } from './commands';
import { complete } from './complete';
import { posts } from './fixtures';

const ctx = (over: Partial<ShellContext> = {}): ShellContext => ({
  fs: buildFs('es', posts),
  cwd: '~',
  locale: 'es',
  posts,
  history: [],
  now: new Date('2026-09-29T10:00:00Z'),
  ...over,
});
const text = (line: string, c = ctx()) => textOf(run(line, c));

describe('run: basics', () => {
  it('ignores blank lines', () => {
    expect(run('   ', ctx())).toEqual({ lines: [], effects: [] });
  });
  it('reports unknown commands per locale', () => {
    expect(text('foo')).toContain('foo: orden no encontrada');
    const en = ctx({ locale: 'en', fs: buildFs('en', posts) });
    expect(text('foo', en)).toContain('foo: command not found');
  });
  it('help lists commands', () => {
    const out = text('help');
    for (const c of ['ls', 'cd', 'cat', 'vi', 'open', 'exit']) expect(out).toContain(c);
  });
  it('help is localized', () => {
    expect(text('help', ctx({ locale: 'en', fs: buildFs('en', posts) }))).toContain('list');
  });
  it('echo joins its args', () => {
    expect(text('echo hola  "a b"')).toBe('hola a b');
  });
  it('pwd prints the absolute cwd', () => {
    expect(text('pwd')).toBe('/home/fran');
    expect(text('pwd', ctx({ cwd: '~/blog' }))).toBe('/home/fran/blog');
  });
  it('whoami prints name and tagline', () => {
    const out = text('whoami');
    expect(out).toContain('Francisco Olmedo');
    expect(out).toContain('Físico');
  });
  it('sudo refuses playfully', () => {
    expect(text('sudo rm -rf /')).toContain('sudoers');
  });
  it('exit and clear return effects', () => {
    expect(run('exit', ctx()).effects).toEqual([{ type: 'exit' }]);
    expect(run('clear', ctx()).effects).toEqual([{ type: 'clear' }]);
  });
  it('history numbers the entries', () => {
    expect(text('history', ctx({ history: ['ls', 'history'] }))).toBe('1  ls\n2  history');
  });
  it('date prints the injected date', () => {
    expect(text('date')).toContain('2026');
  });
  it('neofetch shows site facts and the post count', () => {
    const out = text('neofetch');
    expect(out).toContain('Pop!_OS');
    expect(out).toContain('Neovim');
    expect(out).toContain('34');
    expect(out).toMatch(/Posts?.*2/);
  });
});

describe('run: ls / cd', () => {
  it('ls lists home, dirs first-class styled', () => {
    const r = run('ls', ctx());
    expect(textOf(r)).toContain('sobre-mi.md');
    const blog = r.lines.flat().find((s) => s.text === 'blog/');
    expect(blog?.style).toBe('dir');
    expect(blog?.run).toBe('cd blog');
  });
  it('ls makes files tappable with cat', () => {
    const f = run('ls', ctx()).lines.flat().find((s) => s.text === 'sobre-mi.md');
    expect(f?.run).toBe('cat sobre-mi.md');
  });
  it('ls path lists a subdirectory', () => {
    const out = text('ls blog');
    expect(out).toContain('mi-teclado-de-34-teclas.md');
    expect(out).not.toContain('sobre-mi.md');
  });
  it('ls -l shows the date of posts', () => {
    expect(text('ls -l blog')).toContain('2025-05-12');
  });
  it('ls on a file prints the file, on a missing path errors', () => {
    expect(text('ls ahora.txt')).toBe('ahora.txt');
    expect(text('ls nada')).toContain("ls: no se puede acceder a 'nada'");
  });
  it('cd returns a cd effect', () => {
    expect(run('cd blog', ctx()).effects).toEqual([{ type: 'cd', cwd: '~/blog' }]);
    expect(run('cd', ctx({ cwd: '~/blog' })).effects).toEqual([{ type: 'cd', cwd: '~' }]);
    expect(run('cd ..', ctx({ cwd: '~/blog' })).effects).toEqual([{ type: 'cd', cwd: '~' }]);
    expect(run('cd ../../..', ctx({ cwd: '~/blog' })).effects).toEqual([{ type: 'cd', cwd: '~' }]);
  });
  it('cd errors on files and missing dirs', () => {
    expect(text('cd ahora.txt')).toContain('no es un directorio');
    expect(run('cd ahora.txt', ctx()).effects).toEqual([]);
    expect(text('cd nada')).toContain('no existe');
  });
});

describe('run: cat / head / tail', () => {
  it('cat prints the about paragraphs', () => {
    expect(text('cat sobre-mi.md')).toContain('Soy Fran');
  });
  it('cat a post shows title, date and body without frontmatter', () => {
    const out = text('cat blog/cuando-la-fisica-huele-a-ia.md');
    expect(out).toContain('Cuando la física huele a IA');
    expect(out).toContain('2025-03-01');
    expect(out).toContain('Primer párrafo');
    expect(out).not.toContain('title: x');
  });
  it('cat several files', () => {
    const out = text('cat ahora.txt contacto.md');
    expect(out).toContain('Hagalink');
    expect(out).toContain('GitHub');
  });
  it('cat cv explains instead of dumping', () => {
    const out = text('cat cv');
    expect(out).toContain('open cv');
    expect(run('cat cv', ctx()).effects).toEqual([]);
  });
  it('cat errors on dirs and missing files', () => {
    expect(text('cat blog')).toContain('es un directorio');
    expect(text('cat nada')).toContain('no existe');
    expect(text('cat')).toContain('falta');
  });
  it('head and tail take -n', () => {
    expect(text('head -n 1 blog/mi-teclado-de-34-teclas.md').split('\n')).toHaveLength(1);
    expect(text('tail -n 1 blog/mi-teclado-de-34-teclas.md')).toContain('capas');
  });
});

describe('run: vi / open', () => {
  it('vi opens a file in the viewer', () => {
    const r = run('vi sobre-mi.md', ctx());
    expect(r.effects).toEqual([{ type: 'openVi', path: '~/sobre-mi.md', buffer: { tab: 'about' } }]);
  });
  it('vi maps posts, contact and now to viewer buffers', () => {
    expect(run('vim blog/mi-teclado-de-34-teclas.md', ctx()).effects).toEqual([
      { type: 'openVi', path: '~/blog/mi-teclado-de-34-teclas.md', buffer: { tab: 'blog', slug: 'mi-teclado-de-34-teclas' } },
    ]);
    expect(run('nvim contacto.md', ctx()).effects[0]).toMatchObject({ buffer: { tab: 'contact' } });
    expect(run('less ahora.txt', ctx()).effects[0]).toMatchObject({ buffer: { tab: 'about' } });
  });
  it('vi errors on dirs, links and missing files', () => {
    expect(run('vi blog', ctx()).effects).toEqual([]);
    expect(text('vi blog')).toContain('es un directorio');
    expect(text('vi cv')).toContain('open cv');
    expect(text('vi nada')).toContain('no existe');
    expect(text('vi')).toContain('falta');
  });
  it('open navigates to links and posts', () => {
    expect(run('open cv', ctx()).effects).toEqual([{ type: 'navigate', href: '/cv' }]);
    expect(run('open teclado', ctx()).effects).toEqual([{ type: 'navigate', href: '/fifi-keyboard-vial/' }]);
    expect(run('open blog/mi-teclado-de-34-teclas.md', ctx()).effects).toEqual([
      { type: 'navigate', href: '/blog/mi-teclado-de-34-teclas/' },
    ]);
  });
  it('open understands contact link names and urls', () => {
    expect(run('open github', ctx()).effects).toEqual([{ type: 'navigate', href: 'https://github.com/FullFran' }]);
    expect(run('open https://example.com', ctx()).effects).toEqual([{ type: 'navigate', href: 'https://example.com' }]);
  });
  it('open errors on missing targets and dirs', () => {
    expect(run('open nada', ctx()).effects).toEqual([]);
    expect(text('open nada')).toContain('no existe');
    expect(text('open blog')).toContain('es un directorio');
  });
});

describe('run: grep', () => {
  it('finds matches case-insensitively across the tree', () => {
    const out = text('grep ENTROPÍA');
    expect(out).toContain('blog/cuando-la-fisica-huele-a-ia.md: Primer párrafo sobre entropía.');
  });
  it('limits the search to a path', () => {
    const out = text('grep teclado blog');
    expect(out).toContain('mi-teclado-de-34-teclas.md');
    expect(out).not.toContain('sobre-mi.md');
  });
  it('reports no matches and missing args', () => {
    expect(text('grep zzzz')).toBe('');
    expect(text('grep')).toContain('falta');
  });
});

describe('complete', () => {
  const c = ctx();
  it('completes commands', () => {
    expect(complete('neo', c.cwd, c.fs)).toEqual({ input: 'neofetch ', candidates: ['neofetch'] });
  });
  it('lists ambiguous commands and extends the common prefix', () => {
    const r = complete('he', c.cwd, c.fs);
    expect(r.candidates).toEqual(expect.arrayContaining(['head', 'help']));
    expect(r.input).toBe('he');
  });
  it('completes paths, appending / to dirs', () => {
    expect(complete('cd bl', c.cwd, c.fs)).toEqual({ input: 'cd blog/', candidates: ['blog/'] });
    expect(complete('cat sobre', c.cwd, c.fs).input).toBe('cat sobre-mi.md ');
  });
  it('completes inside subdirectories and nested typed paths', () => {
    expect(complete('cat blog/mi-t', c.cwd, c.fs).input).toBe('cat blog/mi-teclado-de-34-teclas.md ');
    expect(complete('cat mi-t', '~/blog', c.fs).input).toBe('cat mi-teclado-de-34-teclas.md ');
  });
  it('cd only offers directories', () => {
    expect(complete('cd ', c.cwd, c.fs).candidates).toEqual(['blog/']);
  });
  it('returns nothing for unknown prefixes', () => {
    expect(complete('cat zzz', c.cwd, c.fs)).toEqual({ input: 'cat zzz', candidates: [] });
  });
});
