import React, { useEffect, useState } from 'react';
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

// Turn inline [label](url) markdown links into real anchors.
const renderInline = (text: string, keyPrefix: string): React.ReactNode => {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const href = match[2];
    const external = /^https?:\/\//.test(href);
    nodes.push(
      <a
        key={`${keyPrefix}-${match.index}`}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="text-[#7dcfff] hover:text-white transition-colors underline-offset-4 underline"
      >
        {match[1]}
      </a>,
    );
    last = match.index + match[0].length;
  }
  if (nodes.length === 0) return text;
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

// Minimal inline markdown renderer for blog post content (Tokyo Night aesthetic)
const renderMarkdown = (text: string): React.ReactNode => {
  return text
    .trim()
    .split('\n')
    .map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '') return <div key={i} className="h-3" />;
      if (line.startsWith('# '))
        return (
          <h4 key={i} className="text-[#bb9af7] font-bold text-lg mt-4 mb-2">
            {renderInline(line.replace(/^# /, ''), `h1-${i}`)}
          </h4>
        );
      if (line.startsWith('## '))
        return (
          <h5 key={i} className="text-[#7aa2f7] font-bold mt-3 mb-1">
            {renderInline(line.replace(/^## /, ''), `h2-${i}`)}
          </h5>
        );
      if (trimmed.startsWith('- ') || trimmed.startsWith('* '))
        return (
          <div key={i} className="pl-4 text-[#a9b1d6]">
            <span className="text-[#ff9e64]">•</span> {renderInline(trimmed.substring(2), `li-${i}`)}
          </div>
        );
      return (
        <p key={i} className="text-[#a9b1d6] leading-relaxed mb-2">
          {renderInline(line, `p-${i}`)}
        </p>
      );
    });
};

const LandingPage: React.FC<LandingPageProps> = ({ locale, posts, onEnterTerminal }) => {
  const copy = site[locale];
  const [openPost, setOpenPost] = useState<string | null>(null);

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
          <nav className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm">
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
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#565f89] mb-4">
            {copy.nowTitle}
          </h2>
          <ul className="space-y-2">
            {copy.now.map((line, i) => (
              <li key={i} className="flex gap-3 text-[#a9b1d6] leading-relaxed">
                <span className="text-[#9ece6a] select-none">▹</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Writing */}
        <section className="mt-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#565f89] mb-4">
            {copy.writingTitle}
          </h2>
          <p className="text-[#a9b1d6] leading-relaxed mb-6">{copy.writingIntro}</p>

          <ul className="divide-y divide-[#292e42]">
            {posts.map((post) => {
              const isOpen = openPost === post.slug;
              return (
                <li key={post.slug} className="py-3">
                  <button
                    type="button"
                    onClick={() => setOpenPost(isOpen ? null : post.slug)}
                    aria-expanded={isOpen}
                    className="w-full flex items-baseline justify-between gap-4 text-left group"
                  >
                    <span className="text-[#c0caf5] group-hover:text-[#7aa2f7] transition-colors font-medium">
                      {post.title}
                    </span>
                    <span className="shrink-0 text-xs font-mono text-[#565f89]">
                      {post.date.slice(0, 10)}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-4 pl-4 border-l-2 border-[#414868]">
                      {renderMarkdown(post.body)}
                      <button
                        type="button"
                        onClick={() => setOpenPost(null)}
                        className="mt-4 text-xs font-mono text-[#565f89] hover:text-[#7dcfff] transition-colors"
                      >
                        [{copy.closeLabel}]
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
