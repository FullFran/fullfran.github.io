import { describe, expect, it } from 'vitest';
import { buildFs, lookup } from './fs';
import { posts } from './fixtures';

describe('buildFs', () => {
  it('has the Spanish files', () => {
    const fs = buildFs('es', posts);
    for (const p of ['~/sobre-mi.md', '~/ahora.txt', '~/contacto.md', '~/blog', '~/cv', '~/teclado']) {
      expect(lookup(fs, p), p).toBeDefined();
    }
    expect(lookup(fs, '~/about.md')).toBeUndefined();
  });
  it('has the English files', () => {
    const fs = buildFs('en', posts);
    for (const p of ['~/about.md', '~/now.txt', '~/contact.md']) expect(lookup(fs, p), p).toBeDefined();
    expect(lookup(fs, '~/sobre-mi.md')).toBeUndefined();
  });
  it('puts posts under blog/', () => {
    const fs = buildFs('es', posts);
    const node = lookup(fs, '~/blog/mi-teclado-de-34-teclas.md');
    expect(node?.kind).toBe('file');
    expect(lookup(fs, '~/blog')?.kind).toBe('dir');
  });
  it('models cv and teclado as links', () => {
    const fs = buildFs('es', posts);
    expect(lookup(fs, '~/cv')).toMatchObject({ kind: 'link', href: '/cv' });
    expect(lookup(fs, '~/teclado')).toMatchObject({ kind: 'link', href: '/fifi-keyboard-vial/' });
  });
  it('looks up home and rejects missing paths', () => {
    const fs = buildFs('es', posts);
    expect(lookup(fs, '~')?.kind).toBe('dir');
    expect(lookup(fs, '~/nope')).toBeUndefined();
    expect(lookup(fs, '~/sobre-mi.md/x')).toBeUndefined();
  });
});
