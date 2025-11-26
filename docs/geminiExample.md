import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Terminal,
  Cpu,
  User,
  GitBranch,
  Wifi,
  Lock,
  Unlock,
  Keyboard,
  FileText,
  Folder,
  Trash2,
} from 'lucide-react';

// --- TYPES ---
type BlogPost = {
  id: string;
  title: string;
  date: string;
  content: string;
};

type PortfolioData = {
  about: string;
  experience: string;
  skills: string;
  contact: string;
  blog: BlogPost[];
};

// --- STORAGE LOCAL ---
const STORAGE_KEY = 'fullfran_portfolio_content_v1';

// --- DATOS POR DEFECTO ---
const DEFAULT_DATA: PortfolioData = {
  about: `
# Francisco Manuel Olmedo Cortés
## AI Solutions Architect & Physicist

> "I build intelligent systems that solve real business problems."

Hola, soy Fran. Soy físico de formación, pero mi curiosidad me llevó a la arquitectura de soluciones de IA.
Cofundador de **BlakIA**, donde diseño pipelines de IA que reducen costes y aumentan la eficiencia.

### 🧠 The Geek Side
No soy el típico consultor. Vengo de la física (óptica y medios desordenados), lo que me da una perspectiva única para la simulación y optimización.

* **Teclados:** Construyo teclados mecánicos custom. Actualmente uso layouts minimalistas de 34 teclas (Fifi Keyboard).
* **WPM:** ~97 en Monkeytype.
* **Hobby:** Calistenia (ex-atleta), Anime y Videojuegos.
* **OS:** Linux / Neovim lover.

### 📍 Ubicación
Córdoba, Andalucía, España
  `,
  experience: `
# Experiencia Profesional

## 🚀 BlakIA (Cofounder & AI Architect)
*2024 - Presente*
- Diseño y despliegue de pipelines de IA personalizados (LLMs, RAG, n8n).
- Infraestructura escalable para +100k mensajes en eventos de ciudad.
- Arquitectura SaaS multi-tenant.

## 💻 Freelance AI & ML Developer
*2024 - Presente*
- Automatización end-to-end (reducción del 60% de carga manual).
- Bots de cualificación de leads y herramientas internas.

## 🔬 Universidad de Córdoba (Researcher)
*2024 - 2025*
- Simulación de materiales ópticos desordenados (ray tracing, algoritmos genéticos).
- Teaching Assistant en Python y Data Science.

## ⚡ IDENER.AI (Researcher)
*2024*
- Modelos de redes neuronales para predicción de producción de energía.
  `,
  skills: `
# Stack Tecnológico

## 🤖 AI & Data
- LLMs (GPT-4, Claude, Local Llama)
- LangChain / LangGraph
- RAG Systems
- Vector DBs (Qdrant, Weaviate)

## 🛠️ Infrastructure & Backend
- Python (FastAPI)
- Docker / CI/CD
- Hetzner / GCP
- n8n (Workflow Automation)

## 🎨 Frontend
- React / Astro
- Tailwind CSS
- Vim (Si, es una skill)

## 🗣️ Idiomas
- Español: Nativo
- Inglés: B2 (Anglia)
  `,
  contact: `
# Contacto & Redes

Si quieres hablar de IA, teclados o física, contáctame:

- **Email:** fran@blakia.es
- **Web:** www.blakia.es
- **GitHub:** FullFran
- **LinkedIn:** francisco-olmedo-cortes

---
*Generated with ❤️ using React & Tailwind*
  `,
  blog: [
    {
      id: 'welcome',
      title: 'welcome.md',
      date: '2024-01-01',
      content: `# Welcome to my Terminal
      
This is the first entry in my digital log.
I use this space to share thoughts on AI architecture, mechanical keyboards, and physics simulations.

To navigate, use the file explorer or Vim commands if you are feeling geeky.
`,
    },
  ],
};

// --- TOKYO NIGHT THEME COLORS ---
const THEME = {
  bg: 'bg-[#1a1b26]',
  bgDark: 'bg-[#16161e]',
  fg: 'text-[#a9b1d6]',
  fgDark: 'text-[#565f89]',
  blue: 'text-[#7aa2f7]',
  cyan: 'text-[#7dcfff]',
  purple: 'text-[#bb9af7]',
  green: 'text-[#9ece6a]',
  red: 'text-[#f7768e]',
  yellow: 'text-[#e0af68]',
  orange: 'text-[#ff9e64]',
  selection: 'selection:bg-[#515c7e] selection:text-white',
  border: 'border-[#414868]',
};

