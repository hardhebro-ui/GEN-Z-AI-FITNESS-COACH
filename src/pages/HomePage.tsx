import React, { useEffect, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Activity, ShieldAlert, Zap, LayoutGrid, Star, ChevronDown, ChevronUp, ShieldCheck, Lock, Stethoscope } from 'lucide-react';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';

// Lazy load sections for better performance
const HowItWorksSection = lazy(() => import('../components/sections/HowItWorks').then(m => ({ default: m.HowItWorksSection })));
const BenefitsSection = lazy(() => import('../components/sections/Benefits').then(m => ({ default: m.BenefitsSection })));
const AboutSection = lazy(() => import('../components/sections/About').then(m => ({ default: m.AboutSection })));
const FAQSection = lazy(() => import('../components/sections/FAQ').then(m => ({ default: m.FAQSection })));
const ReviewsSection = lazy(() => import('../components/sections/Reviews').then(m => ({ default: m.ReviewsSection })));
const KnowledgeBaseSection = lazy(() => import('../components/sections/KnowledgeBase').then(m => ({ default: m.KnowledgeBaseSection })));
const ContactSection = lazy(() => import('../components/sections/Contact').then(m => ({ default: m.ContactSection })));

interface HomePageProps {
  onStart: () => void;
}

const SectionLoader = () => (
  <div className="h-48 w-full flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-neon/20 border-t-neon rounded-full animate-spin" />
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll Spy Logic
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) {
            navigate(`#${id}`, { replace: true });
          }
        }
      });
    };

    // Scroll to top or specific hash on page load
    const currentHash = window.location.hash;
    if (currentHash) {
      setTimeout(() => {
        const el = document.querySelector(currentHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    // Special case for hero section (top) to clear hash
    const heroSection = document.querySelector('section:first-of-type');
    if (heroSection) {
       const heroObserver = new IntersectionObserver((entries) => {
         if (entries[0].isIntersecting) {
           navigate('/', { replace: true });
         }
       }, { threshold: 0.5 });
       heroObserver.observe(heroSection);
       return () => {
         observer.disconnect();
         heroObserver.disconnect();
       };
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden font-sans flex flex-col">
      <SEO 
        title="Fitin60ai.in | AI Workout Plan Generator & Free Diet Plan PDF"
        description="Get your personalized fitness plan and free diet plan PDF in 60 seconds. AI-powered workout generator optimized for your body and goals."
        canonical="https://fitin60ai.in"
      />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[95vh] px-4 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon/5 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl text-center flex flex-col items-center justify-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Your AI Fitness Coach</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] mb-8 text-white max-w-4xl">
            Build Your Perfect Body Plan in <span className="text-neon relative inline-block">
              60 Seconds
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-neon/30 blur-sm rounded-full"></div>
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed mb-12 px-4">
            AI-powered workout and diet plans tailored to your body, goals, and lifestyle. <span className="text-white">No signup. Instant PDF.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto mb-16">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-6 text-xl font-black text-black bg-neon rounded-2xl transition-all shadow-[0_20px_40px_-15px_rgba(204,255,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(204,255,0,0.4)] uppercase italic tracking-wider"
            >
              Generate My Plan Free
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
            {[
              { icon: <ShieldAlert className="w-4 h-4 text-neon" />, text: "No Signup Required" },
              { icon: <Zap className="w-4 h-4 text-neon" />, text: "Instant PDF Export" },
              { icon: <Activity className="w-4 h-4 text-neon" />, text: "Beginner Friendly" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.icon}
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Dynamic Sections with Lazy Loading */}
      <Suspense fallback={<SectionLoader />}>
        <HowItWorksSection />
        <BenefitsSection />
        <AboutSection />
        <KnowledgeBaseSection />
        <ReviewsSection />
        <FAQSection />
        <ContactSection />
      </Suspense>

      {/* Trust Section (Small) */}
      <section className="py-24 px-4 bg-zinc-900/10 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: <Lock />, title: "Privacy First", desc: "We don't store your health data. Your profile stays on your device." },
            { icon: <Stethoscope />, title: "Medical Notice", desc: "AI guidance is for info only. Always consult a professional first." },
            { icon: <ShieldCheck />, title: "Safe Protocols", desc: "Scientific principles of overload and recovery built-in." }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 text-center space-y-4">
              <div className="w-12 h-12 bg-neon/10 rounded-xl flex items-center justify-center mx-auto text-neon">
                {item.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tight">{item.title}</h3>
              <p className="text-zinc-500 font-bold text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
