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
    <div className="min-h-[100dvh] bg-zinc-950 text-white relative overflow-x-hidden font-sans flex flex-col">
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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-8 md:py-20">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl text-center flex flex-col items-center justify-center min-h-[80vh] md:min-h-0"
        >
          {/* Floating Icon */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 md:p-5 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Activity className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-8xl font-extrabold tracking-tight leading-tight mb-4">
            Your AI Fitness <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Coach
            </span>
          </h1>
          
          <p className="text-base md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed mb-8 px-2">
            Personalized workout & diet plans tailored to your body in 60 seconds — no login required.
          </p>

          {/* Stat Badges */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 text-xs md:text-sm font-medium text-zinc-300">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
              60 Sec Plan
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 text-xs md:text-sm font-medium text-zinc-300">
              <Flame className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />
              AI Powered
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 text-xs md:text-sm font-medium text-zinc-300">
              <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400" />
              PDF Export
            </div>
          </div>

          {/* CTA Button - Sticky on mobile bottom, normal on desktop */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-50 md:relative md:bg-none md:p-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 md:px-10 md:py-5 text-lg md:text-xl font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl md:rounded-full transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] md:hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] min-h-[56px]"
            >
              Generate My Plan Now
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          </div>
        </motion.div>

        {/* Reviews Section */}
        {stats.totalCount > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-6xl mt-12 md:mt-32 pb-40 md:pb-12"
          >
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3">Trusted by Fitness Enthusiasts</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 md:w-6 md:h-6 ${i < Math.round(stats.averageRating) ? 'text-emerald-400 fill-emerald-400' : 'text-zinc-700'}`}
                    />
                  ))}
                </div>
                <span className="text-xl md:text-2xl font-bold">{stats.averageRating}</span>
                <span className="text-sm md:text-base text-zinc-500 font-medium">({stats.totalCount} reviews)</span>
              </div>
            </div>

            {/* Horizontal Scrollable Cards */}
            <div className="flex overflow-x-auto pb-6 pt-2 px-4 -mx-4 snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {reviews.map((review, index) => (
                <motion.div 
                  key={review.id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="snap-center shrink-0 w-[280px] md:w-[400px] p-6 md:p-8 rounded-2xl md:rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col"
                >
                  <div className="flex items-center gap-1 mb-4 md:mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 md:w-5 md:h-5 ${i < review.rating ? 'text-emerald-400 fill-emerald-400' : 'text-zinc-700'}`}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-6 flex-grow text-base md:text-lg leading-relaxed line-clamp-4">"{review.text}"</p>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-zinc-950 font-bold text-base md:text-lg shadow-inner shrink-0">
                      {getInitials(review.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm md:text-base truncate">{review.name || 'Anonymous'}</p>
                      <p className="text-xs md:text-sm text-zinc-500">Verified User</p>
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
