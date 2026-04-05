import React from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowRight, Activity } from 'lucide-react';
import SEO from '../components/SEO';

interface GuidesPageProps {
  onShowGuide: (id: string) => void;
}

const GuidesPage: React.FC<GuidesPageProps> = ({ onShowGuide }) => {
  const guides = [
    { id: "build-muscle-ai", title: "How to Build Muscle with AI", desc: "Learn how artificial intelligence is revolutionizing hypertrophy and strength training." },
    { id: "fat-loss-protocol", title: "The Ultimate Fat Loss Protocol", desc: "A deep dive into calorie deficits, macros, and metabolic optimization." },
    { id: "home-vs-gym", title: "Home vs Gym: Which is Better?", desc: "Comparing the effectiveness of bodyweight training versus heavy iron." },
    { id: "mastering-macros", title: "Mastering Your Macros", desc: "Everything you need to know about proteins, fats, and carbohydrates for your body type." },
    { id: "progressive-overload", title: "Progressive Overload 101", desc: "The fundamental principle of muscle growth explained for beginners." },
    { id: "supplements-guide", title: "Supplements That Actually Work", desc: "Cutting through the noise to find the scientifically-backed performance enhancers." }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4">
      <SEO 
        title="Fitness Knowledge Base | AI-Curated Guides"
        description="Master your transformation with our AI-curated fitness guides. Learn about muscle building, fat loss, nutrition, and progressive overload."
        canonical="https://fitin60ai.in/blog"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-6"
          >
            <Activity className="w-4 h-4 text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">Education</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 font-display leading-none">
            Knowledge <span className="text-neon">Base</span>
          </h1>
          <p className="text-zinc-500 font-bold max-w-2xl mx-auto leading-relaxed text-xl md:text-2xl">
            Master your transformation with our AI-curated fitness guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((article, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onShowGuide(article.id)}
              className="p-10 rounded-[3rem] bg-zinc-900/30 border border-white/5 hover:border-neon/30 transition-all group cursor-pointer shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-neon/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-neon" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white mb-6 group-hover:text-neon transition-colors leading-tight">{article.title}</h3>
              <p className="text-zinc-500 font-bold leading-relaxed text-lg">{article.desc}</p>
              <div className="mt-8 flex items-center gap-3 text-neon text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Read Full Guide <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-4 px-12 py-6 bg-neon text-black font-black text-2xl rounded-3xl shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:scale-105 transition-all font-display uppercase italic"
          >
            Get Your Personalized Plan
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;
