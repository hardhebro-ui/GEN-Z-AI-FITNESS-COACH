import React from 'react';
import { motion } from 'motion/react';
import { Activity, ArrowRight } from 'lucide-react';

export const KnowledgeBaseSection: React.FC = () => {
  const articles = [
    { id: "build-muscle-ai", title: "How to Build Muscle with AI", desc: "Learn how artificial intelligence is revolutionizing hypertrophy and strength training." },
    { id: "fat-loss-protocol", title: "The Ultimate Fat Loss Protocol", desc: "A deep dive into calorie deficits, macros, and metabolic optimization." },
    { id: "home-vs-gym", title: "Home vs Gym: Which is Better?", desc: "Comparing the effectiveness of bodyweight training versus heavy iron." },
    { id: "mastering-macros", title: "Mastering Your Macros", desc: "Everything you need to know about proteins, fats, and carbohydrates for your body type." },
    { id: "progressive-overload", title: "Progressive Overload 101", desc: "The fundamental principle of muscle growth explained for beginners." },
    { id: "supplements-guide", title: "Supplements That Actually Work", desc: "Cutting through the noise to find the scientifically-backed performance enhancers." }
  ];

  return (
    <section id="guides" className="py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 font-display leading-none text-balance">
            Fitness <span className="text-neon">Knowledge Base</span>
          </h2>
          <p className="text-zinc-500 font-bold max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
            Master your transformation with our AI-curated fitness guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="p-8 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 hover:border-neon/30 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-neon" />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-4 group-hover:text-neon transition-colors">{article.title}</h3>
              <p className="text-zinc-500 font-bold leading-relaxed text-sm">{article.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-neon text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Read Guide <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
