import { Globe, Menu, Terminal, X } from 'lucide-react';
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'terminal' | 'landing';
  onViewChange: (view: 'terminal' | 'landing') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-x-hidden">
      {/* Carbon fiber background texture */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none carbon-fiber-bg" />
      
      {/* Animated background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-[-20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slower" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all">
                <span className="text-white font-black text-xl">F</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg tracking-tight">FullFran</div>
                <div className="text-xs text-gray-400 font-mono">AI Solutions Architect</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors font-medium">About</a>
              <a href="#experience" className="text-gray-300 hover:text-white transition-colors font-medium">Experience</a>
              <a href="#skills" className="text-gray-300 hover:text-white transition-colors font-medium">Skills</a>
              <a href="#blog" className="text-gray-300 hover:text-white transition-colors font-medium">Blog</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors font-medium">Contact</a>
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center space-x-2 bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => onViewChange('landing')}
                className={`px-4 py-2 rounded-md transition-all flex items-center space-x-2 ${
                  currentView === 'landing'
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Globe size={16} />
                <span className="text-sm font-medium">Landing</span>
              </button>
              <button
                onClick={() => onViewChange('terminal')}
                className={`px-4 py-2 rounded-md transition-all flex items-center space-x-2 ${
                  currentView === 'terminal'
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Terminal size={16} />
                <span className="text-sm font-medium">Terminal</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-white/10 pt-4">
              <a href="#about" className="block text-gray-300 hover:text-white transition-colors font-medium">About</a>
              <a href="#experience" className="block text-gray-300 hover:text-white transition-colors font-medium">Experience</a>
              <a href="#skills" className="block text-gray-300 hover:text-white transition-colors font-medium">Skills</a>
              <a href="#blog" className="block text-gray-300 hover:text-white transition-colors font-medium">Blog</a>
              <a href="#contact" className="block text-gray-300 hover:text-white transition-colors font-medium">Contact</a>
              
              <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    onViewChange('landing');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-md transition-all flex items-center justify-center space-x-2 ${
                    currentView === 'landing'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  <Globe size={16} />
                  <span className="text-sm font-medium">Landing</span>
                </button>
                <button
                  onClick={() => {
                    onViewChange('terminal');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-md transition-all flex items-center justify-center space-x-2 ${
                    currentView === 'terminal'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  <Terminal size={16} />
                  <span className="text-sm font-medium">Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Francisco Olmedo Cortés. Built with{' '}
            <span className="text-red-400">♥</span> using Astro, React & modern web technologies.
          </p>
          <p className="text-gray-500 text-xs mt-2 font-mono">
            Inspired by terminal interfaces and premium automotive design
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
