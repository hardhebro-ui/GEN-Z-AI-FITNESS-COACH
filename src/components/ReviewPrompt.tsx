import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

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
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, text, name: name || 'Anonymous' })
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
      console.error('Failed to submit review', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-50/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
            <h3 className="text-xl font-bold text-zinc-900">How was your experience?</h3>
            {!submitted && (
              <button onClick={onClose} className="p-2 text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="p-6">
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 mb-2">Review (Optional)</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value.substring(0, 200))}
                      placeholder="Tell us what you think..."
                      rows={3}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-emerald-600 outline-none resize-none"
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
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
