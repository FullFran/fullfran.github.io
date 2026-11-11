import { describe, expect, it } from 'vitest';
import { cardAlt, fitText, measure, renderCard } from './card';

describe('og cards', () => {
  it('wraps a long title inside the box', () => {
    const title = '¿Por qué una hormiga no se rompe cuando cae desde un rascacielos y un elefante sí?';
    const { size, lines } = fitText(title, 'sans', [72, 60, 48], 960, 300, 1.14);
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) expect(measure(line, 'sans', size)).toBeLessThanOrEqual(960);
    expect(lines.join(' ')).toBe(title);
  });

  it('cuts with an ellipsis when even the smallest size overflows', () => {
    const { size, lines } = fitText('palabra '.repeat(80), 'sans', [48], 600, 120, 1.14);
    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith('…')).toBe(true);
    for (const line of lines) expect(measure(line, 'sans', size)).toBeLessThanOrEqual(600);
  });

  it('breaks a word wider than the box', () => {
    const { size, lines } = fitText('x'.repeat(200), 'mono', [40], 500, 400, 1.2);
    for (const line of lines) expect(measure(line, 'mono', size)).toBeLessThanOrEqual(500);
  });

  it('has real glyphs for Spanish accents', () => {
    // .notdef has no width-specific shape; accented letters must be as wide as their base.
    expect(measure('á', 'sans', 100)).toBeGreaterThan(0);
    expect(measure('ñ', 'sans', 100)).toBe(measure('n', 'sans', 100));
  });

  it('renders text as outlines, with no font dependency', () => {
    const svg = renderCard({ kind: 'post', slug: 'atascos', title: '¿Atascos fantasma?', date: '2025-01-02T00:00:00Z' });
    expect(svg).toMatch(/^<svg[^>]+width="1200" height="630"/);
    expect(svg).not.toContain('<text');
    expect(cardAlt({ kind: 'post', slug: 'a', title: 'T', date: '2025-01-02T00:00:00Z' })).toBe('T · 2 de enero de 2025 · fullfran.com');
  });
});
