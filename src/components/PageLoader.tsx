import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const fitnessFacts = [
  "Consistency is the key to any successful fitness transformation.",
  "Muscle tissue burns more calories at rest than fat tissue.",
  "Proper hydration can significantly improve your workout performance.",
  "Rest days are when your muscles actually grow and recover.",
  "A balanced diet is 70% of the fitness equation.",
  "Compound movements like squats and deadlifts engage multiple muscle groups.",
  "Sleep is the most underrated performance enhancer.",
  "Artificial Intelligence can help optimize your training volume for better results.",
  "Progressive overload is essential for continuous muscle growth.",
  "Your fitness journey is a marathon, not a sprint."
];

const PageLoader: React.FC = () => {
  const [factIndex, setFactIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % fitnessFacts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-6 text-center space-y-8" data-google-adsense-ignore="true">
      <div className="relative">
        <div className="absolute inset-0 bg-neon/20 blur-2xl rounded-full animate-pulse" />
        <Loader2 className="w-16 h-16 text-neon animate-spin relative z-10" />
      </div>
      <div className="max-w-md space-y-4">
        <p className="text-neon text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Loading Protocol...</p>
        <div className="h-20 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-zinc-400 text-sm font-medium leading-relaxed italic"
            >
              "{fitnessFacts[factIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
