import React from 'react';
import { motion } from 'motion/react';
import { Users, Target, Award, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <Helmet>
        <title>About Us | Fitin60ai.in</title>
        <meta name="description" content="Learn about the mission and team behind Fitin60ai.in, the world's most advanced AI fitness protocol engine." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
          WE ARE <span className="text-neon">FITIN60AI.IN</span>
        </h1>
        <p className="text-zinc-400 text-xl max-w-3xl mx-auto font-medium">
          Our mission is to democratize elite-level fitness coaching through the power of advanced Artificial Intelligence.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 mb-32">
        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase italic tracking-tight">Our Vision</h2>
          <p className="text-zinc-400 leading-relaxed">
            We believe that everyone deserves access to professional, science-backed fitness and nutrition plans, regardless of their budget or location. Fitin60ai.in was born from the intersection of sports science and cutting-edge machine learning.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            By analyzing thousands of data points and elite training protocols, our AI engine crafts plans that were previously only available to professional athletes. Our goal is to empower individuals to take control of their health with precision and efficiency.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <Users className="w-6 h-6 text-neon" />, label: 'Growing Community' },
            { icon: <Target className="w-6 h-6 text-neon" />, label: 'Precision AI' },
            { icon: <Award className="w-6 h-6 text-neon" />, label: 'Elite Results' },
            { icon: <ShieldCheck className="w-6 h-6 text-neon" />, label: 'Science Backed' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              {stat.icon}
              <span className="mt-4 font-black uppercase italic tracking-tight text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-12 mb-32">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight mb-6">Why We Built This</h2>
          <p className="text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            The fitness industry is filled with generic advice and expensive coaching that many cannot afford. We saw an opportunity to use Artificial Intelligence to bridge this gap, providing high-quality, personalized guidance that adapts to your specific needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Data-Driven",
              desc: "Our algorithms are trained on peer-reviewed sports science and successful training methodologies."
            },
            {
              title: "User-Centric",
              desc: "We prioritize your goals and constraints, ensuring every plan is realistic and sustainable."
            },
            {
              title: "Always Free",
              desc: "We are committed to keeping our core plan generation free to ensure accessibility for all."
            }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-zinc-900/30 border border-white/5 rounded-3xl">
              <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-4">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-12 text-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tight mb-6">Join the Revolution</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-10">
          Stop guessing. Start training with the precision of AI. Your elite protocol is just 60 seconds away.
        </p>
        <button 
          onClick={() => window.location.href = '/generate'}
          className="px-10 py-4 bg-neon text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.3)]"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
