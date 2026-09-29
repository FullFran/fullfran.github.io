import { LogOut } from 'lucide-react';
import * as React from 'react';
import type { Locale, Post } from '../data/site';
import { buildFs, complete, run } from '../lib/shell';
import { placeholder, quickActions, welcomeHint } from '../lib/shell/commands';
import type { Line, Style, ViBuffer } from '../lib/shell';

// --- THEME (Tokyo Night, same palette as the vim viewer) ---
const STYLE_CLASS: Record<Style, string> = {
  plain: 'text-[#a9b1d6]',
  dir: 'text-[#7aa2f7] font-bold',
  file: 'text-[#a9b1d6]',
  link: 'text-[#7dcfff]',
  error: 'text-[#f7768e]',
  muted: 'text-[#828bb8]',
  accent: 'text-[#bb9af7]',
  heading: 'text-[#bb9af7] font-bold',
  ok: 'text-[#9ece6a]',
  match: 'text-[#1a1b26] bg-[#e0af68]',
};

interface Entry {
  id: number;
  // Prompt path at the time the command ran; null for output that has no prompt (banner).
  cwd: string | null;
  command: string;
  lines: Line[];
}

const Prompt: React.FC<{ cwd: string }> = ({ cwd }) => (
  <span className="whitespace-nowrap">
    <span className="text-[#9ece6a]">fran@fullfran</span>
    <span className="text-[#a9b1d6]">:</span>
    <span className="text-[#7aa2f7]">{cwd}</span>
    <span className="text-[#a9b1d6]">$&nbsp;</span>
  </span>
);

const OutputLine: React.FC<{ line: Line; onRun: (cmd: string) => void }> = ({ line, onRun }) => (
  <div className="whitespace-pre-wrap break-words min-h-[1.5rem]">
    {line.map((span, i) => {
      const cls = STYLE_CLASS[span.style ?? 'plain'];
      if (!span.run) return <span key={i} className={cls}>{span.text}</span>;
      const cmd = span.run;
      return (
        <button
          key={i}
          type="button"
          onClick={(e) => { e.stopPropagation(); onRun(cmd); }}
          className={`${cls} underline decoration-dotted underline-offset-4 hover:bg-[#24283b] cursor-pointer text-left`}
        >
          {span.text}
        </button>
      );
    })}
  </div>
);

interface ShellProps {
  posts?: Post[];
  locale?: Locale;
  // Hidden (but mounted, so the scrollback survives) while the vim viewer is open.
  active?: boolean;
  onExit?: () => void;
  onOpenVi?: (buffer: ViBuffer) => void;
}

