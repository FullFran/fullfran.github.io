import { Briefcase, ChevronRight, Code, FileText, Mail, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import portfolioDataJson from '../data/portfolio.json';

// Types for portfolio data
interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface PortfolioData {
  about: string;
  experience: string;
  skills: string;
  contact: string;
  blog: BlogPost[];
  help: string;
}

// Strapi URL from environment or default to localhost
const STRAPI_URL = (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_STRAPI_URL) || '';

interface LandingPageProps {
  initialData?: PortfolioData;
}

const LandingPage: React.FC<LandingPageProps> = ({ initialData }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialData || (portfolioDataJson as PortfolioData));
  const [isLoading, setIsLoading] = useState(!initialData && !!STRAPI_URL);

  useEffect(() => {
    if (!STRAPI_URL) return;

    const fetchFromStrapi = async () => {
      try {
        // Fetch portfolio data
        const portfolioRes = await fetch(`${STRAPI_URL}/api/portfolio`);
        if (!portfolioRes.ok) throw new Error('Failed to fetch portfolio');
        const portfolioJson = await portfolioRes.json();

        // Fetch blog posts
        const blogRes = await fetch(`${STRAPI_URL}/api/blog-posts?sort=date:desc`);
        if (!blogRes.ok) throw new Error('Failed to fetch blog posts');
        const blogJson = await blogRes.json();

        const blogPosts: BlogPost[] = blogJson.data.map((post: { postId: string; title: string; date: string; content: string }) => ({
          id: post.postId,
          title: post.title,
          date: post.date,
          content: post.content,
        }));

        // Normalize text: convert escaped sequences from Strapi to actual characters
        const normalizeText = (text: string) =>
          text?.replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/^["']|["']$/g, '')
            .trim() || '';

        setPortfolioData({
          about: normalizeText(portfolioJson.data.about),
          experience: normalizeText(portfolioJson.data.experience),
          skills: normalizeText(portfolioJson.data.skills),
          contact: normalizeText(portfolioJson.data.contact),
          help: normalizeText(portfolioJson.data.help),
          blog: blogPosts.map(p => ({ ...p, content: normalizeText(p.content) })),
        });
      } catch (error) {
        console.warn('Using fallback JSON data:', error);
        // Keep using the default JSON data
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromStrapi();
  }, []);

  const { about, experience, skills, blog } = portfolioData;

  // Helper to parse markdown-like string to simple HTML
  const renderMarkdown = (text: string) => {
    // Parse inline markdown (bold, italic, code, links)
    const parseInline = (line: string): React.ReactNode => {
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let key = 0;

      while (remaining.length > 0) {
        // Bold: **text**
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Italic: *text* (but not **)
        const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
        // Inline code: `code`
        const codeMatch = remaining.match(/`([^`]+)`/);
        // Link: [text](url)
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

        // Find the earliest match
        const matches = [
          boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
          italicMatch ? { type: 'italic', match: italicMatch, index: italicMatch.index! } : null,
          codeMatch ? { type: 'code', match: codeMatch, index: codeMatch.index! } : null,
          linkMatch ? { type: 'link', match: linkMatch, index: linkMatch.index! } : null,
        ].filter(Boolean).sort((a, b) => a!.index - b!.index);

        if (matches.length === 0) {
          parts.push(remaining);
          break;
        }

        const first = matches[0]!;

        // Add text before match
        if (first.index > 0) {
          parts.push(remaining.substring(0, first.index));
        }

        // Add formatted element
        if (first.type === 'bold') {
          parts.push(<strong key={key++} className="font-bold text-white">{first.match[1]}</strong>);
        } else if (first.type === 'italic') {
          parts.push(<em key={key++} className="italic">{first.match[1]}</em>);
        } else if (first.type === 'code') {
          parts.push(<code key={key++} className="bg-gray-800 px-1 rounded text-cyan-300 font-mono text-sm">{first.match[1]}</code>);
        } else if (first.type === 'link') {
          parts.push(<a key={key++} href={first.match[2]} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{first.match[1]}</a>);
        }

        remaining = remaining.substring(first.index + first.match[0].length);
      }

      return parts.length === 1 ? parts[0] : <>{parts}</>;
    };

    if (!text) return null;
    return text.split('\n').map((line, i) => {
      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***') {
        return <hr key={i} className="border-gray-700 my-6" />;
      }
      // Headers
      if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold mb-6 text-white">{parseInline(line.replace('# ', ''))}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-blue-400">{parseInline(line.replace('## ', ''))}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold mt-6 mb-2 text-cyan-300">{parseInline(line.replace('### ', ''))}</h3>;
      // Blockquote
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4">{parseInline(line.replace('> ', ''))}</blockquote>;
      // List items
      if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-gray-300">{parseInline(line.replace('- ', ''))}</li>;
      if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-gray-300">{parseInline(line.replace('* ', ''))}</li>;
      // Empty line
      if (line.trim() === '') return <br key={i} />;
      // Regular paragraph
      return <p key={i} className="text-gray-300 leading-relaxed mb-2">{parseInline(line)}</p>;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-blue-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-blue-500 selection:text-white pb-20">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 animate-fade-in-up">
            <div className="inline-block px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-mono mb-4">
              AI Solutions Architect & Physicist
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Francisco <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Olmedo</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              I build intelligent systems that solve real business problems. Bridging the gap between Physics and Artificial Intelligence.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#contact" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center">
                Contact Me <ChevronRight className="ml-2" size={20} />
              </a>
              <a href="#experience" className="px-8 py-3 bg-transparent border border-gray-700 hover:border-blue-400 text-gray-300 hover:text-white font-bold rounded-lg transition-all flex items-center">
                View Work
              </a>
            </div>
          </div>
          {/* Abstract visual representation of "Physics + AI" could go here, for now a placeholder or styled div */}
          <div className="flex-1 flex justify-center relative">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 border-2 border-cyan-400/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">⚛️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center mb-8">
            <User className="text-blue-400 mr-4" size={32} />
            <h2 className="text-3xl font-bold">About Me</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            {renderMarkdown(about)}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="flex items-center mb-12">
          <Briefcase className="text-blue-400 mr-4" size={32} />
          <h2 className="text-3xl font-bold">Experience</h2>
        </div>
        <div className="space-y-8">
          {/* We need to parse the experience string better or structure the JSON better. 
                 For now, rendering the raw markdown-ish content in a styled container. 
                 Ideally, the JSON should be structured array for experience. */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
            {renderMarkdown(experience)}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="flex items-center mb-12">
          <Code className="text-blue-400 mr-4" size={32} />
          <h2 className="text-3xl font-bold">Tech Stack</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black/40 border border-gray-800 rounded-xl p-8 hover:border-cyan-500/50 transition-colors">
            {renderMarkdown(skills)}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section id="blog" className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="flex items-center mb-12">
          <FileText className="text-blue-400 mr-4" size={32} />
          <h2 className="text-3xl font-bold">Latest Logs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blog.map((post) => (
            <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="text-sm text-blue-400 mb-2">{post.date}</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">{post.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-3">
                {post.content.replace(/#/g, '').substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 md:px-20 max-w-7xl mx-auto mb-20">
        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-2xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

          <div className="flex items-center mb-8">
            <Mail className="text-blue-400 mr-4" size={32} />
            <h2 className="text-3xl font-bold">Contacto</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            {renderMarkdown(portfolioData.contact)}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
