// Paths are canonical strings: '~' is home, '~/blog' a child. There is no real root above home.
const HOME_ABS = '/home/fran';

export const resolvePath = (cwd: string, input: string): string => {
  let rest = input.trim();
  if (rest === '') return cwd;

  let segs: string[];
  if (rest === '~' || rest.startsWith('~/')) {
    segs = [];
    rest = rest.slice(1);
  } else if (rest === HOME_ABS || rest.startsWith(`${HOME_ABS}/`)) {
    segs = [];
    rest = rest.slice(HOME_ABS.length);
  } else if (rest.startsWith('/')) {
    segs = [];
  } else {
    segs = cwd.split('/').slice(1);
  }

  for (const part of rest.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') segs.pop();
    else segs.push(part);
  }
  return ['~', ...segs].join('/');
};

export const displayPath = (path: string): string => HOME_ABS + path.slice(1);

export const segmentsOf = (path: string): string[] => path.split('/').slice(1);
