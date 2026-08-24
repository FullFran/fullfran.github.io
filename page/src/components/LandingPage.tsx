import React, { useEffect } from 'react';
import { links, name, site, type Locale, type Post } from '../data/site';

interface LandingPageProps {
  locale: Locale;
  posts: Post[];
  onEnterTerminal: () => void;
}

// Render the intro paragraph, turning the "/cv" mention into a real link.
const renderIntro = (intro: string): React.ReactNode => {
  const parts = intro.split('/cv');
  if (parts.length === 1) return intro;
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <a
            key={`cv-${i}`}
            href="/cv"
            className="text-[#7dcfff] hover:text-white transition-colors underline-offset-4 underline"
          >
            /cv
          </a>,
          part,
        ],
  );
};

const formatDate = (iso: string, locale: Locale) =>
  new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

const LandingPage: React.FC<LandingPageProps> = ({ locale, posts, onEnterTerminal }) => {
  const copy = site[locale];

  // Easter egg: press "~" to jump into the terminal view
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;
      if (e.key === '~') {
        e.preventDefault();
        onEnterTerminal();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onEnterTerminal]);

  return (
    <div className="min-h-[70vh] bg-transparent text-[#c0caf5] font-sans selection:bg-[#2e3c64] selection:text-white">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* Hero */}
        <section className="space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{name}</h1>
          <p className="text-lg md:text-xl text-[#7aa2f7] font-medium">{copy.tagline}</p>
          <p className="text-[#a9b1d6] leading-relaxed">{renderIntro(copy.intro)}</p>

          {/* Links row */}
          <nav className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm" aria-label={copy.linksLabel}>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="text-[#7dcfff] hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </section>

        {/* Now */}
        <section className="mt-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#828bb8] mb-4">
            {copy.nowTitle}
          </h2>
          <ul className="space-y-2">
            {copy.now.map((line, i) => (
              <li key={i} className="flex gap-3 text-[#a9b1d6] leading-relaxed">
                <span className="text-[#9ece6a] select-none" aria-hidden="true">
                  &#9657;
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Writing */}
        <section className="mt-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#828bb8] mb-4">
            {copy.writingTitle}
          </h2>
          <p className="text-[#a9b1d6] leading-relaxed mb-6">{copy.writingIntro}</p>

          <ul className="border-t border-[#1c1f2e]">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-[#1c1f2e]">
                <a
                  href={`/blog/${post.slug}/`}
                  lang={post.lang}
                  className="group block py-4 sm:grid sm:grid-cols-[6.5rem_1fr] sm:gap-5 sm:items-baseline"
                >
                  <time
                    dateTime={post.date.slice(0, 10)}
                    className="block text-xs font-mono text-[#828bb8] whitespace-nowrap"
                  >
                    {formatDate(post.date, locale)}
                  </time>
                  <span className="block">
                    <span className="block font-medium text-[#c0caf5] group-hover:text-[#7aa2f7] transition-colors leading-snug">
                      {post.title}
                    </span>
                    {post.description && (
                      <span className="mt-1 block text-sm leading-relaxed text-[#828bb8]">
                        {post.description}
                      </span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/blog/"
            className="mt-6 inline-block text-sm text-[#7dcfff] hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            {copy.allWritingLabel}
          </a>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
