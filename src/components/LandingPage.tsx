import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Star, ArrowRight } from 'lucide-react';
import { Review } from '../types';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ totalCount: 0, averageRating: 0 });

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setStats({
          totalCount: data.totalCount || 0,
          averageRating: data.averageRating || 0
        });
      })
      .catch(err => console.error('Failed to fetch reviews:', err));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full text-center space-y-8"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-emerald-50 rounded-full">
            <Dumbbell className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Your AI Fitness <span className="text-emerald-600">Coach</span>
        </h1>
        
        <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
          Generate a highly personalized workout and diet plan in 60 seconds. 
          No login required. Export to PDF and start your journey today.
        </p>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-500 transition-all active:scale-95 shadow-md hover:shadow-lg"
        >
          Generate My Plan Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {stats.totalCount > 0 && (
          <div className="pt-16">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i < Math.round(stats.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold">{stats.averageRating}</span>
              <span className="text-zinc-500">({stats.totalCount} reviews)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-700 mb-4 line-clamp-3">{review.text}</p>
                  <p className="text-sm text-zinc-500 font-medium">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
