import {
    Cpu,
    FileText,
    Folder,
    GitBranch,
    HelpCircle,
    Keyboard,
    Lock,
    Terminal,
    Trash2,
    Unlock,
    User,
    Wifi,
} from 'lucide-react';
import * as React from 'react';

// --- TYPES ---
type BlogPost = { id: string; title: string; date: string; content: string; };
type PortfolioData = { about: string; experience: string; skills: string; contact: string; blog: BlogPost[]; help: string; };

// --- STORAGE & DEFAULTS ---
import portfolioDataJson from '../data/portfolio.json';

const STORAGE_KEY = 'fullfran_portfolio_content_v1';
const DEFAULT_DATA: PortfolioData = portfolioDataJson as PortfolioData;

// --- THEME ---
const THEME = { bg: 'bg-[#1a1b26]', bgDark: 'bg-[#16161e]', fg: 'text-[#a9b1d6]', fgDark: 'text-[#565f89]', blue: 'text-[#7aa2f7]', cyan: 'text-[#7dcfff]', purple: 'text-[#bb9af7]', green: 'text-[#9ece6a]', red: 'text-[#f7768e]', yellow: 'text-[#e0af68]', orange: 'text-[#ff9e64]', selection: 'bg-[#2e3c64]', cursor: 'bg-[#a9b1d6]', border: 'border-[#414868]' };

// --- HELPERS & RENDERERS ---
const LineNumbers = ({ count, cursorLine }: { count: number, cursorLine: number }) => (
  <div className={`flex flex-col text-right pr-4 select-none ${THEME.fgDark} font-mono text-sm opacity-50 w-12 flex-shrink-0`}>
    {Array.from({ length: count }).map((_, i) => <span key={i} className={`leading-6 relative ${i === cursorLine ? 'text-[#c0caf5]' : ''}`}>{i + 1}</span>)}
  </div>
);

const MarkdownRenderer = ({ content, cursor, visual, mode }: { content: string; cursor: [number, number]; visual: [[number, number], [number, number]] | null; mode: string; }) => {
  const lines = content.trim().split('\n');
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
        <span key={charIndex} className={`${isSelected(lineIndex, charIndex) ? THEME.selection : ''} ${isCursorLine && charIndex === cursor[1] && mode !== 'INSERT' ? `${THEME.cursor} text-[#1a1b26]` : ''}`}>
          {char}
        </span>
      ))}
      {isCursorLine && line.length === cursor[1] && mode !== 'INSERT' && <span className={`${THEME.cursor} text-[#1a1b26]`}>&nbsp;</span>}
    </>);
  };
  return (
    <div className={`font-mono text-sm md:text-base leading-6 whitespace-pre-wrap ${THEME.fg}`}>
      {lines.map((line, i) => {
          if (line.startsWith('# ')) return <div key={i} className={`${THEME.purple} font-bold text-xl mt-4 mb-2`}>{renderLineContent(line, i)}</div>;
          if (line.startsWith('## ')) return <div key={i} className={`${THEME.blue} font-bold text-lg mt-3 mb-1`}>{renderLineContent(line, i)}</div>;
          if (line.startsWith('### ')) return <div key={i} className={`${THEME.cyan} font-bold mt-2`}>{renderLineContent(line, i)}</div>;
          if (line.startsWith('> ')) return <div key={i} className={`${THEME.green} italic pl-4 border-l-2 border-[#9ece6a] my-2`}>{renderLineContent(line, i)}</div>;
          if (line.trim().startsWith('- ')) return <div key={i} className="pl-4"><span className={THEME.orange}>•</span> {renderLineContent(line.substring(2), i)}</div>;
          if (line.trim().startsWith('* ')) return <div key={i} className="pl-4"><span className={THEME.yellow}>*</span> {renderLineContent(line.substring(2), i)}</div>;
          
          return <div key={i} className="min-h-[1.5rem]">{renderLineContent(line, i)}</div>;
      })}
      {mode === 'NORMAL' && lines.length -1 === cursor[0] && <span className="inline-block w-2.5 h-5 bg-[#a9b1d6] animate-pulse align-middle ml-1" />}
    </div>
  );
};

// --- VIM WORD MOVEMENT HELPERS ---
const isWordChar = (char: string) => char && /\w/.test(char);

