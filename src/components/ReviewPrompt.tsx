import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { collection, addDoc, serverTimestamp, doc, runTransaction } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { db } from '../firebase';

interface ReviewPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string, name: string) => void;
}

export default function ReviewPrompt({ isOpen, onClose, onSubmit }: ReviewPromptProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const availableTags = [
    "Great for beginners",
    "Helpful diet plan",
    "Clear instructions",
    "Effective split",
    "Easy to follow",
    "Highly recommended"
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    try {
      // Use a transaction to update stats and add review
      await runTransaction(db, async (transaction) => {
        const statsRef = doc(db, 'stats', 'global');
        const statsDoc = await transaction.get(statsRef);
        
        const newReviewRef = doc(collection(db, 'reviews'));
        
        let newTotalReviews = 1;
        let newAverageRating = rating;
        
        if (statsDoc.exists()) {
          const data = statsDoc.data();
          const currentTotal = data.totalReviews || 0;
          const currentAvg = data.averageRating || 0;
          
          newTotalReviews = currentTotal + 1;
          newAverageRating = ((currentAvg * currentTotal) + rating) / newTotalReviews;
        }
        
        transaction.set(statsRef, { 
          totalReviews: newTotalReviews, 
          averageRating: newAverageRating 
        }, { merge: true });
        
        transaction.set(newReviewRef, {
          rating,
          text: text.trim() || null,
          name: name.trim() || 'Anonymous',
          tags: selectedTags,
          createdAt: serverTimestamp()
        });
      });
      
      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669']
      });
      
      setTimeout(() => {
        onClose();
        onSubmit(rating, text, name);
      }, 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'reviews/stats');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-zinc-950 border-t md:border border-white/10 rounded-t-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col relative"
        >
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 shrink-0">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Rate the <span className="text-neon">Gains</span></h3>
            {!submitted && (
              <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white rounded-full hover:bg-white/5 transition-all active:scale-90">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-12"
              >
                <div className="w-20 h-20 bg-neon/10 text-neon rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(204,255,0,0.2)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-3xl font-black uppercase italic tracking-tight text-white">Respect!</h4>
                <p className="text-zinc-500 font-bold">Your feedback fuels the AI. Keep grinding.</p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      whileTap={{ scale: 0.8 }}
                      className="p-2 transition-all"
                    >
                      <Star
                        className={`w-10 h-10 md:w-12 md:h-12 transition-all ${
                          star <= (hoveredRating || rating)
                            ? 'text-neon fill-neon drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]'
                            : 'text-zinc-800'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Quick Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                            selectedTags.includes(tag)
                              ? 'bg-neon border-neon text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                              : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Review (Optional)</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value.substring(0, 200))}
                      placeholder="Tell us what you think..."
                      rows={3}
                      className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-6 py-5 text-base text-white placeholder:text-zinc-600 focus:border-neon outline-none resize-none transition-all font-bold"
                    />
                    <div className="text-right text-[10px] font-black text-zinc-700 uppercase tracking-widest mt-1">{text.length}/200</div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anonymous"
                      className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-6 py-5 text-base text-white placeholder:text-zinc-600 focus:border-neon outline-none transition-all font-bold"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full py-5 bg-neon text-black font-black uppercase italic tracking-widest text-xs rounded-2xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4 active:scale-95"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
