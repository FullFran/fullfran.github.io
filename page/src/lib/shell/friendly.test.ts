import { describe, expect, it } from 'vitest';
import { buildFs } from './fs';
import { run, textOf, quickActions, welcomeHint, placeholder, type ShellContext } from './commands';
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

describe('aliases', () => {
  it('ayuda, help and ? all show the help', () => {
    const help = text('help');
    expect(text('ayuda')).toBe(help);
    expect(text('?')).toBe(help);
    expect(text('AYUDA')).toBe(help);
  });
  it('blog and posts list the blog from anywhere', () => {
    expect(text('blog')).toBe(text('ls blog'));
    expect(text('posts', ctx({ cwd: '~/blog' }))).toBe(text('ls blog'));
  });
  it('sobre mi, sobre-mi and about cat the about file (accent and case insensitive)', () => {
    for (const w of ['sobre mi', 'Sobre mí', 'sobre-mi', 'about', 'ABOUT']) expect(text(w)).toBe(text('cat sobre-mi.md'));
    expect(text('about', en())).toBe(text('cat about.md', en()));
  });
  it('contacto and contact cat the contact file', () => {
    expect(text('contacto')).toBe(text('cat contacto.md'));
    expect(text('contact', en())).toBe(text('cat contact.md', en()));
  });
  it('cv, curriculum and resume open the cv', () => {
    for (const w of ['cv', 'curriculum', 'resume']) {
      expect(run(w, ctx()).effects).toEqual([{ type: 'navigate', href: '/cv' }]);
    }
  });
  it('salir, quit, q and :q exit', () => {
    for (const w of ['salir', 'exit', 'quit', 'q', ':q']) expect(run(w, ctx()).effects).toEqual([{ type: 'exit' }]);
  });
  it('inicio and home go home with a hint', () => {
    for (const w of ['inicio', 'home']) {
      const r = run(w, ctx({ cwd: '~/blog' }));
      expect(r.effects).toEqual([{ type: 'cd', cwd: '~' }]);
      expect(textOf(r)).toContain('ls');
    }
  });
  it('quien maps to whoami', () => {
    expect(text('quién')).toBe(text('whoami'));
  });
  it('real commands keep working', () => {
    expect(text('ls')).toContain('sobre-mi.md');
  });
});

describe('did you mean', () => {
  it('suggests a close command and makes it tappable', () => {
    const r = run('hlep', ctx());
    expect(textOf(r)).toContain('hlep: orden no encontrada');
    expect(textOf(r)).toContain('¿Quisiste decir help?');
    expect(r.lines.flat().find((s) => s.text === 'help')?.run).toBe('help');
  });
  it('is localized', () => {
    expect(text('hlep', en())).toContain('Did you mean help?');
  });
  it('prefers the shorter word on a tie (lss -> ls, not less)', () => {
    expect(text('lss')).toContain('¿Quisiste decir ls?');
  });
  it('suggests aliases too', () => {
    expect(text('contacot')).toContain('¿Quisiste decir contacto?');
  });
  it('falls back to ayuda when nothing is close', () => {
    const r = run('xyzzyplugh', ctx());
    expect(textOf(r)).toContain('ayuda');
    expect(r.lines.flat().find((s) => s.text === 'ayuda')?.run).toBe('help');
    expect(textOf(r)).not.toContain('Quisiste');
  });
  it('does not suggest for far words', () => {
    expect(text('foo')).not.toContain('Quisiste');
  });
});

describe('human help', () => {
  it('groups commands', () => {
    const out = text('help');
    for (const g of ['Moverse', 'Leer', 'Abrir', 'Otros']) expect(out).toContain(g);
    expect(text('help', en())).toContain('Move');
  });
  it('gives each command a tappable example', () => {
    const ex = spans('help').find((s) => s.run === 'ls blog');
    expect(ex).toBeDefined();
    expect(spans('help').filter((s) => s.run).length).toBeGreaterThan(8);
  });
  it('every tappable example in the help runs without error', () => {
    for (const s of spans('help').filter((x) => x.run)) {
      const r = run(s.run as string, ctx());
      expect(r.lines.flat().some((x) => x.style === 'error'), s.run).toBe(false);
    }
  });
  it('mentions the :q alias for exit', () => {
    expect(text('help')).toContain(':q');
  });
});