// --- COMPONENTES AUXILIARES ---

const LineNumbers = ({ count }: { count: number }) => (
  <div
    className={`flex flex-col text-right pr-4 select-none ${THEME.fgDark} font-mono text-sm opacity-50 w-12 flex-shrink-0`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="leading-6">
        {i + 1}
      </span>
    ))}
  </div>
);

const MarkdownRenderer = ({ content }: { content: string }) => {
  const lines = content.trim().split('\n');
  return (
    <div
      className={`font-mono text-sm md:text-base leading-6 whitespace-pre-wrap ${THEME.fg}`}
    >
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return (
            <div
              key={i}
              className={`${THEME.purple} font-bold text-xl mt-4 mb-2`}
            >
              {line}
            </div>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <div
              key={i}
              className={`${THEME.blue} font-bold text-lg mt-3 mb-1`}
            >
              {line}
            </div>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <div key={i} className={`${THEME.cyan} font-bold mt-2`}>
              {line}
            </div>
          );
        }
        if (line.startsWith('> ')) {
          return (
            <div
              key={i}
              className={`${THEME.green} italic pl-4 border-l-2 border-[#9ece6a] my-2`}
            >
              {line}
            </div>
          );
        }
        if (line.trim().startsWith('- ')) {
          return (
            <div key={i} className="pl-4">
              <span className={THEME.orange}>•</span> {line.substring(2)}
            </div>
          );
        }
        if (line.trim().startsWith('* ')) {
          return (
            <div key={i} className="pl-4">
              <span className={THEME.yellow}>*</span> {line.substring(2)}
            </div>
          );
        }

        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={i} className="min-h-[1.5rem]">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <span key={j} className={`${THEME.red} font-bold`}>
                    {part.slice(2, -2)}
                  </span>
                );
              }
              return part;
            })}
          </div>
        );
      })}
      <span className="inline-block w-2.5 h-5 bg-[#a9b1d6] animate-pulse align-middle ml-1" />
    </div>
  );
};

// --- APP PRINCIPAL ---

