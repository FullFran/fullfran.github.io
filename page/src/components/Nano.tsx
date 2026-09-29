import * as React from 'react';
import type { Locale } from '../data/site';

const COPY = {
  es: {
    readOnly: '[ Solo lectura ]',
    help: '[ Solo lectura: ^X salir, ^W buscar, ^Y ^V paginar ]',
    search: 'Buscar: ',
    found: (q: string) => `[ Encontrado "${q}" ]`,
    missing: (q: string) => `[ "${q}" no encontrado ]`,
    rows: [
      [['^G', 'Ayuda'], ['^W', 'Buscar'], ['^X', 'Salir']],
      [['^Y', 'Pág. ant.'], ['^V', 'Pág. sig.']],
    ],
  },
  en: {
    readOnly: '[ Read only ]',
    help: '[ Read only: ^X exit, ^W search, ^Y ^V page ]',
    search: 'Search: ',
    found: (q: string) => `[ Found "${q}" ]`,
    missing: (q: string) => `[ "${q}" not found ]`,
    rows: [
      [['^G', 'Help'], ['^W', 'Where Is'], ['^X', 'Exit']],
      [['^Y', 'Prev Page'], ['^V', 'Next Page']],
    ],
  },
} as const;

interface NanoProps {
  name: string;
  lines: string[];
  locale?: Locale;
  onReturnToShell: () => void;
}

// Read-only nano look-alike opened by `nano <file>` in the shell.
const Nano: React.FC<NanoProps> = ({ name, lines, locale = 'es', onReturnToShell }) => {
  const t = COPY[locale];
  const [status, setStatus] = React.useState('');
  const [query, setQuery] = React.useState<string | null>(null);
  const [hit, setHit] = React.useState<number | null>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const page = (dir: 1 | -1) => bodyRef.current?.scrollBy({ top: dir * bodyRef.current.clientHeight * 0.9 });

  const find = (q: string) => {
    if (!q) { setQuery(null); return; }
    const from = hit === null ? 0 : hit + 1;
    const order = [...lines.keys()].slice(from).concat([...lines.keys()].slice(0, from));
    const at = order.find((i) => lines[i].toLowerCase().includes(q.toLowerCase()));
    setQuery(null);
    if (at === undefined) { setStatus(t.missing(q)); return; }
    setHit(at);
    setStatus(t.found(q));
    bodyRef.current?.querySelector(`[data-line="${at}"]`)?.scrollIntoView({ block: 'center' });
  };

  const openSearch = () => { setQuery(''); setStatus(''); };

  React.useEffect(() => {
    if (query !== null) searchRef.current?.focus();
  }, [query === null]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (query !== null) return; // the search input handles its own keys
      const key = e.key.toLowerCase();
      if (e.ctrlKey && key === 'x') { e.preventDefault(); onReturnToShell(); return; }
      if (e.ctrlKey && key === 'w') { e.preventDefault(); openSearch(); return; }
      if (e.ctrlKey && key === 'g') { e.preventDefault(); setStatus(t.help); return; }
      if (e.ctrlKey && key === 'y') { e.preventDefault(); page(-1); return; }
      if (e.ctrlKey && key === 'v') { e.preventDefault(); page(1); return; }
      if (e.key === 'Escape' || (!e.ctrlKey && !e.metaKey && !e.altKey && key === 'q')) { e.preventDefault(); onReturnToShell(); return; }
      if (key === '/') { e.preventDefault(); openSearch(); return; }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) setStatus(t.readOnly);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const actions: Record<string, () => void> = {
    '^G': () => setStatus(t.help),
    '^W': openSearch,
    '^X': onReturnToShell,
    '^Y': () => page(-1),
    '^V': () => page(1),
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-8">
      <div className="w-full h-full md:max-h-[85vh] max-w-5xl bg-[#1a1b26] text-[#a9b1d6] flex flex-col font-mono overflow-hidden rounded-xl shadow-2xl border border-[#414868] terminal-view text-sm md:text-base">
        <div className="bg-[#a9b1d6] text-[#1a1b26] px-3 py-1 flex justify-between gap-3 select-none">
          <span className="whitespace-nowrap">GNU nano 8.0</span>
          <span className="truncate font-bold">{name}</span>
          <span className="whitespace-nowrap hidden sm:inline">{locale === 'en' ? 'Read only' : 'Solo lectura'}</span>
        </div>

        <div ref={bodyRef} className="flex-grow min-h-0 overflow-y-auto overflow-x-hidden px-3 py-2 leading-6">
          {lines.map((text, i) => (
            <div key={i} data-line={i} className={`whitespace-pre-wrap break-words min-h-[1.5rem] ${hit === i ? 'bg-[#e0af68] text-[#1a1b26]' : ''}`}>{text}</div>
          ))}
        </div>

        <div className="h-7 px-3 flex items-center justify-center text-[#c0caf5] select-none">
          {query !== null ? (
            <label className="flex w-full items-center">
              <span className="whitespace-nowrap">{t.search}</span>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); find(query); }
                  else if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'c')) { e.preventDefault(); setQuery(null); }
                  e.stopPropagation();
                }}
                className="flex-grow min-w-0 bg-transparent outline-none border-none text-[#c0caf5] font-mono p-0"
                aria-label={t.search}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </label>
          ) : (
            <span className="bg-[#3b4261] px-2">{status}</span>
          )}
        </div>

        <div className="border-t border-[#414868] bg-[#16161e] px-3 py-1 text-xs md:text-sm">
          {t.rows.map((row, r) => (
            <div key={r} className="flex flex-wrap gap-x-4">
              {row.map(([key, label]) => (
                <button key={key} type="button" onClick={actions[key]} className="flex items-center gap-1.5 py-1 hover:text-white">
                  <span className="bg-[#a9b1d6] text-[#1a1b26] px-1 font-bold">{key}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nano;
