import { Briefcase, ChevronRight, Code, FileText, Github, Linkedin, Mail, User } from 'lucide-react';
import React from 'react';
import portfolioData from '../data/portfolio.json';

const LandingPage: React.FC = () => {
  const { about, experience, skills, contact, blog } = portfolioData;

  // Helper to parse markdown-like string to simple HTML (very basic for now)
  // In a real app, use a proper markdown parser like react-markdown
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold mb-6 text-white">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-blue-400">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold mt-6 mb-2 text-cyan-300">{line.replace('### ', '')}</h3>;
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4">{line.replace('> ', '')}</blockquote>;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-gray-300">{line.replace('- ', '')}</li>;
      if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-gray-300">{line.replace('* ', '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-gray-300 leading-relaxed mb-2">{line}</p>;
    });
  };

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
         <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
            
            <Mail className="mx-auto text-blue-400 mb-6" size={48} />
            <h2 className="text-4xl font-bold mb-6">Let's Build Something Amazing</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Whether you need a complex AI architecture or just want to discuss physics, I'm always open to new ideas.
            </p>
            
            <div className="flex justify-center gap-6">
                <a href="mailto:fran@blakia.es" className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                    Email Me
                </a>
                <a href="https://linkedin.com/in/francisco-olmedo-cortes/" target="_blank" rel="noreferrer" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors flex items-center">
                    <Linkedin className="mr-2" size={20} /> LinkedIn
                </a>
                <a href="https://github.com/FullFran" target="_blank" rel="noreferrer" className="px-8 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                    <Github className="mr-2" size={20} /> GitHub
                </a>
            </div>
         </div>
      </section>

    </div>
  );
};

export default LandingPage;
