import { describe, expect, it } from 'vitest';
import { markdownToLines } from './markdown';

describe('markdownToLines', () => {
  it('strips frontmatter and collapses blank runs', () => {
    expect(markdownToLines('---\na: 1\n---\nuno\n\n\n\ndos  \n\n')).toEqual(['uno', '', 'dos']);
  });
});
