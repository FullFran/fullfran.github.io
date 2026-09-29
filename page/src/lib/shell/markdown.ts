const stripFrontmatter = (body: string) => body.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

// Turn raw markdown into terminal lines: no frontmatter, blank runs collapsed, math kept raw.
export const markdownToLines = (body: string): string[] => {
  const out: string[] = [];
  for (const raw of stripFrontmatter(body).split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (line === '' && (out.length === 0 || out[out.length - 1] === '')) continue;
    out.push(line);
  }
  while (out.length && out[out.length - 1] === '') out.pop();
  return out;
};
