import { FileText, Folder, GitBranch, HelpCircle, Keyboard, LogOut, Undo2, User, Wifi } from 'lucide-react';
import * as React from 'react';
import { links, site } from '../data/site';
import type { Locale, Post } from '../data/site';

// --- TYPES ---
type TabId = 'about' | 'blog' | 'contact' | 'help';
type LineAction = { href?: string; slug?: string };
type Buffer = { lines: string[]; actions: Record<number, LineAction> };

// --- THEME ---
const THEME = { bg: 'bg-[#1a1b26]', bgDark: 'bg-[#16161e]', fg: 'text-[#a9b1d6]', fgDark: 'text-[#828bb8]', blue: 'text-[#7aa2f7]', cyan: 'text-[#7dcfff]', purple: 'text-[#bb9af7]', green: 'text-[#9ece6a]', red: 'text-[#f7768e]', yellow: 'text-[#e0af68]', orange: 'text-[#ff9e64]', selection: 'bg-[#2e3c64]', cursor: 'bg-[#a9b1d6]', border: 'border-[#414868]' };

// --- COPY ---
const UI: Record<Locale, { blogIntro: string; blogHint: string; empty: string; web: string; back: string; exit: string; help: string[] }> = {
  es: {
    blogIntro: 'Notas sobre IA, física, teclados y lo que se cruce.',
    blogHint: 'Enter abre el post bajo el cursor. También: :e <trozo del título>',
    empty: 'Todavía no hay posts.',
    web: 'Versión web:',
    back: 'volver',
    exit: 'salir',
    help: [
      '# Ayuda',
      'Esto es la misma página, pero interactiva. Todo se puede leer y pulsar.',
      '## Movimiento',
      '- h j k l o flechas: moverse',
      '- w / b: palabra siguiente / anterior',
      '- 0 / $: inicio / fin de línea',
      '- gg / G: principio / final del buffer',
      '- 5j, 3w...: repetir con un número delante',
      '- v: modo visual (Esc para salir)',
      '## Buffers',
      '- Ctrl+h / Ctrl+l: pestaña anterior / siguiente',
      '- Clic o toque en una pestaña para cambiar',
      '## Blog',
      '- Enter en una línea del blog: abre el post',
      '- Enter en una línea con enlace: lo abre',
      '- q, Esc o Backspace: volver a la lista',
      '## Comandos',
      '- :about, :blog, :contact, :help: cambiar de buffer',
      '- :e <slug>, :open <slug>: abre un post (vale un trozo del slug o del título)',
      '- :cv: ir al CV',
      '- :q: volver atrás, o salir de la terminal',
    ],
  },
  en: {
    blogIntro: 'Notes on AI, physics, keyboards, and whatever else comes up.',
    blogHint: 'Enter opens the post under the cursor. Also: :e <part of the title>',
    empty: 'No posts yet.',
    web: 'Web version:',
    back: 'back',
    exit: 'exit',
    help: [
      '# Help',
      'This is the same page, but interactive. Everything can be read and clicked.',
      '## Motion',
      '- h j k l or arrows: move',
      '- w / b: next / previous word',
      '- 0 / $: start / end of line',
      '- gg / G: top / bottom of the buffer',
      '- 5j, 3w...: repeat with a count',
      '- v: visual mode (Esc to leave)',
      '## Buffers',
      '- Ctrl+h / Ctrl+l: previous / next tab',
      '- Click or tap a tab to switch',
      '## Blog',
      '- Enter on a blog line: open the post',
      '- Enter on a line with a link: follow it',
      '- q, Esc or Backspace: back to the list',
      '## Commands',
      '- :about, :blog, :contact, :help: switch buffer',
      '- :e <slug>, :open <slug>: open a post (part of the slug or title works)',
      '- :cv: go to the CV',
      '- :q: go back, or leave the terminal',
    ],
  },
};

// --- BUFFER BUILDERS ---
const stripFrontmatter = (body: string) => body.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

// Turn raw markdown into terminal lines: no frontmatter, blank runs collapsed, math kept raw.
const markdownToLines = (body: string): string[] => {
  const out: string[] = [];
  for (const raw of stripFrontmatter(body).split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (line === '' && (out.length === 0 || out[out.length - 1] === '')) continue;
    out.push(line);
  }
  while (out.length && out[out.length - 1] === '') out.pop();
  return out;
};

const buildAbout = (locale: Locale): Buffer => {
  const copy = site[locale];
  const lines = [`# ${copy.aboutTitle}`, '', ...copy.about.flatMap((p) => [p, '']), copy.nowCommand, ...copy.now.map((n) => `- ${n}`)];
  return { lines, actions: {} };
};

