import type { Locale, Post } from '../../data/site';

// Tokens the UI maps to colors; the core never knows about CSS.
export type Style = 'plain' | 'dir' | 'file' | 'link' | 'error' | 'muted' | 'accent' | 'heading' | 'ok' | 'match';

// A styled run of text. When `run` is set the UI makes it tappable and executes that command.
export interface Span {
  text: string;
  style?: Style;
  run?: string;
}
export type Line = Span[];

// Which buffer of the vim viewer shows a given file.
export interface ViBuffer {
  tab: 'about' | 'blog' | 'contact';
  slug?: string;
}

export type Effect =
  | { type: 'openVi'; path: string; buffer: ViBuffer }
  | { type: 'navigate'; href: string }
  | { type: 'clear' }
  | { type: 'exit' }
  | { type: 'cd'; cwd: string };

export interface Result {
  lines: Line[];
  effects: Effect[];
}

export type FsNode =
  | { kind: 'dir'; children: Record<string, FsNode> }
  | { kind: 'file'; lines: string[]; date?: string; slug?: string; buffer: ViBuffer }
  | { kind: 'link'; href: string; note: string };

export interface ShellContext {
  fs: FsNode;
  cwd: string;
  locale: Locale;
  posts: Post[];
  history: string[];
  now?: Date;
}
