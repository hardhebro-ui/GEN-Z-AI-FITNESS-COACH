import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowRight, Activity, Loader2, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

interface GuidesPageProps {
  onShowGuide: (id: string) => void;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime?: number;
  tags?: string[];
}

const GuidesPage: React.FC<GuidesPageProps> = ({ onShowGuide }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Filter by published=true in the query to satisfy security rules
        const q = query(collection(db, 'blogPosts'), where('published', '==', true));
        const querySnapshot = await getDocs(q);
        const fetchedArticles = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as any))
          .sort((a, b) => {
            const dateA = a.createdAt?.seconds || 0;
            const dateB = b.createdAt?.seconds || 0;
            return dateB - dateA;
          })
          .map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            readingTime: post.readingTime,
            tags: post.tags
          }));
          
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-neon animate-spin" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Knowledge Base...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <motion.div 
                key={article.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onShowGuide(article.id)}
                className="p-10 rounded-[3rem] bg-zinc-900/30 border border-white/5 hover:border-neon/30 transition-all group cursor-pointer shadow-2xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-neon/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-neon" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neon/60">{article.category}</span>
                    {article.readingTime && (
                      <div className="flex items-center gap-1.5 text-zinc-600 text-[9px] font-black uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {article.readingTime} min
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white group-hover:text-neon transition-colors leading-tight">{article.title}</h3>
                  <p className="text-zinc-500 font-bold leading-relaxed text-lg line-clamp-3">{article.excerpt}</p>
                </div>
                <div className="mt-8 flex items-center gap-3 text-neon text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Full Guide <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
            {!loading && articles.length === 0 && (
              <div className="col-span-full text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
                <FileText className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold">No articles found. Check back soon!</p>
              </div>
            )}
          </div>
        )}

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
