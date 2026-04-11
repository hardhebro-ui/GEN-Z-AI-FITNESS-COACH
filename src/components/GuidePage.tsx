import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Tag, Share2, Bookmark, Activity, Dumbbell, Flame, LayoutGrid, Zap, Coffee } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Guide } from '../data/guides';
import SEO from './SEO';

interface GuidePageProps {
  guide: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    metaDescription?: string;
    category: string;
    readingTime?: number;
    tags?: string[];
    icon?: string;
  };
  onBack: () => void;
}

const GuidePage: React.FC<GuidePageProps> = ({ guide, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [guide.id]);

  const getIcon = (iconName?: string) => {
    if (!iconName) return <Activity className="w-6 h-6" />;
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'LayoutGrid': return <LayoutGrid className="w-6 h-6" />;
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Coffee': return <Coffee className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  const description = guide.metaDescription || guide.excerpt || "";
  const readTime = guide.readingTime ? `${guide.readingTime} min` : `${Math.ceil(guide.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": guide.title,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": "Fitin60ai.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fitin60ai.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fitin60ai.in/favicon.svg"
      }
    },
    "datePublished": "2026-04-05",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://fitin60ai.in/guides/${guide.id}`
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 pt-24 selection:bg-neon selection:text-black">
      <SEO 
        title={`${guide.title} | Fitin60ai.in Fitness Knowledge Base`}
        description={description}
        canonical={`https://fitin60ai.in/guides/${guide.id}`}
        ogType="article"
        schema={articleSchema}
      />

      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-neon/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <main className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-neon transition-colors group text-sm font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Base
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-zinc-900/50 rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-all">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-2 bg-zinc-900/50 rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-neon/10 border border-neon/20 rounded-2xl text-neon"
          >
            {getIcon(guide.icon)}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{guide.category}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none"
          >
            {guide.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-zinc-500 text-xs font-black uppercase tracking-widest"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neon" />
              {readTime} Read
            </div>
            {guide.tags && guide.tags.length > 0 ? (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-neon" />
                <div className="flex gap-2">
                  {guide.tags.map(tag => (
                    <span key={tag} className="text-zinc-400 hover:text-neon transition-colors">#{tag}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-neon" />
                Knowledge Base
              </div>
            )}
          </motion.div>
        </header>

        {/* Content */}
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-neon max-w-none 
            prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tight
            prose-h1:text-4xl md:prose-h1:text-6xl prose-h1:text-neon prose-h1:mb-12
            prose-h2:text-2xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-l-4 prose-h2:border-neon prose-h2:pl-6
            prose-p:text-zinc-400 prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-p:font-medium
            prose-li:text-zinc-400 prose-li:text-lg prose-strong:text-white prose-strong:font-black
            prose-hr:border-white/5"
        >
          <div dangerouslySetInnerHTML={{ __html: guide.content }} />
        </motion.article>

        {/* Footer CTA */}
        <footer className="pt-20 border-t border-white/5">
          <div className="p-10 md:p-16 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] text-center space-y-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                Ready to Apply This <span className="text-neon">Knowledge?</span>
              </h3>
              <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-xl mx-auto">
                Let our AI build a custom protocol based on these scientific principles.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center gap-3 px-10 py-5 bg-neon text-black font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:scale-105 transition-all font-display uppercase italic"
              >
                Start Your Plan
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default GuidePage;
