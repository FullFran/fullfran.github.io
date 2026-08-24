import { Globe, Terminal } from 'lucide-react';
import React from 'react';
import { site, type Locale } from '../data/site';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'terminal' | 'landing';
  onViewChange: (view: 'terminal' | 'landing') => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const LocaleToggle: React.FC<{ locale: Locale; onLocaleChange: (l: Locale) => void }> = ({
  locale,
  onLocaleChange,
}) => (
  <div className="flex items-center text-sm font-mono border border-white/10 rounded-md overflow-hidden">
    {(['es', 'en'] as Locale[]).map((l) => (
      <button
        key={l}
        onClick={() => onLocaleChange(l)}
        aria-pressed={locale === l}
        className={`px-2.5 py-1 transition-colors ${
          locale === l ? 'bg-[#7aa2f7] text-[#1a1b26]' : 'text-gray-400 hover:text-white'
        }`}
      >
        {l.toUpperCase()}
      </button>
    ))}
  </div>
);

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onViewChange,
  locale,
  onLocaleChange,
}) => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-x-hidden">
      <a href="#content" className="skip-link">
        {locale === 'en' ? 'Skip to content' : 'Saltar al contenido'}
      </a>

      {/* Carbon fiber background texture */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none carbon-fiber-bg" />

      {/* Animated background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-[-20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slower" />
      </div>

      {/* Navigation Bar */}
      <nav
        aria-label={locale === 'en' ? 'Site' : 'Sitio'}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10"
      >
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={() => onViewChange('landing')}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all">
                <span className="text-white font-black text-lg">F</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">FullFran</span>
            </button>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <LocaleToggle locale={locale} onLocaleChange={onLocaleChange} />

              <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => onViewChange('landing')}
                  aria-label="Landing view"
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
                    currentView === 'landing'
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Globe size={16} />
                  <span className="hidden sm:inline text-sm font-medium">Home</span>
                </button>
                <button
                  onClick={() => onViewChange('terminal')}
                  aria-label="Terminal view"
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
                    currentView === 'terminal'
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Terminal size={16} />
                  <span className="hidden sm:inline text-sm font-medium">Terminal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="content" className={`relative pt-20 ${currentView === 'terminal' ? 'z-40' : 'z-10'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm mt-20">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center space-y-2">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Francisco Olmedo Cortés
          </p>
          {currentView === 'landing' && (
            <button
              onClick={() => onViewChange('terminal')}
              className="text-[#828bb8] hover:text-[#7dcfff] text-xs font-mono transition-colors"
            >
              {site[locale].terminalHint}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