const findNextWord = (lines: string[], cursor: [number, number]): [number, number] => {
    let [line, char] = cursor;
    let foundNonWhitespace = false;
    if (line >= lines.length) return cursor;
    
    while (line < lines.length) {
        char++;
        if (char >= lines[line].length) {
            line++;
            char = 0;
            if (line >= lines.length) return cursor;
        }

        const charIsWord = isWordChar(lines[line][char]);
        if (charIsWord && !foundNonWhitespace) {
            return [line, char];
        }
        foundNonWhitespace = charIsWord;
    }
    return cursor;
};

const findPrevWord = (lines: string[], cursor: [number, number]): [number, number] => {
    let [line, char] = cursor;
    
    char--; 

    while (line >= 0) {
        while (char >= 0) {
            if (isWordChar(lines[line][char]) && (char === 0 || !isWordChar(lines[line][char - 1]))) {
                return [line, char];
            }
            char--;
        }
        line--;
        if (line >= 0) char = lines[line].length - 1;
    }
    return [0,0];
};

// --- APP PRINCIPAL ---
interface PortfolioProps {
  onExitTerminal?: () => void;
}

const App: React.FC<PortfolioProps> = ({ onExitTerminal }) => {
  const [data, setData] = React.useState<PortfolioData>(DEFAULT_DATA);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'about'|'experience'|'skills'|'contact'|'blog'|'help'>('about');
  const [mode, setMode] = React.useState<'NORMAL'|'INSERT'|'VISUAL'|'COMMAND'>('NORMAL');
  const [commandBuffer, setCommandBuffer] = React.useState('');
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [cursor, setCursor] = React.useState<[number, number]>([0, 0]);
  const [visual, setVisual] = React.useState<[[number,number],[number,number]] | null>(null);
  const [activeBlogPostId, setActiveBlogPostId] = React.useState<string | null>(null);
  const [count, setCount] = React.useState('');

  React.useEffect(() => { try { const raw = window.localStorage.getItem(STORAGE_KEY); if (raw) { const p = JSON.parse(raw); setData({ ...DEFAULT_DATA, ...p, blog: p.blog ?? DEFAULT_DATA.blog, help: p.help ?? DEFAULT_DATA.help }); }} catch {} setLoading(false); }, []);

  const persist = (newData: PortfolioData) => { setData(newData); try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newData)); } catch {} };
  const getCurrentContent = () => {
    if (activeTab === 'blog') return activeBlogPostId ? (data.blog.find(p => p.id === activeBlogPostId)?.content || '') : '';
    if (activeTab === 'help') return data.help;
    return data[activeTab] || '';
  }
  const handleContentChange = (newContent: string) => {
    if (activeTab === 'blog' && activeBlogPostId) persist({...data, blog: data.blog.map(p => p.id === activeBlogPostId ? {...p, content: newContent} : p)});
    else if (activeTab === 'help') persist({...data, help: newContent});
    else if (activeTab !== 'blog') persist({...data, [activeTab]: newContent});
  };
  const handleSave = () => { if (!isAdmin) return; setMode('COMMAND'); setCommandBuffer(`[Content Saved]`); setTimeout(() => { setCommandBuffer(''); setMode('NORMAL'); }, 1500);};
  const handleCreatePost = (filename: string) => { if (!isAdmin || !filename) return; persist({ ...data, blog: [...data.blog, { id: filename.replace(/\s/g,'-').toLowerCase(), title: filename, date: new Date().toISOString().split('T')[0], content: `# ${filename}` }] }); };
  const handleDeletePost = (id: string) => { if (!isAdmin || !window.confirm(`Delete ${id}?`)) return; persist({ ...data, blog: data.blog.filter((p) => p.id !== id) }); if (activeBlogPostId === id) setActiveBlogPostId(null); };
  
  const cycleTab = (direction: number) => {
    const tabsOrder: Array<typeof activeTab> = ['about', 'experience', 'skills', 'contact', 'blog', 'help'];
    const i = tabsOrder.indexOf(activeTab);
    const next = (i + direction + tabsOrder.length) % tabsOrder.length;
    setActiveTab(tabsOrder[next]);
    setActiveBlogPostId(null);
  };
  
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAdminLogin) return;
      if (e.key === 'Escape') { setMode('NORMAL'); setVisual(null); setCommandBuffer(''); setCount(''); e.preventDefault(); return; }
      if (mode === 'INSERT') return;
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

      if (count.length === 0 && e.key === '0' && commandBuffer !== 'g') { e.preventDefault(); return; }
      if (/[0-9]/.test(e.key)) { setCount(c => c + e.key); return; }
      e.preventDefault();
      
      const lines = getCurrentContent().split('\n');
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
      if (motionKey === 'g' && commandBuffer === 'g') { updateCursor(() => [0,0]); return; }
      if (motionKey === 'g') { setCommandBuffer('g'); return; }
      
      switch (motionKey) {
        case 'j': case 'ArrowDown': updateCursor(c => [c[0] + 1, c[1]]); break;
        case 'k': case 'ArrowUp': updateCursor(c => [c[0] - 1, c[1]]); break;
        case 'h': case 'ArrowLeft': updateCursor(c => [c[0], c[1] - 1]); break;
        case 'l': case 'ArrowRight': updateCursor(c => [c[0], c[1] + 1]); break;
        case 'w': updateCursor(c => findNextWord(lines, c)); break;
        case 'b': updateCursor(c => findPrevWord(lines, c)); break;
        case 'G': updateCursor(() => [maxLines, 0]); break;
        case 'v': if (mode === 'NORMAL') { setMode('VISUAL'); setVisual([cursor, cursor]); } else { setMode('NORMAL'); setVisual(null); } break;
        case 'i': if (isAdmin) setMode('INSERT'); break;
        case ':': setMode('COMMAND'); setCommandBuffer(':'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, commandBuffer, showAdminLogin, isAdmin, activeTab, activeBlogPostId, data, cursor, count]);
  
  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.replace(':', '').trim().split(' ');
    switch(command) {
        case 'login': setShowAdminLogin(true); break;
        case 'w': case 'write': handleSave(); break;
        case 'q': case 'quit': 
          if (activeTab === 'blog' && activeBlogPostId) setActiveBlogPostId(null); 
          else if (isAdmin) { setIsAdmin(false); alert('Admin logged out.'); }
          else if (onExitTerminal) onExitTerminal();
          break;
        case 'touch': if (activeTab === 'blog') handleCreatePost(args.join(' ')); else alert('Can only create in ~/blog'); break;
        case 'help': setActiveTab('help'); break;
    }
  };

  React.useEffect(()=> { setCursor([0,0]); setVisual(null); setMode('NORMAL'); setCount('') }, [activeTab, activeBlogPostId]);

  const tabs = [
    { id: 'about', label: 'about.md', icon: User },
    { id: 'experience', label: 'experience.json', icon: Terminal },
    { id: 'skills', label: 'stack.yaml', icon: Cpu },
    { id: 'contact', label: 'connect.sh', icon: Wifi },
    { id: 'blog', label: '~/blog', icon: Folder },
    { id: 'help', label: 'help.txt', icon: HelpCircle },
  ] as const;
  const renderContent = () => {
    const content = getCurrentContent();
    if (isAdmin && mode === 'INSERT') return <textarea className={`w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm md:text-base leading-6 ${THEME.fg} p-0 m-0 border-none`} value={content} onChange={(e) => handleContentChange(e.target.value)} spellCheck={false} autoFocus onBlur={() => setMode('NORMAL')} />;
    if (activeTab === 'blog' && !activeBlogPostId) return (
      <div className="font-mono">
        <div className={`${THEME.blue} mb-4 font-bold text-lg flex items-center border-b ${THEME.border} pb-2`}><Folder className="mr-2" size={20} /> ~/blog</div>
        {data.blog.map((p) => <div key={p.id} onClick={() => setActiveBlogPostId(p.id)} className={`grid grid-cols-12 text-sm hover:bg-[#24283b] p-2 cursor-pointer group transition-colors`}><div className="col-span-2 opacity-70">-rw-r--r--</div><div className="col-span-2 opacity-70">fran</div><div className="col-span-2 text-[#7aa2f7]">{p.date}</div><div className="col-span-5 flex items-center"><FileText size={14} className="mr-2 text-[#9ece6a]" />{p.title}</div><div className="col-span-1 text-right">{isAdmin && <button onClick={(e) => { e.stopPropagation(); handleDeletePost(p.id);}} className="opacity-0 group-hover:opacity-100 hover:text-red-400"><Trash2 size={14} /></button>}</div></div>)}
        {isAdmin && <div className="mt-8 pt-4 border-t border-[#414868] opacity-70 text-xs"><span className="text-[#e0af68]">TIP:</span> Use <code>:touch filename.md</code></div>}
      </div>);
    return <MarkdownRenderer content={content} cursor={cursor} visual={visual} mode={mode} />;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className={`w-full h-full max-w-7xl max-h-[85vh] ${THEME.bg} ${THEME.fg} flex flex-col font-mono overflow-hidden selection:bg-[#515c7e] selection:text-white rounded-xl shadow-2xl border border-[#414868] terminal-view`}>
      <div className={`w-full ${THEME.bgDark} border-b ${THEME.border} flex items-center text-sm overflow-x-auto no-scrollbar`}>
        {tabs.map((t, i) => <button key={t.id} onClick={() => { setActiveTab(t.id); setActiveBlogPostId(null);}} className={`flex items-center px-4 py-2 border-r ${THEME.border} transition-colors whitespace-nowrap ${activeTab === t.id ? `${THEME.bg} ${THEME.purple}` : 'opacity-60 hover:opacity-80 hover:bg-[#24283b]'}`}><span className="mr-2 text-xs opacity-50">[{i + 1}]</span><t.icon size={14} className="mr-2" />{t.label}</button>)}
        <div className="flex-grow" />
        <div className="px-4 text-xs opacity-50 hidden md:flex items-center whitespace-nowrap"><span className="mr-4 flex items-center"><Keyboard size={12} className="mr-1" /> 34-key layout</span><span className="mr-4">linux</span></div>
      </div>
      <div className="flex-grow flex relative overflow-hidden">
        <div className={`hidden md:block py-4 ${THEME.bgDark} border-r ${THEME.border}`}><LineNumbers count={getCurrentContent().split('\n').length} cursorLine={cursor[0]} /></div>
        <div className="flex-grow overflow-y-auto p-4 md:p-8 outline-none scroll-smooth">{loading ? <div>Loading...</div> : renderContent()}</div>
        {showAdminLogin && <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"><div className={`${THEME.bg} border ${THEME.border} p-6 w-96 shadow-2xl rounded-sm`}><div className={`${THEME.purple} mb-4 font-bold flex items-center`}><Lock size={16} className="mr-2" /> SUDO ACCESS</div><input type="password" autoFocus placeholder="Password..." className={`w-full bg-[#16161e] border ${THEME.border} p-2 text-white focus:outline-none focus:border-[#7aa2f7] mb-4`} onKeyDown={(e) => {if (e.key === 'Enter') {if ((e.target as HTMLInputElement).value === 'tokyo') { setIsAdmin(true); setShowAdminLogin(false); setMode('NORMAL'); } else { alert('Access Denied'); setShowAdminLogin(false); }}}} /><div className="text-xs text-right opacity-50">Hint: tokyo</div></div></div>}
      </div>
      <div className={`w-full h-8 ${THEME.bgDark} border-t ${THEME.border} flex items-center text-xs md:text-sm select-none z-10`}>
         <div className={`px-3 h-full flex items-center font-bold text-[#15161e] transition-colors duration-200 ${mode === 'NORMAL' ? 'bg-[#7aa2f7]' : ''} ${mode === 'INSERT' ? 'bg-[#9ece6a]' : ''} ${mode === 'VISUAL' ? 'bg-[#bb9af7]' : ''} ${mode === 'COMMAND' ? 'bg-[#e0af68]' : ''}`}>
          {mode} {count} {visual ? `(${Math.abs(visual[0][0] - visual[1][0]) + 1}L)` : ''}
        </div>
        <div className="px-3 h-full flex items-center bg-[#3b4261] text-[#7aa2f7] hidden sm:flex"><GitBranch size={12} className="mr-1" /> main</div>
        <div className="px-3 h-full flex items-center text-[#a9b1d6] flex-grow">{activeTab === 'blog' && activeBlogPostId ? `~/blog/${activeBlogPostId}` : tabs.find(t => t.id === activeTab)?.label} {isAdmin && mode === 'INSERT' ? '[+]' : ''}</div>
        <div className="px-4 text-[#a9b1d6]">{`${cursor[0]+1}:${cursor[1]+1}`}</div>
        <div className="px-3 h-full flex items-center bg-[#3b4261] text-[#a9b1d6] hidden md:flex"><div className="flex items-center">{isAdmin ? <Unlock size={12} className="text-[#9ece6a]" /> : <Lock size={12} />}</div></div>
      </div>
       {mode === 'COMMAND' && <div className="absolute left-0 bottom-8 w-full bg-[#16161e] p-2 border-t border-[#414868] text-[#a9b1d6] shadow-lg">{commandBuffer}<span className="animate-pulse block w-2 h-4 bg-white inline-block ml-1 align-middle" /></div>}
      </div>
    </div>
  );
};
// --- ROOT ---
export default App;