describe('tappable output', () => {
  it('grep results open the file with cat', () => {
    const hit = spans('grep entropía').find((s) => s.text === 'blog/cuando-la-fisica-huele-a-ia.md');
    expect(hit?.run).toBe('cat blog/cuando-la-fisica-huele-a-ia.md');
  });
  it('contact links run open', () => {
    const gh = spans('cat contacto.md').find((s) => s.run === 'open github');
    expect(gh?.text).toContain('GitHub');
    expect(spans('cat contacto.md').some((s) => s.run === 'open cv')).toBe(true);
  });
});

describe('next-step hints', () => {
  it('after cat of a post', () => {
    const r = run('cat blog/mi-teclado-de-34-teclas.md', ctx());
    const t = textOf(r);
    expect(t).toContain('↩ volver al blog · abrir en la web · vi blog/mi-teclado-de-34-teclas.md');
    const flat = r.lines.flat();
    expect(flat.find((s) => s.text === 'volver al blog')?.run).toBe('ls blog');
    expect(flat.find((s) => s.text === 'abrir en la web')?.run).toBe('open blog/mi-teclado-de-34-teclas.md');
    expect(flat.find((s) => s.text.startsWith('vi '))?.run).toBe('vi blog/mi-teclado-de-34-teclas.md');
  });
  it('no post hint for non-post files', () => {
    expect(text('cat sobre-mi.md')).not.toContain('volver al blog');
  });
  it('after ls blog', () => {
    expect(text('ls blog')).toContain('toca un post para leerlo');
    expect(text('ls')).not.toContain('toca un post');
  });
  it('after cd, tappable ls', () => {
    const r = run('cd blog', ctx());
    expect(textOf(r)).toContain('prueba ls');
    expect(r.lines.flat().find((s) => s.text === 'ls')?.run).toBe('ls');
  });
  it('is localized', () => {
    expect(text('cd blog', en())).toContain('try ls');
    expect(text('ls blog', en())).toContain('tap a post to read it');
  });
});

describe('onboarding copy and quick actions', () => {
  it('welcome and placeholder per locale', () => {
    expect(welcomeHint('es')).toBe('¿No sabes por dónde empezar? Toca un botón de abajo o escribe ayuda.');
    expect(welcomeHint('en')).toBe('Not sure where to start? Tap a button below or type help.');
    expect(placeholder('es')).toBe('escribe un comando, por ejemplo: blog');
    expect(placeholder('en')).toBe('type a command, e.g. blog');
  });
  it('quick actions map labels to real commands', () => {
    expect(quickActions('es')).toEqual([
      { label: 'Sobre mí', command: 'cat sobre-mi.md' },
      { label: 'Blog', command: 'ls blog' },
      { label: 'Contacto', command: 'cat contacto.md' },
      { label: 'CV', command: 'open cv' },
      { label: 'Ayuda', command: 'help' },
      { label: 'Salir', command: 'exit' },
    ]);
    expect(quickActions('en').map((a) => a.label)).toEqual(['About', 'Blog', 'Contact', 'CV', 'Help', 'Exit']);
    expect(quickActions('en')[0].command).toBe('cat about.md');
  });
  it('every quick action runs without error', () => {
    for (const l of ['es', 'en'] as const) {
      const c = l === 'en' ? en() : ctx();
      for (const a of quickActions(l)) expect(run(a.command, c).lines.flat().some((s) => s.style === 'error'), a.command).toBe(false);
    }
  });
});

describe('complete with aliases', () => {
  it('completes alias words and :q', () => {
    const c = ctx();
    expect(complete('ayu', c.cwd, c.fs).input).toBe('ayuda ');
    expect(complete('contacto', c.cwd, c.fs).input).toBe('contacto ');
    expect(complete(':', c.cwd, c.fs).input).toBe(':q ');
  });
});
