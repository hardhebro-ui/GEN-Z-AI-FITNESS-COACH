import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Activity, Zap, Flame, LayoutGrid } from 'lucide-react';
import SEO from '../components/SEO';

const HowItWorksPage: React.FC = () => {
  const steps = [
    { 
      step: "01", 
      title: "Input Your Data", 
      desc: "Enter your body metrics, fitness goals, and available equipment in our smart form. We take into account your age, gender, weight, height, and experience level.",
      details: "Our AI uses this data to calculate your TDEE (Total Daily Energy Expenditure) and BMR (Basal Metabolic Rate) with high precision."
    },
    { 
      step: "02", 
      title: "AI Analysis & Generation", 
      desc: "Our AI engine processes your profile to create a custom workout and diet split. It selects exercises that match your equipment and goals.",
      details: "The algorithm ensures progressive overload is built into your plan, balancing intensity and recovery for optimal muscle growth or fat loss."
    },
    { 
      step: "03", 
      title: "Get Your Protocol", 
      desc: "View your plan instantly and download your free diet plan PDF. You get a full weekly schedule with sets, reps, and meal timing.",
      details: "Your plan is available immediately. No waiting for a coach, no expensive fees. Just a scientifically-backed fitness protocol in 60 seconds."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4">
      <SEO 
        title="How It Works | Fitin60ai.in AI Fitness Generator"
        description="Learn how our AI-powered fitness engine generates personalized workout and diet plans in 60 seconds. Three simple steps to your transformation."
        canonical="https://fitin60ai.in/how-it-works"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-6"
          >
            <Zap className="w-4 h-4 text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">The Process</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 font-display leading-none">
            How It <span className="text-neon">Works</span>
          </h1>
          <p className="text-zinc-500 font-bold max-w-2xl mx-auto leading-relaxed text-xl md:text-2xl">
            Three simple steps to your elite fitness protocol. No complex signups, just results.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-24">
          {steps.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row gap-12 items-center"
            >
              <div className="md:w-1/2 relative group">
                <div className="text-[12rem] md:text-[20rem] font-black text-white/5 absolute -top-20 -left-10 group-hover:text-neon/10 transition-colors leading-none">{item.step}</div>
                <div className="relative z-10 space-y-6">
                  <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight text-white">{item.title}</h2>
                  <p className="text-zinc-400 font-bold text-xl leading-relaxed">{item.desc}</p>
                  <p className="text-zinc-500 font-medium text-lg leading-relaxed border-l-4 border-neon pl-6">
                    {item.details}
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 w-full aspect-video bg-zinc-900/40 rounded-[3rem] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                {i === 0 && <Activity className="w-32 h-32 text-neon/20 group-hover:scale-110 transition-transform" />}
                {i === 1 && <Zap className="w-32 h-32 text-neon/20 group-hover:scale-110 transition-transform" />}
                {i === 2 && <LayoutGrid className="w-32 h-32 text-neon/20 group-hover:scale-110 transition-transform" />}
              </div>
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

export default HowItWorksPage;