const buildBlog = (locale: Locale, posts: Post[]): Buffer => {
  const ui = UI[locale];
  const lines = ['# Blog', ui.blogIntro, ''];
  const actions: Record<number, LineAction> = {};
  if (posts.length === 0) lines.push(ui.empty);
  posts.forEach((p) => {
    actions[lines.length] = { slug: p.slug };
    lines.push(`${p.date.slice(0, 10)}  ${p.title}`);
  });
  lines.push('', ui.blogHint);
  return { lines, actions };
};

const buildContact = (locale: Locale): Buffer => {
  const copy = site[locale];
  const lines = [`# ${copy.contactTitle}`, copy.contactText, ''];
  const actions: Record<number, LineAction> = {};
  links.forEach((l) => {
    actions[lines.length] = { href: l.href };
    lines.push(`${l.label.padEnd(9)}${l.href.replace('mailto:', '')}`);
  });
  return { lines, actions };
};

const buildPost = (locale: Locale, post: Post): Buffer => {
  const lines = [`# ${post.title}`, post.date.slice(0, 10), '', ...markdownToLines(post.body), '', `${UI[locale].web} /blog/${post.slug}/`];
  return { lines, actions: { [lines.length - 1]: { href: `/blog/${post.slug}/` } } };
};

// --- HELPERS & RENDERERS ---
const LineNumbers = ({ count, cursorLine }: { count: number, cursorLine: number }) => (
  <div className={`flex flex-col text-right pr-4 select-none ${THEME.fgDark} font-mono text-sm w-12 flex-shrink-0`}>
    {Array.from({ length: count }).map((_, i) => <span key={i} className={`leading-6 relative ${i === cursorLine ? 'text-[#c0caf5]' : ''}`}>{i + 1}</span>)}
  </div>
);

