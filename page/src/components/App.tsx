import React, { useEffect, useMemo, useState } from 'react';
import LandingPage from './LandingPage';
import Layout from './Layout';
import Nano from './Nano';
import Portfolio from './Portfolio';
import Shell from './Shell';
import type { Locale, Post, PostMeta } from '../data/site';
import type { ViBuffer } from '../lib/shell/types';

const LOCALE_KEY = 'ff_locale';
const BODIES_URL = '/blog/bodies.json';

// Markdown of every post, fetched once and shared by every view that needs it.
let bodiesRequest: Promise<Record<string, string>> | null = null;
const loadBodies = () =>
  (bodiesRequest ??= fetch(BODIES_URL)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .catch((err) => {
      bodiesRequest = null; // let a later attempt retry
      throw err;
    }));

interface AppProps {
  posts?: PostMeta[];
}

const App: React.FC<AppProps> = ({ posts: postList = [] }) => {
  const [currentView, setCurrentView] = useState<'terminal' | 'landing'>('landing');
  // Server and first client render must agree, so the stored preference is
  // adopted after mount rather than seeded into the initial state.
  const [locale, setLocale] = useState<Locale>('es');
  // Buffer of the vim viewer while `vi <file>` is open on top of the shell.
  const [viBuffer, setViBuffer] = useState<ViBuffer | null>(null);
  // File shown by the nano view while `nano <file>` is open on top of the shell.
  const [nanoFile, setNanoFile] = useState<{ name: string; lines: string[] } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  // Post bodies are not in the page HTML; the terminal is the only view that reads them.
  const [bodies, setBodies] = useState<Record<string, string> | null>(null);
  const posts: Post[] = useMemo(
    () => postList.map((p) => ({ ...p, body: bodies?.[p.slug] ?? '' })),
    [postList, bodies],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored === 'es' || stored === 'en') setLocale(stored);
    setHydrated(true);
  }, []);

  // Fetch the bodies once the page is idle, so they are usually there before
  // anyone opens the terminal, and right away if the terminal opens first.
  useEffect(() => {
    if (bodies) return;
    let cancelled = false;
    const fetchNow = () => loadBodies().then((b) => !cancelled && setBodies(b), () => {});
    if (currentView === 'terminal') {
      fetchNow();
      return () => { cancelled = true; };
    }
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(fetchNow);
    return () => { cancelled = true; cancelIdle(handle); };
  }, [currentView, bodies]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(LOCALE_KEY, locale);
  }, [locale, hydrated]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <Layout
      currentView={currentView}
      onViewChange={(view) => { setViBuffer(null); setNanoFile(null); setCurrentView(view); }}
      locale={locale}
      onLocaleChange={setLocale}
    >
      {currentView === 'landing' ? (
        <LandingPage locale={locale} posts={postList} onEnterTerminal={() => setCurrentView('terminal')} />
      ) : (
        <>
          <Shell
            posts={posts}
            locale={locale}
            active={viBuffer === null && nanoFile === null}
            onExit={() => setCurrentView('landing')}
            onOpenVi={setViBuffer}
            onOpenNano={setNanoFile}
          />
          {nanoFile && (
            <Nano name={nanoFile.name} lines={nanoFile.lines} locale={locale} onReturnToShell={() => setNanoFile(null)} />
          )}
          {viBuffer && (
            <Portfolio
              posts={posts}
              locale={locale}
              initialBuffer={viBuffer}
              onReturnToShell={() => setViBuffer(null)}
              onExitTerminal={() => setCurrentView('landing')}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
