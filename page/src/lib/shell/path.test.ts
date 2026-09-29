import { describe, expect, it } from 'vitest';
import { resolvePath, displayPath } from './path';

describe('resolvePath', () => {
  it('resolves relative paths from cwd', () => {
    expect(resolvePath('~', 'blog')).toBe('~/blog');
    expect(resolvePath('~/blog', 'x.md')).toBe('~/blog/x.md');
  });
  it('handles ~, ., .. and trailing slashes', () => {
    expect(resolvePath('~/blog', '~')).toBe('~');
    expect(resolvePath('~/blog', '.')).toBe('~/blog');
    expect(resolvePath('~/blog', '..')).toBe('~');
    expect(resolvePath('~', 'blog/')).toBe('~/blog');
    expect(resolvePath('~', '~/blog/../blog/')).toBe('~/blog');
  });
  it('never climbs above home', () => {
    expect(resolvePath('~', '..')).toBe('~');
    expect(resolvePath('~/blog', '../../..')).toBe('~');
  });
  it('accepts absolute /home/fran paths', () => {
    expect(resolvePath('~/blog', '/home/fran/blog')).toBe('~/blog');
    expect(resolvePath('~/blog', '/home/fran')).toBe('~');
  });
  it('displays paths as absolute', () => {
    expect(displayPath('~')).toBe('/home/fran');
    expect(displayPath('~/blog')).toBe('/home/fran/blog');
  });
});