const App: React.FC = () => {
  const [data, setData] = React.useState<PortfolioData>(() => {
    if (typeof window === 'undefined') return DEFAULT_DATA;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_DATA;
      const parsed = JSON.parse(raw) as Partial<PortfolioData>;
      return {
        ...DEFAULT_DATA,
        ...parsed,
        blog: parsed.blog ?? DEFAULT_DATA.blog,
      };
    } catch {
      return DEFAULT_DATA;
    }
  });

  const [loading, setLoading] = React.useState(false);

  // State del "Editor"
  const [activeTab, setActiveTab] = React.useState<
    'about' | 'experience' | 'skills' | 'contact' | 'blog'
  >('about');
  const [mode, setMode] = React.useState<
    'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND'
  >('NORMAL');
  const [commandBuffer, setCommandBuffer] = React.useState('');
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  // Blog specific state
  const [activeBlogPostId, setActiveBlogPostId] =
    React.useState<string | null>(null);
  const [tempBlogContent, setTempBlogContent] = React.useState('');

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Sync temp blog content when switching posts
  React.useEffect(() => {
    if (activeTab === 'blog' && activeBlogPostId) {
      const post = data.blog.find((p) => p.id === activeBlogPostId);
      if (post) setTempBlogContent(post.content);
    }
  }, [activeBlogPostId, activeTab, data.blog]);

  // --- PERSISTENCIA LOCAL ---
  const persist = (newData: PortfolioData) => {
    setData(newData);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      // ignore
    }
  };

  // --- LOGIC: SAVE COMMAND ---
  const handleSave = () => {
    if (!isAdmin) return;
    try {
      let newData: PortfolioData = { ...data };

      if (activeTab === 'blog') {
        if (activeBlogPostId) {
          newData.blog = data.blog.map((p) =>
            p.id === activeBlogPostId ? { ...p, content: tempBlogContent } : p,
          );
        } else {
          return;
        }
      } else {
        // Para tabs normales, el contenido ya está en `data`
      }

      persist(newData);

      const originalMode = mode;
      setMode('COMMAND');
      setCommandBuffer(
        `"${activeTab === 'blog' ? activeBlogPostId : activeTab}" [Written]`,
      );
      setTimeout(() => {
        setCommandBuffer('');
        setMode(originalMode);
      }, 2000);
    } catch (e) {
      console.error(e);
      alert('Error saving');
    }
  };

  // --- LOGIC: CREATE BLOG POST ---
  const handleCreatePost = (filename: string) => {
    if (!filename) return;
    const newPost: BlogPost = {
      id: filename.replace(/\s+/g, '-').toLowerCase(),
      title: filename,
      date: new Date().toISOString().split('T')[0],
      content: `# ${filename}\n\nStart writing here...`,
    };
    const newData: PortfolioData = { ...data, blog: [...data.blog, newPost] };
    persist(newData);
  };

  const handleDeletePost = (id: string) => {
    if (!window.confirm(`Delete ${id}?`)) return;
    const newData: PortfolioData = {
      ...data,
      blog: data.blog.filter((p) => p.id !== id),
    };
    persist(newData);
    if (activeBlogPostId === id) {
      setActiveBlogPostId(null);
    }
  };

  // --- KEYBOARD HANDLER (VIM STYLE) ---
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAdminLogin) return;
      if (mode === 'INSERT' && isAdmin) return;

      // COMMAND MODE
      if (e.key === ':' && mode === 'NORMAL') {
        setMode('COMMAND');
        setCommandBuffer(':');
        e.preventDefault();
        return;
      }

      if (mode === 'COMMAND') {
        if (e.key === 'Enter') {
          executeCommand(commandBuffer);
          setMode('NORMAL');
          setCommandBuffer('');
        } else if (e.key === 'Backspace') {
          setCommandBuffer((prev) => prev.slice(0, -1));
          if (commandBuffer.length <= 1) setMode('NORMAL');
        } else if (e.key.length === 1) {
          setCommandBuffer((prev) => prev + e.key);
        }
        return;
      }

      // ESC
      if (e.key === 'Escape') {
        setMode('NORMAL');
        setCommandBuffer('');
        setShowAdminLogin(false);
        return;
      }

      // NAV (NORMAL)
      if (mode === 'NORMAL') {
        switch (e.key) {
          case 'j':
            scrollContainerRef.current?.scrollBy({
              top: 50,
              behavior: 'smooth',
            });
            break;
          case 'k':
            scrollContainerRef.current?.scrollBy({
              top: -50,
              behavior: 'smooth',
            });
            break;
          case 'h':
            if (activeTab === 'blog' && activeBlogPostId) {
              setActiveBlogPostId(null);
            } else {
              cycleTab(-1);
            }
            break;
          case 'l':
            cycleTab(1);
            break;
          case '1':
            setActiveTab('about');
            setActiveBlogPostId(null);
            break;
          case '2':
            setActiveTab('experience');
            setActiveBlogPostId(null);
            break;
          case '3':
            setActiveTab('skills');
            setActiveBlogPostId(null);
            break;
          case '4':
            setActiveTab('contact');
            setActiveBlogPostId(null);
            break;
          case '5':
            setActiveTab('blog');
            setActiveBlogPostId(null);
            break;
          case 'i':
            if (isAdmin) {
              setMode('INSERT');
              e.preventDefault();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    mode,
    commandBuffer,
    showAdminLogin,
    isAdmin,
    activeTab,
    activeBlogPostId,
    data,
  ]);

  const cycleTab = (direction: number) => {
    const tabsOrder: Array<'about' | 'experience' | 'skills' | 'contact' | 'blog'> =
      ['about', 'experience', 'skills', 'contact', 'blog'];
    const currentIndex = tabsOrder.indexOf(activeTab);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = tabsOrder.length - 1;
    if (nextIndex >= tabsOrder.length) nextIndex = 0;
    setActiveTab(tabsOrder[nextIndex]);
    setActiveBlogPostId(null);
  };

  const executeCommand = (cmd: string) => {
    const cleanCmd = cmd.replace(':', '').trim();
    const [command, ...args] = cleanCmd.split(' ');

    if (command === 'login') {
      setShowAdminLogin(true);
    } else if (command === 'w' || command === 'write') {
      handleSave();
    } else if (command === 'q' || command === 'quit') {
      if (activeTab === 'blog' && activeBlogPostId) {
        setActiveBlogPostId(null);
      } else if (isAdmin) {
        setIsAdmin(false);
        alert('Admin logged out.');
      }
    } else if (command === 'touch') {
      if (activeTab !== 'blog') {
        alert('Can only create files in ~/blog directory');
      } else {
        handleCreatePost(args.join(' '));
      }
    } else if (command === 'rm') {
      alert('Use the trash icon in list view (easier UI)');
    } else if (command === 'help') {
      alert(':login, :w, :q, :touch <filename>');
    }
  };

  const tabs = [
    { id: 'about', label: 'about.md', icon: User },
    { id: 'experience', label: 'experience.json', icon: Terminal },
    { id: 'skills', label: 'stack.yaml', icon: Cpu },
    { id: 'contact', label: 'connect.sh', icon: Wifi },
    { id: 'blog', label: '~/blog', icon: Folder },
  ] as const;

  // --- RENDER HELPERS ---

  const renderContent = () => {
    // BLOG
    if (activeTab === 'blog') {
      // LIST VIEW
      if (!activeBlogPostId) {
        return (
          <div className="font-mono">
            <div
              className={`${THEME.blue} mb-4 font-bold text-lg flex items-center border-b ${THEME.border} pb-2`}
            >
              <Folder className="mr-2" size={20} /> ~/blog
            </div>

            <div className="grid grid-cols-12 text-xs opacity-50 mb-2 px-2">
              <div className="col-span-2">PERMISSIONS</div>
              <div className="col-span-2">USER</div>
              <div className="col-span-2">DATE</div>
              <div className="col-span-6">NAME</div>
            </div>

            <div className="space-y-1">
              {data.blog.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActiveBlogPostId(post.id)}
                  className={`grid grid-cols-12 text-sm hover:bg-[#24283b] p-2 cursor-pointer group transition-colors`}
                >
                  <div className="col-span-2 opacity-70">-rw-r--r--</div>
                  <div className="col-span-2 opacity-70">fran</div>
                  <div className="col-span-2 text-[#7aa2f7]">{post.date}</div>
                  <div className="col-span-5 flex items-center">
                    <FileText size={14} className="mr-2 text-[#9ece6a]" />
                    {post.title}
                  </div>
                  <div className="col-span-1 text-right">
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {data.blog.length === 0 && (
              <div className="mt-8 opacity-50 text-center italic">
                Directory is empty.
              </div>
            )}

            {isAdmin && (
              <div className="mt-8 pt-4 border-t border-[#414868] opacity-70 text-xs">
                <span className="text-[#e0af68]">TIP:</span> Use{' '}
                <code>:touch filename.md</code> to create a new file.
              </div>
            )}
          </div>
        );
      }

      // POST VIEW
      return isAdmin && mode === 'INSERT' ? (
        <textarea
          className={`w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm md:text-base leading-6 ${THEME.fg} p-0 m-0 border-none`}
          value={tempBlogContent}
          onChange={(e) => setTempBlogContent(e.target.value)}
          spellCheck={false}
          autoFocus
        />
      ) : (
        <MarkdownRenderer content={tempBlogContent || ''} />
      );
    }

    // TABS NORMALES
    return isAdmin && mode === 'INSERT' ? (
      <textarea
        className={`w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm md:text-base leading-6 ${THEME.fg} p-0 m-0 border-none`}
        value={(data as any)[activeTab]}
        onChange={(e) =>
          setData({
            ...data,
            [activeTab]: e.target.value,
          } as PortfolioData)
        }
        spellCheck={false}
        autoFocus
      />
    ) : (
      <MarkdownRenderer content={(data as any)[activeTab] || ''} />
    );
  };

  return (
    <div
      className={`w-full h-screen ${THEME.bg} ${THEME.fg} ${THEME.selection} flex flex-col font-mono overflow-hidden`}
    >
      {/* TOP BAR */}
      <div
        className={`w-full ${THEME.bgDark} border-b ${THEME.border} flex items-center text-sm overflow-x-auto no-scrollbar`}
      >
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveBlogPostId(null);
              }}
              className={`flex items-center px-4 py-2 border-r ${THEME.border} transition-colors whitespace-nowrap
                        ${
                          isActive
                            ? `${THEME.bg} ${THEME.purple}`
                            : 'opacity-60 hover:opacity-80 hover:bg-[#24283b]'
                        }
                    `}
            >
              <span className="mr-2 text-xs opacity-50">[{idx + 1}]</span>
              <Icon size={14} className="mr-2" />
              {tab.label}
            </button>
          );
        })}
        <div className="flex-grow" />
        <div className="px-4 text-xs opacity-50 flex items-center hidden md:flex whitespace-nowrap">
          <span className="mr-4 flex items-center">
            <Keyboard size={12} className="mr-1" /> 34-key layout
          </span>
          <span className="mr-4">linux</span>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-grow flex relative overflow-hidden">
        {/* Line Numbers (hide in blog list view) */}
        {(!activeTab.includes('blog') || activeBlogPostId) && (
          <div
            className={`hidden md:block py-4 ${THEME.bgDark} border-r ${THEME.border}`}
          >
            <LineNumbers
              count={
                activeTab === 'blog'
                  ? tempBlogContent.split('\n').length + 5
                  : ((data as any)[activeTab]?.split('\n').length + 5) || 10
              }
            />
          </div>
        )}

        {/* Buffer */}
        <div
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto p-4 md:p-8 outline-none scroll-smooth"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full opacity-50">
              <span className="animate-spin mr-2">⟳</span> Loading system...
            </div>
          ) : (
            renderContent()
          )}
        </div>

        {/* Admin Login Overlay */}
        {showAdminLogin && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div
              className={`${THEME.bg} border ${THEME.border} p-6 w-96 shadow-2xl rounded-sm`}
            >
              <div
                className={`${THEME.purple} mb-4 font-bold flex items-center`}
              >
                <Lock size={16} className="mr-2" /> SUDO ACCESS
              </div>
              <input
                type="password"
                autoFocus
                placeholder="Password..."
                className={`w-full bg-[#16161e] border ${THEME.border} p-2 text-white focus:outline-none focus:border-[#7aa2f7] mb-4`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if ((e.target as HTMLInputElement).value === 'tokyo') {
                      setIsAdmin(true);
                      setShowAdminLogin(false);
                      setMode('NORMAL');
                    } else {
                      alert('Access Denied');
                      setShowAdminLogin(false);
                    }
                  }
                }}
              />
              <div className="text-xs text-right opacity-50">Hint: tokyo</div>
            </div>
          </div>
        )}
      </div>

      {/* STATUS LINE */}
      <div
        className={`w-full h-8 ${THEME.bgDark} border-t ${THEME.border} flex items-center text-xs md:text-sm select-none z-10`}
      >
        <div
          className={`
            px-3 h-full flex items-center font-bold text-[#15161e] transition-colors duration-200
            ${mode === 'NORMAL' ? 'bg-[#7aa2f7]' : ''}
            ${mode === 'INSERT' ? 'bg-[#9ece6a]' : ''}
            ${mode === 'VISUAL' ? 'bg-[#bb9af7]' : ''}
            ${mode === 'COMMAND' ? 'bg-[#e0af68]' : ''}
        `}
        >
          {mode}
        </div>

        <div className="px-3 h-full flex items-center bg-[#3b4261] text-[#7aa2f7] hidden sm:flex">
          <GitBranch size={12} className="mr-1" />
          main
        </div>

        <div className="px-3 h-full flex items-center text-[#a9b1d6] flex-grow">
          {activeTab === 'blog' && activeBlogPostId
            ? `${activeBlogPostId}`
            : tabs.find((t) => t.id === activeTab)?.label}
          {isAdmin && mode !== 'NORMAL' ? ' [+]' : ''}
        </div>

        {mode === 'COMMAND' && (
          <div className="absolute left-0 bottom-8 w-full bg-[#16161e] p-2 border-t border-[#414868] text-[#a9b1d6] shadow-lg">
            {commandBuffer}
            <span className="animate-pulse block w-2 h-4 bg-white inline-block ml-1 align-middle" />
          </div>
        )}

        <div className="px-3 h-full flex items-center bg-[#3b4261] text-[#a9b1d6] hidden md:flex">
          <span className="mr-2">utf-8</span>
          <div className="flex items-center">
            {isAdmin ? (
              <Unlock size={12} className="text-[#9ece6a]" />
            ) : (
              <Lock size={12} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ROOT ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root element not found');
}