const MarkdownRenderer = ({ lines, actions, cursor, visual, mode, onLineClick }: { lines: string[]; actions: Record<number, LineAction>; cursor: [number, number]; visual: [[number, number], [number, number]] | null; mode: string; onLineClick: (line: number) => void; }) => {
  const isSelected = (line: number, char: number) => {
    if (mode !== 'VISUAL' || !visual) return false;
    const [start, end] = [visual[0], visual[1]].sort((a,b) => a[0] - b[0] || a[1] - b[1]);
    if (line < start[0] || line > end[0]) return false;
    if (line > start[0] && line < end[0]) return true;
    if (start[0] === end[0]) return line === start[0] && char >= start[1] && char < end[1];
    if (line === start[0]) return char >= start[1];
    if (line === end[0]) return char < end[1];
    return false;
  };
  const renderLineContent = (line: string, lineIndex: number) => {
    const isCursorLine = lineIndex === cursor[0];
    return (<>
      {line.split('').map((char, charIndex) => (
        <span key={charIndex} className={`${isSelected(lineIndex, charIndex) ? THEME.selection : ''} ${isCursorLine && charIndex === cursor[1] ? `${THEME.cursor} text-[#1a1b26]` : ''}`}>
          {char}
        </span>
      ))}
      {isCursorLine && line.length === cursor[1] && <span className={`${THEME.cursor} text-[#1a1b26]`}>&nbsp;</span>}
    </>);
  };
  return (
    <div className={`font-mono text-sm md:text-base leading-6 whitespace-pre-wrap break-words ${THEME.fg}`}>
      {lines.map((line, i) => {
          const common = { 'data-line': i, onClick: () => onLineClick(i) };
          if (actions[i]) return <div key={i} {...common} className={`${THEME.cyan} underline decoration-dotted cursor-pointer hover:bg-[#24283b] py-0.5`}>{renderLineContent(line, i)}</div>;
          if (line.startsWith('# ')) return <div key={i} {...common} className={`${THEME.purple} font-bold text-xl mt-4 mb-2`}>{renderLineContent(line, i)}</div>;
          if (line.startsWith('## ')) return <div key={i} {...common} className={`${THEME.blue} font-bold text-lg mt-3 mb-1`}>{renderLineContent(line, i)}</div>;
          if (line.startsWith('### ')) return <div key={i} {...common} className={`${THEME.cyan} font-bold mt-2`}>{renderLineContent(line, i)}</div>;
          if (line.startsWith('$ ')) return <div key={i} {...common} className={`${THEME.green} font-bold mt-2`}>{renderLineContent(line, i)}</div>;
          if (line.startsWith('> ')) return <div key={i} {...common} className={`${THEME.green} italic pl-4 border-l-2 border-[#9ece6a] my-2`}>{renderLineContent(line, i)}</div>;
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) return <div key={i} {...common} className="pl-4">{renderLineContent(line, i)}</div>;
          return <div key={i} {...common} className="min-h-[1.5rem]">{renderLineContent(line, i)}</div>;
      })}
    </div>
  );
};

// --- VIM WORD MOVEMENT HELPERS ---
const isWordChar = (char: string) => char && /\w/.test(char);

const findNextWord = (lines: string[], cursor: [number, number]): [number, number] => {
    let [line, char] = cursor;
    if (line >= lines.length) return cursor;
    
    const currentLine = lines[line];
    
    // If we're on a word char, skip to end of current word
    if (char < currentLine.length && isWordChar(currentLine[char])) {
        while (char < currentLine.length && isWordChar(currentLine[char])) {
            char++;
        }
    }
    
    // Skip non-word characters (whitespace, punctuation)
    while (line < lines.length) {
        while (char < lines[line].length) {
            if (isWordChar(lines[line][char])) {
                return [line, char]; // Found start of next word
            }
            char++;
        }
        // Move to next line
        line++;
        char = 0;
    }
    
    // If we reached the end, return last valid position
    return [Math.max(0, lines.length - 1), 0];
};

const findPrevWord = (lines: string[], cursor: [number, number]): [number, number] => {
    let [line, char] = cursor;
    
    // Move back one to start searching
    char--;
    
    while (line >= 0) {
        // Skip non-word characters backwards
        while (char >= 0 && !isWordChar(lines[line][char])) {
            char--;
        }
        
        if (char < 0) {
            line--;
            if (line >= 0) char = lines[line].length - 1;
            continue;
        }
        
        // Now we're on a word char, find the start of this word
        while (char > 0 && isWordChar(lines[line][char - 1])) {
            char--;
        }
        
        return [line, char];
    }
    
    return [0, 0];
};

// --- APP PRINCIPAL ---
interface PortfolioProps {
  posts?: Post[];
  locale?: Locale;
  onExitTerminal?: () => void;
}

const TABS_ORDER: TabId[] = ['about', 'blog', 'contact', 'help'];

const App: React.FC<PortfolioProps> = ({ posts = [], locale = 'es', onExitTerminal }) => {
  const [activeTab, setActiveTab] = React.useState<TabId>('about');
  const [mode, setMode] = React.useState<'NORMAL'|'VISUAL'|'COMMAND'>('NORMAL');
  const [commandBuffer, setCommandBuffer] = React.useState('');
  const [cursor, setCursor] = React.useState<[number, number]>([0, 0]);
  const [visual, setVisual] = React.useState<[[number,number],[number,number]] | null>(null);
  const [openSlug, setOpenSlug] = React.useState<string | null>(null);
  const [count, setCount] = React.useState('');
  const [gBuffer, setGBuffer] = React.useState(false); // Separate buffer for 'gg' command
  const contentRef = React.useRef<HTMLDivElement>(null);
  const ui = UI[locale];
  const copy = site[locale];

  const openPost = openSlug ? posts.find((p) => p.slug === openSlug) ?? null : null;
  const reading = activeTab === 'blog' && openPost !== null;

  const buffer: Buffer = React.useMemo(() => {
    if (activeTab === 'help') return { lines: ui.help, actions: {} };
    if (activeTab === 'contact') return buildContact(locale);
    if (activeTab === 'blog') return openPost ? buildPost(locale, openPost) : buildBlog(locale, posts);
    return buildAbout(locale);
  }, [activeTab, openPost, posts, locale, ui]);

  const switchTab = (tab: TabId) => { setActiveTab(tab); setOpenSlug(null); };
  const cycleTab = (direction: number) => {
    const i = TABS_ORDER.indexOf(activeTab);
    switchTab(TABS_ORDER[(i + direction + TABS_ORDER.length) % TABS_ORDER.length]);
  };
  const goBack = () => setOpenSlug(null);
  const exitTerminal = () => { if (onExitTerminal) onExitTerminal(); };
  const goTo = (href: string) => {
    if (href.startsWith('/')) window.location.href = href;
    else window.open(href, '_blank', 'noopener,noreferrer');
  };
  const activateLine = (line: number) => {
    const action = buffer.actions[line];
    if (!action) return;
    if (action.slug) { setActiveTab('blog'); setOpenSlug(action.slug); }
    else if (action.href) goTo(action.href);
  };
  const openByQuery = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = posts.find((p) => p.slug === q) ?? posts.find((p) => p.slug.includes(q) || p.title.toLowerCase().includes(q));
    if (match) { setActiveTab('blog'); setOpenSlug(match.slug); }
  };

  // Re-registered every render so the handler always sees fresh state.
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mode === 'NORMAL' && !visual && !count && reading) goBack();
        setMode('NORMAL'); setVisual(null); setCommandBuffer(''); setCount(''); e.preventDefault(); return;
      }
      if (e.ctrlKey) {
          if (e.key === 'h' || e.key === 'ArrowLeft') cycleTab(-1);
          else if (e.key === 'l' || e.key === 'ArrowRight') cycleTab(1);
          e.preventDefault();
          return;
      }
      if (mode === 'COMMAND') {
        if (e.key === 'Enter') { executeCommand(commandBuffer); setMode('NORMAL'); setCommandBuffer(''); }
        else if (e.key === 'Backspace') { setCommandBuffer(p => p.slice(0, -1)); if (commandBuffer.length <= 1) setMode('NORMAL'); }
        else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) setCommandBuffer(p => p + e.key);
        e.preventDefault();
        return;
      }

      // Handle count prefix for multipliers (1-9 start counts, 0 only adds to existing count)
      if (/[1-9]/.test(e.key)) { setCount(c => c + e.key); return; }
      if (e.key === '0' && count.length > 0) { setCount(c => c + e.key); return; }
      // If '0' with no count prefix, it falls through to the switch statement (go to line start)
      e.preventDefault();

      const lines = buffer.lines;
      const maxLines = Math.max(0, lines.length - 1);
      const effectiveCount = parseInt(count, 10) || 1;

      const updateCursor = (getNewPos: (c: [number, number]) => [number, number]) => {
          let newPos = [...cursor] as [number, number];
          for(let i=0; i<effectiveCount; i++) newPos = getNewPos(newPos);
          const [line, char] = newPos;
          const clampedLine = Math.max(0, Math.min(line, maxLines));
          const maxChars = lines[clampedLine]?.length || 0;
          const clampedChar = Math.max(0, Math.min(char, maxChars));
          setCursor([clampedLine, clampedChar]);
          if(mode === 'VISUAL') setVisual(v => v ? [v[0], [clampedLine, clampedChar]] : null);
          setCount('');
          setCommandBuffer('');
      };

      const motionKey = e.key;

      // Handle 'gg' command with separate gBuffer
      if (motionKey === 'g') {
        if (gBuffer) {
          updateCursor(() => [0, 0]);
          setGBuffer(false);
        } else {
          setGBuffer(true);
        }
        return;
      }

      // Clear gBuffer if any other key is pressed
      if (gBuffer) setGBuffer(false);

      switch (motionKey) {
        case 'j': case 'ArrowDown': updateCursor(c => [c[0] + 1, c[1]]); break;
        case 'k': case 'ArrowUp': updateCursor(c => [c[0] - 1, c[1]]); break;
        case 'h': case 'ArrowLeft': updateCursor(c => [c[0], c[1] - 1]); break;
        case 'l': case 'ArrowRight': updateCursor(c => [c[0], c[1] + 1]); break;
        case 'w': updateCursor(c => findNextWord(lines, c)); break;
        case 'b': updateCursor(c => findPrevWord(lines, c)); break;
        case 'G': updateCursor(() => [maxLines, 0]); break;
        case '0': updateCursor(c => [c[0], 0]); break; // Go to beginning of line
        case '$': updateCursor(c => [c[0], lines[c[0]]?.length || 0]); break; // Go to end of line
        case 'v': if (mode === 'NORMAL') { setMode('VISUAL'); setVisual([cursor, cursor]); } else { setMode('NORMAL'); setVisual(null); } break;
        case 'Enter': activateLine(cursor[0]); break;
        case 'Backspace': if (reading) goBack(); break;
        case 'q': if (reading) goBack(); break;
        case ':': setMode('COMMAND'); setCommandBuffer(':'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.replace(':', '').trim().split(' ');
    switch(command) {
        case 'q': case 'quit':
          if (reading) goBack();
          else exitTerminal();
          break;
        case 'e': case 'edit': case 'open': openByQuery(args.join(' ')); break;
        case 'cv': goTo('/cv'); break;
        case 'about': switchTab('about'); break;
        case 'blog': switchTab('blog'); break;
        case 'contact': switchTab('contact'); break;
        case 'help': switchTab('help'); break;
    }
  };

  React.useEffect(() => { setCursor([0,0]); setVisual(null); setMode('NORMAL'); setCount(''); setGBuffer(false); contentRef.current?.scrollTo({ top: 0 }); }, [activeTab, openSlug]);

  // Keep the cursor line in view (lines can wrap, so measure the element instead of assuming a height).
  React.useEffect(() => {
    const container = contentRef.current;
    const el = container?.querySelector<HTMLElement>(`[data-line="${cursor[0]}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const tabs = [
    { id: 'about', label: copy.aboutFile, icon: User },
    { id: 'blog', label: '~/blog', icon: Folder },
    { id: 'contact', label: locale === 'en' ? 'contact.md' : 'contacto.md', icon: Wifi },
    { id: 'help', label: 'help.txt', icon: HelpCircle },
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className={`w-full h-full max-w-7xl max-h-[85vh] ${THEME.bg} ${THEME.fg} flex flex-col font-mono overflow-hidden selection:bg-[#515c7e] selection:text-white rounded-xl shadow-2xl border border-[#414868] terminal-view`}>
      <div className={`w-full ${THEME.bgDark} border-b ${THEME.border} flex items-center text-sm overflow-x-auto no-scrollbar`}>
        {tabs.map((t, i) => <button key={t.id} onClick={() => switchTab(t.id)} className={`flex items-center px-4 py-2 border-r ${THEME.border} transition-colors whitespace-nowrap ${activeTab === t.id ? `${THEME.bg} ${THEME.purple}` : 'text-[#828bb8] hover:text-[#c0caf5] hover:bg-[#24283b]'}`}><span className="mr-2 text-xs text-[#828bb8]">[{i + 1}]</span><t.icon size={14} className="mr-2" />{t.label}</button>)}
        <div className="flex-grow" />
        <div className="px-4 text-xs text-[#828bb8] hidden md:flex items-center whitespace-nowrap"><span className="mr-4 flex items-center"><Keyboard size={12} className="mr-1" /> 34-key layout</span><span className="mr-4">linux</span></div>
      </div>
      <div className="flex-grow flex relative overflow-hidden">
        <div className={`hidden md:block py-4 ${THEME.bgDark} border-r ${THEME.border}`}><LineNumbers count={buffer.lines.length} cursorLine={cursor[0]} /></div>
        <div ref={contentRef} className="flex-grow min-w-0 overflow-y-auto overflow-x-hidden p-4 md:p-8 outline-none">
          <MarkdownRenderer lines={buffer.lines} actions={buffer.actions} cursor={cursor} visual={visual} mode={mode} onLineClick={(i) => { setCursor([i, 0]); activateLine(i); }} />
        </div>
      </div>
      <div className={`w-full h-8 ${THEME.bgDark} border-t ${THEME.border} flex items-center text-xs md:text-sm select-none z-10`}>
         <div className={`px-3 h-full flex items-center font-bold text-[#15161e] transition-colors duration-200 ${mode === 'NORMAL' ? 'bg-[#7aa2f7]' : ''} ${mode === 'VISUAL' ? 'bg-[#bb9af7]' : ''} ${mode === 'COMMAND' ? 'bg-[#e0af68]' : ''}`}>
          {mode} {count} {visual ? `(${Math.abs(visual[0][0] - visual[1][0]) + 1}L)` : ''}
        </div>
        <div className="px-3 h-full items-center bg-[#3b4261] text-[#a9c4fb] hidden sm:flex"><GitBranch size={12} className="mr-1" /> main</div>
        <div className="px-3 h-full flex items-center text-[#a9b1d6] flex-grow min-w-0 truncate">{reading ? `~/blog/${openSlug}` : tabs.find(t => t.id === activeTab)?.label}</div>
        <div className="px-2 text-[#a9b1d6] hidden sm:block">{`${cursor[0]+1}:${cursor[1]+1}`}</div>
        {reading && <button onClick={goBack} className="px-3 h-full flex items-center bg-[#3b4261] text-[#a9b1d6] hover:text-white"><Undo2 size={12} className="mr-1" />{ui.back}</button>}
        <button onClick={exitTerminal} className="px-3 h-full flex items-center bg-[#414868] text-[#c0caf5] hover:text-white"><LogOut size={12} className="mr-1" />{ui.exit}</button>
      </div>
       {mode === 'COMMAND' && <div className="absolute left-0 bottom-8 w-full bg-[#16161e] p-2 border-t border-[#414868] text-[#a9b1d6] shadow-lg">{commandBuffer}<span className="animate-pulse block w-2 h-4 bg-white inline-block ml-1 align-middle" /></div>}
      </div>
    </div>
  );
};
// --- ROOT ---
export default App;
