import { describe, expect, it } from 'vitest';
import { parseArgs } from './parse';

describe('parseArgs', () => {
  it('splits on whitespace', () => {
    expect(parseArgs('  ls   -l  blog ')).toEqual(['ls', '-l', 'blog']);
  });
  it('respects single and double quotes', () => {
    expect(parseArgs(`echo "hola  mundo" 'a b' c`)).toEqual(['echo', 'hola  mundo', 'a b', 'c']);
  });
  it('tolerates an unclosed quote', () => {
    expect(parseArgs('echo "abc')).toEqual(['echo', 'abc']);
  });
  it('returns nothing for blank input', () => {
    expect(parseArgs('   ')).toEqual([]);
  });
});
