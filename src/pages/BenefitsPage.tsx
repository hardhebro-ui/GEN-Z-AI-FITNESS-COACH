import React from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Dumbbell, Flame, ShieldCheck, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const BenefitsPage: React.FC = () => {
  const benefits = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Scientifically-Backed Workout Splits",
      desc: "Traditional generic plans don't account for your unique biology. Our AI-driven approach ensures every set, rep, and calorie is optimized for your specific transformation."
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "Macro-Balanced Personalized Diet Plans",
      desc: "Get a full meal plan that fits your dietary preferences, budget, and fitness objectives. Our AI calculates your TDEE and macros based on your specific inputs."
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Adaptive to Your Home or Gym Equipment",
      desc: "No gym membership? No problem. Specify your workout location and available equipment. The AI will adapt the exercises accordingly, providing effective bodyweight alternatives if needed."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Generation - No Waiting for Coaches",
      desc: "Get your personalized fitness plan and free diet plan PDF in 60 seconds. No complex signups, no waiting for a human coach to respond."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Free PDF Export for Easy Tracking",
      desc: "Unlock a high-quality, programmatic PDF version that you can keep on your phone or print for the gym. Track your progress effortlessly."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4">
      <SEO 
        title="Why Choose AI Fitness | Fitin60ai.in Benefits"
        description="Discover the advantages of AI-powered fitness plans. Personalized workouts, macro-balanced diets, and instant results tailored to your body and goals."
        canonical="https://fitin60ai.in/ai-fitness-benefits"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-6"
          >
            <Activity className="w-4 h-4 text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">Why AI?</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 font-display leading-none">
            AI Fitness <span className="text-neon">Benefits</span>
          </h1>
          <p className="text-zinc-500 font-bold max-w-2xl mx-auto leading-relaxed text-xl md:text-2xl">
            The future of fitness is personalized. Discover why AI-driven protocols are superior to generic plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 md:p-12 rounded-[3rem] bg-zinc-900/30 backdrop-blur-3xl border border-white/5 group hover:border-neon/30 transition-all shadow-2xl"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-zinc-950 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl text-neon">
                {benefit.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight mb-6 font-display">{benefit.title}</h3>
              <p className="text-zinc-500 font-bold leading-relaxed text-lg md:text-xl">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-4 px-12 py-6 bg-neon text-black font-black text-2xl rounded-3xl shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:scale-105 transition-all font-display uppercase italic"
          >
            Experience the AI Difference
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenefitsPage;
