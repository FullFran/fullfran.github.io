// Split a command line into words, honoring simple single and double quotes.
export const parseArgs = (line: string): string[] => {
  const out: string[] = [];
  let cur = '';
  let quote: string | null = null;
  let inWord = false;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      inWord = true;
    } else if (/\s/.test(ch)) {
      if (inWord) out.push(cur);
      cur = '';
      inWord = false;
    } else {
      cur += ch;
      inWord = true;
    }
  }
  if (inWord) out.push(cur);
  return out;
};
