import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How does the AI workout plan generator work?",
      answer: "Our AI analyzes your body metrics, fitness goals, available equipment, and experience level to craft a scientifically-backed workout split. It uses advanced algorithms to ensure progressive overload and balanced muscle development."
    },
    {
      question: "Is the diet plan really personalized?",
      answer: "Yes! The AI calculates your TDEE (Total Daily Energy Expenditure) and macros based on your specific inputs. It then generates a meal plan that fits your dietary preferences, budget, and fitness objectives."
    },
    {
      question: "Can I download my fitness plan as a PDF?",
      answer: "Absolutely. Once your plan is generated, you can unlock a high-quality, programmatic PDF version that you can keep on your phone or print for the gym."
    },
    {
      question: "Is Fitin60ai.in free to use?",
      answer: "Generating and viewing your plan is completely free. We prioritize accessibility to help everyone start their fitness journey without financial barriers."
    },
    {
      question: "Do I need a gym membership for these plans?",
      answer: "No. You can specify your workout location (Gym, Home, or Outdoors) and available equipment. The AI will adapt the exercises accordingly."
    },
    {
      question: "Can I use this if I'm a complete beginner?",
      answer: "Yes! Fitin60ai.in is designed for all levels. The AI prioritizes foundational movements and safe progression for beginners."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-6"
          >
            <Zap className="w-4 h-4 text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">Support</span>
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 font-display leading-none">
            Common <span className="text-neon">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:border-white/10"
            >
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-8 md:p-10 flex items-center justify-between text-left"
              >
                <span className="text-xl md:text-2xl font-black uppercase italic tracking-tight text-white">{faq.question}</span>
                {openFaq === i ? <ChevronUp className="w-8 h-8 text-neon" /> : <ChevronDown className="w-8 h-8 text-zinc-500" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-8 md:px-10 pb-10"
                  >
                    <p className="text-zinc-400 font-bold leading-relaxed text-lg md:text-xl">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
