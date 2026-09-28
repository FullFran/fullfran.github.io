import React, { useEffect, useState } from 'react';
import { FileText, Github, Linkedin, Mail, Rss, type LucideIcon } from 'lucide-react';
import { keyboardHref, links, name, site, type Locale, type Post } from '../data/site';

interface LandingPageProps {
  locale: Locale;
  posts: Post[];
  onEnterTerminal: () => void;
}

const linkIcons: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
  RSS: Rss,
};

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7aa2f7]';

// Render a paragraph: "/cv" and the keyboard mention become real links and "~" a button that opens the terminal.
const renderParagraph = (text: string, onEnterTerminal: () => void): React.ReactNode =>
  text.split(/(\/cv|~|teclado partido de 34 teclas|34-key split keyboard)/).map((part, i) => {
    if (part === 'teclado partido de 34 teclas' || part === '34-key split keyboard') {
      return (
        <a
          key={i}
          href={keyboardHref}
          className={`text-[#7dcfff] hover:text-white transition-colors underline underline-offset-4 rounded-sm ${focusRing}`}
        >
          {part}
        </a>
      );
    }
    if (part === '/cv') {
      return (
        <a
          key={i}
          href="/cv"
          className={`text-[#7dcfff] hover:text-white transition-colors underline underline-offset-4 rounded-sm ${focusRing}`}
        >
          /cv
        </a>
      );
    }
    if (part === '~') {
      return (
        <button
          key={i}
          type="button"
          onClick={onEnterTerminal}
          className={`mx-0.5 rounded border border-[#3b4261] bg-[#1c1f2e] px-1.5 font-mono text-[#9ece6a] hover:text-white hover:border-[#7aa2f7] transition-colors ${focusRing}`}
        >
          ~
        </button>
      );
    }
    return part;
  });

const formatDate = (iso: string, locale: Locale) =>
  new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

// Centred mono section heading with an underline rule.
const SectionHeading: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <div className="mb-10 text-center">
    <h2 id={id} className="font-mono text-2xl md:text-3xl font-bold text-white">
      <span className="text-[#9ece6a] select-none" aria-hidden="true">
        ~/
      </span>
      {children}
    </h2>
    <div className="mx-auto mt-3 h-0.5 w-16 rounded bg-[#7aa2f7]" aria-hidden="true" />
  </div>
);

const POSTS_PAGE_SIZE = 5;

const bandBase = 'w-full py-16 md:py-20';
const bandAlt = 'bg-white/[0.02] border-y border-[#1c1f2e]';
const column = 'max-w-3xl mx-auto px-5 sm:px-6';

