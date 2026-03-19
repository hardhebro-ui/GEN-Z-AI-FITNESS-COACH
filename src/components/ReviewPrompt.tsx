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
  const [submitted, setSubmitted] = useState(false);

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
          text: text ? text.substring(0, 200) : null,
          name: name || 'Anonymous',
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
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-zinc-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white border-t md:border border-zinc-200 rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-zinc-100 shrink-0">
            <h3 className="text-xl font-bold text-zinc-900">How was your experience?</h3>
            {!submitted && (
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors bg-zinc-50">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="p-5 md:p-6 overflow-y-auto">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-8"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-zinc-900">Thank You!</h4>
                <p className="text-zinc-600">Your feedback helps us improve.</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-2 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoveredRating || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 mb-2">Review (Optional)</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value.substring(0, 200))}
                      placeholder="Tell us what you think..."
                      rows={3}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-4 text-base text-zinc-900 focus:ring-2 focus:ring-emerald-600 outline-none resize-none transition-all"
                    />
                    <div className="text-right text-xs text-zinc-500 mt-1">{text.length}/200</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-600 mb-2">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anonymous"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-4 text-base text-zinc-900 focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full py-4 bg-emerald-600 text-white font-semibold text-lg rounded-2xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
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
