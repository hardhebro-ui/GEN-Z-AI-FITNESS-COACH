import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  return (
    <section id="benefits" className="w-full max-w-6xl mx-auto py-24 px-4 bg-zinc-900/20 rounded-[4rem] border border-white/5 p-12 md:p-24 mb-24 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-display leading-none"
          >
            Why Choose <span className="text-neon">AI Fitness</span> Plans?
          </motion.h2>
          <p className="text-zinc-400 font-bold text-lg leading-relaxed">
            Traditional generic plans don't account for your unique biology. Our AI-driven approach ensures every set, rep, and calorie is optimized for your specific transformation.
          </p>
          <ul className="space-y-6">
            {[
              "Scientifically-backed workout splits",
              "Macro-balanced personalized diet plans",
              "Adaptive to your home or gym equipment",
              "Instant generation - no waiting for coaches",
              "Free PDF export for easy tracking"
            ].map((benefit, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 text-white font-black uppercase italic tracking-tight text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-neon flex items-center justify-center shrink-0">
                  <Zap className="w-3 h-3 text-black" />
                </div>
                {benefit}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-neon/20 blur-[100px] rounded-full" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
            viewport={{ once: true }}
            className="relative bg-zinc-950 border border-white/10 rounded-[3rem] p-8 shadow-2xl"
          >
            <div className="space-y-6">
              <div className="h-4 w-2/3 bg-zinc-900 rounded-full" />
              <div className="h-4 w-full bg-zinc-900 rounded-full" />
              <div className="h-4 w-1/2 bg-neon/20 rounded-full" />
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="h-24 bg-zinc-900 rounded-2xl" />
                <div className="h-24 bg-zinc-900 rounded-2xl" />
              </div>
              <div className="h-12 w-full bg-neon rounded-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
