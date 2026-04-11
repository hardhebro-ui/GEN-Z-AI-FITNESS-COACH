import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, Users, ArrowRight, Activity } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Review } from '../types';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import SEO from '../components/SEO';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ totalCount: 0, averageRating: 0 });
  const [totalPlans, setTotalPlans] = useState<number>(0);

  useEffect(() => {
    const reviewsRef = collection(db, 'reviews');
    const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'), limit(50));
    
    const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
      const fetchedReviews: Review[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({
          id: doc.id,
          rating: data.rating,
          text: data.text || '',
          name: data.name || 'Anonymous',
          date: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });
      });
      setReviews(fetchedReviews);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reviews-page');
    });

    const statsRef = doc(db, "stats", "global");
    const unsubscribeStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalPlans(data.totalPlans || 0);
        setStats({
          totalCount: data.totalReviews || 0,
          averageRating: data.averageRating ? Number(data.averageRating.toFixed(1)) : 0
        });
      }
    });

    return () => {
      unsubscribeReviews();
      unsubscribeStats();
    };
  }, []);

  const getInitials = (name: string | null) => {
    if (!name || name.trim() === '') return 'AN';
    return name.trim().substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4">
      <SEO 
        title="Community Feedback & Reviews | Fitin60ai.in Success Stories"
        description="Read what our community says about their AI-generated workout and diet plans. Real athletes, real results, and honest feedback."
        canonical="https://fitin60ai.in/reviews"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-6"
          >
            <Users className="w-4 h-4 text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">Success Stories</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 font-display leading-none">
            Community <span className="text-neon">Feedback</span>
          </h1>
          
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-10 h-10 md:w-14 md:h-14 ${i < Math.round(stats.averageRating) ? 'text-neon fill-neon drop-shadow-[0_0_20px_rgba(204,255,0,0.5)]' : 'text-zinc-800'}`}
                />
              ))}
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl md:text-9xl font-black text-white font-display italic">{stats.averageRating}</span>
              <span className="text-2xl md:text-4xl text-zinc-600 font-bold">/ 5.0</span>
            </div>
            <p className="text-zinc-500 font-bold text-xl uppercase tracking-widest">Based on {stats.totalCount} reviews & {totalPlans}+ plans generated</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div 
              key={review.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-10 rounded-[3rem] bg-zinc-900/30 backdrop-blur-3xl border border-white/5 hover:border-neon/30 transition-all group shadow-2xl flex flex-col"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-neon fill-neon' : 'text-zinc-800'}`}
                  />
                ))}
              </div>
              <p className="text-zinc-300 mb-8 flex-grow text-xl italic font-medium leading-relaxed">
                "{review.text || 'No written review provided'}"
              </p>
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                <div className="w-12 h-12 rounded-xl bg-neon flex items-center justify-center text-black font-black text-lg font-display italic">
                  {getInitials(review.name)}
                </div>
                <div>
                  <p className="text-white font-black text-lg font-display uppercase italic">{review.name || 'Anonymous'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-4 px-12 py-6 bg-neon text-black font-black text-2xl rounded-3xl shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:scale-105 transition-all font-display uppercase italic"
          >
            Join the Community
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