const Shell: React.FC<ShellProps> = ({ posts = [], locale = 'es', active = true, onExit, onOpenVi }) => {
  const fs = React.useMemo(() => buildFs(locale, posts), [locale, posts]);
  const [cwd, setCwd] = React.useState('~');
  const [input, setInput] = React.useState('');
  const [history, setHistory] = React.useState<string[]>([]);
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const nextId = React.useRef(1);
  const historyPos = React.useRef<number | null>(null);
  const draft = React.useRef('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const push = (entry: Omit<Entry, 'id'>) =>
    setEntries((prev) => [...prev, { ...entry, id: nextId.current++ }]);

  const banner = React.useMemo(() => {
    const info = run('neofetch', { fs, cwd: '~', locale, posts, history: [] }).lines;
    return [...info, [{ text: '' }], [{ text: welcomeHint(locale), style: 'muted' as const }]] as Line[];
  }, [fs, locale, posts]);

  const goTo = (href: string) => {
    if (href.startsWith('/')) window.location.href = href;
    else window.open(href, '_blank', 'noopener,noreferrer');
  };

  const execute = (raw: string) => {
    const command = raw.trim();
    historyPos.current = null;
    if (!command) { push({ cwd, command: '', lines: [] }); return; }
    const nextHistory = [...history, command];
    setHistory(nextHistory);
    const result = run(command, { fs, cwd, locale, posts, history: nextHistory });
    if (result.effects.some((e) => e.type === 'clear')) setEntries([]);
    else push({ cwd, command, lines: result.lines });
    for (const effect of result.effects) {
      if (effect.type === 'cd') setCwd(effect.cwd);
      else if (effect.type === 'exit') onExit?.();
      else if (effect.type === 'navigate') goTo(effect.href);
      else if (effect.type === 'openVi') onOpenVi?.(effect.buffer);
    }
  };

  const submit = () => { execute(input); setInput(''); };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); return; }
    if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); setEntries([]); return; }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      push({ cwd, command: `${input}^C`, lines: [] });
      setInput('');
      historyPos.current = null;
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0) return;
      if (historyPos.current === null) {
        if (e.key === 'ArrowDown') return;
        draft.current = input;
        historyPos.current = history.length;
      }
      const next = historyPos.current + (e.key === 'ArrowUp' ? -1 : 1);
      if (next >= history.length) { historyPos.current = null; setInput(draft.current); return; }
      historyPos.current = Math.max(0, next);
      setInput(history[historyPos.current]);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const result = complete(input, cwd, fs);
      if (result.candidates.length === 0) return;
      if (result.input !== input) setInput(result.input);
      else if (result.candidates.length > 1) {
        push({ cwd, command: input, lines: [result.candidates.map((c, i) => ({ text: i === 0 ? c : `  ${c}`, style: c.endsWith('/') ? 'dir' as const : 'plain' as const }))] });
      }
    }
  };

  // Keep the newest output in view.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, active]);

  // Focus on open and on returning from the viewer, but not on touch devices, where it would pop the keyboard.
  React.useEffect(() => {
    if (active && window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, [active]);

  const focusInput = () => {
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  };

  const quick = quickActions(locale, cwd);

  return (
    <div className={`${active ? 'flex' : 'hidden'} fixed inset-0 z-[100] items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-8`}>
      <div className="w-full h-full md:max-h-[85vh] max-w-5xl bg-[#1a1b26] text-[#a9b1d6] flex flex-col font-mono overflow-hidden selection:bg-[#515c7e] selection:text-white rounded-xl shadow-2xl border border-[#414868] terminal-view">
        <div className="w-full bg-[#16161e] border-b border-[#414868] flex items-center justify-between text-xs md:text-sm px-3 py-2 select-none">
          <span className="truncate text-[#828bb8]">fran@fullfran: {cwd}</span>
          <button type="button" onClick={() => onExit?.()} className="flex items-center text-[#c0caf5] hover:text-white px-2 py-1">
            <LogOut size={12} className="mr-1" />{locale === 'en' ? 'exit' : 'salir'}
          </button>
        </div>

        <div ref={scrollRef} onClick={focusInput} className="flex-grow min-h-0 overflow-y-auto overflow-x-hidden p-3 md:p-6 text-sm md:text-base leading-6 cursor-text">
          {[{ id: 0, cwd: null, command: '', lines: banner } as Entry, ...entries].map((entry) => (
            <div key={entry.id}>
              {entry.cwd !== null && (
                <div className="whitespace-pre-wrap break-words">
                  <Prompt cwd={entry.cwd} />
                  <span className="text-[#c0caf5]">{entry.command}</span>
                </div>
              )}
              {entry.lines.map((line, i) => <OutputLine key={i} line={line} onRun={execute} />)}
            </div>
          ))}
          <label className="flex items-baseline">
            <Prompt cwd={cwd} />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); historyPos.current = null; }}
              onKeyDown={onKeyDown}
              aria-label={locale === 'en' ? 'Terminal input' : 'Entrada de la terminal'}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="go"
              placeholder={placeholder(locale)}
              className="flex-grow min-w-0 bg-transparent outline-none border-none text-[#c0caf5] caret-[#c0caf5] placeholder:text-[#565f89] font-mono text-sm md:text-base p-0"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[#414868] bg-[#16161e] px-3 py-2">
          {quick.map(({ label, command }) => (
            <button
              key={label}
              type="button"
              title={command}
              onClick={() => execute(command)}
              className="rounded-md border border-[#414868] px-3 py-1.5 text-xs md:text-sm text-[#7dcfff] hover:bg-[#24283b] active:bg-[#24283b]"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shell;
