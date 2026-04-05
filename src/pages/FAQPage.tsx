import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Zap, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const FAQPage: React.FC = () => {
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
      answer: "Generating and viewing your plan is completely free. We offer a 'Support Us' or 'Share to Unlock' model for the PDF download to keep our AI servers running and the tool accessible to everyone."
    },
    {
      question: "Do I need a gym membership for these plans?",
      answer: "No. You can specify your workout location (Gym, Home, or Outdoors) and available equipment. The AI will adapt the exercises accordingly, providing effective bodyweight alternatives if needed."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4">
      <SEO 
        title="Frequently Asked Questions | Fitin60ai.in Support"
        description="Find answers to common questions about our AI workout generator, diet plans, PDF downloads, and more. Everything you need to know to get started."
        canonical="https://fitin60ai.in/faq"
        schema={faqSchema}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-6"
          >
            <Zap className="w-4 h-4 text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">Support</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 font-display leading-none">
            Common <span className="text-neon">Questions</span>
          </h1>
          <p className="text-zinc-500 font-bold max-w-2xl mx-auto leading-relaxed text-xl md:text-2xl">
            Everything you need to know about your AI-driven fitness journey.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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

        <div className="mt-32 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-4 px-12 py-6 bg-neon text-black font-black text-2xl rounded-3xl shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:scale-105 transition-all font-display uppercase italic"
          >
            Start Your Plan Now
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
