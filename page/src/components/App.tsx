import React, { useEffect, useState } from 'react';
import LandingPage from './LandingPage';
import Layout from './Layout';
import Portfolio from './Portfolio';
import type { Locale, Post } from '../data/site';

const LOCALE_KEY = 'ff_locale';

interface AppProps {
  posts?: Post[];
}

const App: React.FC<AppProps> = ({ posts = [] }) => {
  const [currentView, setCurrentView] = useState<'terminal' | 'landing'>('landing');
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(LOCALE_KEY);
      if (stored === 'es' || stored === 'en') return stored;
    }
    return 'es';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_KEY, locale);
    }
  }, [locale]);

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
      locale={locale}
      onLocaleChange={setLocale}
    >
      {currentView === 'landing' ? (
        <LandingPage locale={locale} posts={posts} onEnterTerminal={() => setCurrentView('terminal')} />
      ) : (
        <Portfolio posts={posts} onExitTerminal={() => setCurrentView('landing')} />
      )}
    </Layout>
  );
};

export default App;
