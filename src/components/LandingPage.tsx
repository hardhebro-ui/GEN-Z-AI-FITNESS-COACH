import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Star, ArrowRight, Zap, Flame, FileText, Activity } from 'lucide-react';
import { Review } from '../types';
import { collection, getDocs, query, orderBy, limit, getAggregateFromServer, average, count } from 'firebase/firestore';
import { db } from '../firebase';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ totalCount: 0, averageRating: 0 });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const collRef = collection(db, 'reviews');
        
        // Fetch stats
        const aggregateQuery = await getAggregateFromServer(collRef, {
          totalCount: count(),
          averageRating: average('rating')
        });
        
        const totalCount = aggregateQuery.data().totalCount;
        const averageRating = aggregateQuery.data().averageRating || 0;
        
        setStats({
          totalCount,
          averageRating: Number(averageRating.toFixed(1))
        });

        // Fetch latest 11 reviews
        const q = query(collRef, orderBy('createdAt', 'desc'), limit(11));
        const querySnapshot = await getDocs(q);
        const fetchedReviews: Review[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedReviews.push({
            id: doc.id,
            rating: data.rating,
            text: data.text,
            name: data.name,
            date: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
          });
        });

        setReviews(fetchedReviews);
      } catch (err) {
        console.error('Failed to fetch reviews from Firestore:', err);
      }
    };

    fetchReviews();
  }, []);

  const getInitials = (name: string) => {
    return (name || 'Anonymous').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden font-sans">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/90 to-zinc-950"></div>
        {/* Abstract neon glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl w-full text-center space-y-10"
        >
          {/* Floating Icon */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex justify-center mb-4"
          >
            <div className="p-5 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Activity className="w-12 h-12 text-emerald-400" />
            </div>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-tight">
            Your AI Fitness <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Coach
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Personalized workout & diet plans tailored to your body in 60 seconds — no login required.
          </p>

          {/* Stat Badges */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 text-sm font-medium text-zinc-300">
              <Zap className="w-4 h-4 text-emerald-400" />
              60 Sec Plan
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 text-sm font-medium text-zinc-300">
              <Flame className="w-4 h-4 text-orange-400" />
              AI Powered
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 text-sm font-medium text-zinc-300">
              <FileText className="w-4 h-4 text-cyan-400" />
              PDF Export
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-xl font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)]"
            >
              Generate My Plan Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* Reviews Section */}
        {stats.totalCount > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-full max-w-6xl mt-32"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Fitness Enthusiasts</h2>
              <div className="flex items-center justify-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < Math.round(stats.averageRating) ? 'text-emerald-400 fill-emerald-400' : 'text-zinc-700'}`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold">{stats.averageRating}</span>
                <span className="text-zinc-500 font-medium">({stats.totalCount} reviews)</span>
              </div>
            </div>

            {/* Horizontal Scrollable Cards */}
            <div className="flex overflow-x-auto pb-8 pt-4 px-4 -mx-4 snap-x snap-mandatory hide-scrollbar gap-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {reviews.map((review, index) => (
                <motion.div 
                  key={review.id} 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="snap-center shrink-0 w-[320px] md:w-[400px] p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 shadow-xl hover:bg-zinc-900/80 transition-all flex flex-col"
                >
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-emerald-400 fill-emerald-400' : 'text-zinc-700'}`}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-8 flex-grow text-lg leading-relaxed line-clamp-4">"{review.text}"</p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-zinc-950 font-bold text-lg shadow-inner">
                      {getInitials(review.name)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{review.name || 'Anonymous'}</p>
                      <p className="text-sm text-zinc-500">Verified User</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
