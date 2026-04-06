import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Activity, ShieldAlert, Zap, AlertTriangle, LayoutGrid } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

interface HomePageProps {
  onStart: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden font-sans flex flex-col">
      <SEO 
        title="Fitin60ai.in | AI Workout Plan Generator & Free Diet Plan PDF"
        description="Get your personalized fitness plan and free diet plan PDF in 60 seconds. AI-powered workout generator optimized for your body and goals."
        canonical="https://fitin60ai.in"
      />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle Mesh Gradient */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon/5 rounded-full blur-[120px]"></div>
          
          {/* Very Faint Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl text-center flex flex-col items-center justify-center relative z-10"
        >
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Your AI Fitness Coach</span>
          </motion.div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] mb-8 text-white max-w-4xl">
            Build Your Perfect Body Plan in <span className="text-neon relative inline-block">
              60 Seconds
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-neon/30 blur-sm rounded-full"></div>
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed mb-12 px-4">
            AI-powered workout and diet plans tailored to your body, goals, and lifestyle. <span className="text-white">No signup. Instant PDF.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto mb-16">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 text-lg font-black text-black bg-neon rounded-2xl transition-all shadow-[0_20px_40px_-15px_rgba(204,255,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(204,255,0,0.4)] uppercase italic tracking-wider"
            >
              Generate My Plan Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <Link 
              to="/explore-plans"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 text-lg font-black text-white bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-sm uppercase italic tracking-wider"
            >
              Explore Plans
              <LayoutGrid className="w-5 h-5" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-neon" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No Signup Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Instant PDF Export</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-neon" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Beginner Friendly</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Short How It Works Preview */}
      <section className="w-full max-w-6xl mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 font-display">
            How It <span className="text-neon">Works</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "Input Data", desc: "Enter your body metrics, goals, and available equipment." },
            { step: "02", title: "AI Analysis", desc: "Our AI engine processes your profile to create a custom split." },
            { step: "03", title: "Get Protocol", desc: "View your plan instantly and download your free PDF." }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-neon/10 transition-colors">{item.step}</div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">{item.title}</h3>
                <p className="text-zinc-500 font-bold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/how-it-works" className="text-neon font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:gap-4 transition-all">
            See Full Process <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
