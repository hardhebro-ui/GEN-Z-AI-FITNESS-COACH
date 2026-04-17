import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import { Review } from '../../types';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ totalCount: 0, averageRating: 0 });

  useEffect(() => {
    const reviewsRef = collection(db, 'reviews');
    const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'), limit(6));
    
    const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
      const fetchedReviews: Review[] = [];
      let totalRating = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({
          id: doc.id,
          rating: data.rating,
          text: data.text || '',
          name: data.name || 'Anonymous',
          date: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });
        totalRating += data.rating;
      });
      setReviews(fetchedReviews);
      if (fetchedReviews.length > 0) {
        setStats(prev => ({
          totalCount: Math.max(prev.totalCount, snapshot.size),
          averageRating: Number((totalRating / fetchedReviews.length).toFixed(1))
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reviews-section');
    });

    const statsRef = doc(db, "stats", "global");
    const unsubscribeStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats(prev => ({
          totalCount: data.totalReviews || prev.totalCount,
          averageRating: data.averageRating ? Number(data.averageRating.toFixed(1)) : prev.averageRating
        }));
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

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter font-display uppercase italic text-center text-balance leading-none">
            Community <span className="text-neon">Feedback</span>
          </h2>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 md:w-12 md:h-12 ${i < Math.round(stats.averageRating) ? 'text-neon fill-neon drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'text-zinc-800'}`}
                  />
                ))}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-8xl font-black text-white font-display italic">{stats.averageRating}</span>
                <span className="text-xl md:text-3xl text-zinc-600 font-bold">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div 
              key={review.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="p-8 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 hover:border-neon/30 transition-all group flex flex-col"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-neon fill-neon' : 'text-zinc-800'}`}
                  />
                ))}
              </div>
              <p className="text-zinc-300 mb-8 flex-grow text-lg italic font-medium leading-relaxed">
                "{review.text || 'No written review provided'}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-xl bg-neon flex items-center justify-center text-black font-black text-lg font-display italic">
                  {getInitials(review.name)}
                </div>
                <div>
                  <p className="text-white font-black text-sm font-display uppercase italic">{review.name || 'Anonymous'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
