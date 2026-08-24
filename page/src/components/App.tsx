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
  // Server and first client render must agree, so the stored preference is
  // adopted after mount rather than seeded into the initial state.
  const [locale, setLocale] = useState<Locale>('es');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored === 'es' || stored === 'en') setLocale(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(LOCALE_KEY, locale);
  }, [locale, hydrated]);

  useEffect(() => {
    document.documentElement.lang = locale;
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