const LandingPage: React.FC<LandingPageProps> = ({ locale, posts, onEnterTerminal }) => {
  const copy = site[locale];
  const [visibleCount, setVisibleCount] = useState(POSTS_PAGE_SIZE);
  const visiblePosts = posts.slice(0, visibleCount);
  const socialLinks = links.filter((l) => l.label in linkIcons);
  const contactLinks = links.filter((l) => ['Email', 'LinkedIn', 'GitHub'].includes(l.label));

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
    <div className="min-h-[70vh] bg-transparent text-[#c0caf5] font-sans selection:bg-[#2e3c64] selection:text-white overflow-x-hidden">
      <style>{`
        @keyframes landing-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
        .landing-cursor { animation: landing-blink 1.1s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) { .landing-cursor { animation: none; } }
      `}</style>

      {/* Hero */}
      <header className={`${bandBase} md:py-28`}>
        <div className={`${column} space-y-5`}>
          <p className="font-mono text-sm text-[#828bb8]" aria-hidden="true">
            <span className="text-[#9ece6a]">fran@fullfran</span>
            <span>:</span>
            <span className="text-[#7aa2f7]">~</span>
            <span>$ whoami</span>
            <span className="landing-cursor ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[#c0caf5]" />
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">{name}</h1>
          <p className="text-lg md:text-2xl text-[#7aa2f7] font-medium">{copy.tagline}</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-3">
            <a
              href="/cv"
              className={`inline-flex items-center gap-2 rounded-full bg-[#7aa2f7] px-6 py-2.5 text-sm font-semibold text-[#1a1b26] hover:bg-[#7dcfff] transition-colors ${focusRing}`}
            >
              <FileText size={16} aria-hidden="true" />
              {copy.cvButton}
            </a>
            <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm" aria-label={copy.linksLabel}>
              {socialLinks.map((link) => {
                const Icon = linkIcons[link.label];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className={`inline-flex items-center gap-1.5 rounded-sm text-[#a9b1d6] hover:text-[#7dcfff] transition-colors ${focusRing}`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {link.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* About */}
      <section className={`${bandBase} ${bandAlt}`} aria-labelledby="about-title">
        <div className={column}>
          <SectionHeading id="about-title">{copy.aboutTitle}</SectionHeading>
          <div className="overflow-hidden rounded-xl border border-[#1c1f2e] bg-[#16161e]/80 shadow-lg">
            <div className="flex items-center gap-2 border-b border-[#1c1f2e] bg-[#1a1b26] px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#f7768e]" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-[#e0af68]" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-[#9ece6a]" aria-hidden="true" />
              <span className="ml-3 font-mono text-xs text-[#828bb8]">{copy.aboutFile}</span>
            </div>
            <div className="space-y-4 p-5 sm:p-7 text-base md:text-lg leading-relaxed text-[#a9b1d6]">
              {copy.about.map((p, i) => (
                <p key={i}>{renderParagraph(p, onEnterTerminal)}</p>
              ))}

              <div className="border-t border-[#1c1f2e] pt-5">
                <p className="mb-3 font-mono text-sm text-[#9ece6a]">{copy.nowCommand}</p>
                <ul className="space-y-2 text-base">
                  {copy.now.map((line, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-[#9ece6a] select-none" aria-hidden="true">
                        &#9657;
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className={bandBase} aria-labelledby="blog-title">
        <div className={column}>
          <SectionHeading id="blog-title">{copy.blogTitle}</SectionHeading>
          <p className="mb-6 text-center text-[#a9b1d6] leading-relaxed">{copy.writingIntro}</p>

          <ul className="space-y-3">
            {visiblePosts.map((post) => (
              <li key={post.slug}>
                <a
                  href={`/blog/${post.slug}/`}
                  lang={post.lang}
                  className={`group block rounded-lg border border-[#1c1f2e] px-4 py-4 hover:border-[#3b4261] hover:bg-white/[0.03] transition-colors ${focusRing}`}
                >
                  <time
                    dateTime={post.date.slice(0, 10)}
                    className="block text-xs font-mono text-[#828bb8]"
                  >
                    {formatDate(post.date, locale)}
                  </time>
                  <span className="mt-1 block font-medium text-[#c0caf5] group-hover:text-[#7aa2f7] transition-colors leading-snug">
                    {post.title}
                  </span>
                  {post.description && (
                    <span className="mt-1 block text-sm leading-relaxed text-[#828bb8]">
                      {post.description}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {visibleCount < posts.length && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + POSTS_PAGE_SIZE)}
                className={`rounded-md border border-[#3b4261] px-4 py-2 text-sm text-[#c0caf5] hover:bg-white/[0.05] transition-colors ${focusRing}`}
              >
                {copy.showMoreLabel}
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href="/blog/"
              className={`rounded-sm text-sm text-[#7dcfff] hover:text-white transition-colors underline-offset-4 hover:underline ${focusRing}`}
            >
              {copy.allWritingLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className={`${bandBase} ${bandAlt}`} aria-labelledby="contact-title">
        <div className={`${column} text-center`}>
          <SectionHeading id="contact-title">{copy.contactTitle}</SectionHeading>
          <p className="mx-auto max-w-xl text-base md:text-lg leading-relaxed text-[#a9b1d6]">
            {copy.contactText}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {contactLinks.map((link) => {
              const Icon = linkIcons[link.label];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className={`inline-flex items-center gap-2 rounded-full border border-[#3b4261] px-5 py-2 text-sm text-[#c0caf5] hover:border-[#7aa2f7] hover:text-[#7dcfff] transition-colors ${focusRing}`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
