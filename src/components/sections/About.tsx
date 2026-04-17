import React from 'react';
import { motion } from 'motion/react';
import { Users, Target, Award, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 text-balance">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-6"
          >
            WE ARE <span className="text-neon">FITIN60AI.IN</span>
          </motion.h2>
          <p className="text-zinc-400 text-xl max-w-3xl mx-auto font-medium">
            Our mission is to democratize elite-level fitness coaching through the power of advanced Artificial Intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-32">
          <div className="space-y-6">
            <h3 className="text-3xl font-black uppercase italic tracking-tight">Our Vision</h3>
            <p className="text-zinc-500 font-bold leading-relaxed text-lg">
              We believe that everyone deserves access to professional, science-backed fitness and nutrition plans. Fitin60ai.in was born from the intersection of sports science and cutting-edge machine learning.
            </p>
            <p className="text-zinc-500 font-bold leading-relaxed">
              By analyzing thousands of data points and elite training protocols, our AI engine crafts plans that were previously only available to professional athletes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Users className="w-6 h-6 text-neon" />, label: 'Community' },
              { icon: <Target className="w-6 h-6 text-neon" />, label: 'Precision' },
              { icon: <Award className="w-6 h-6 text-neon" />, label: 'Elite Results' },
              { icon: <ShieldCheck className="w-6 h-6 text-neon" />, label: 'Science' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center"
              >
                {stat.icon}
                <span className="mt-4 font-black uppercase italic tracking-tight text-[10px] sm:text-xs">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Data-Driven",
              desc: "Algorithms trained on peer-reviewed sports science."
            },
            {
              title: "User-Centric",
              desc: "Prioritizing your goals and sustainable results."
            },
            {
              title: "Always Free",
              desc: "Core plan generation is accessible for all."
            }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-zinc-900/30 border border-white/5 rounded-[2.5rem]"
            >
              <h4 className="text-xl font-black uppercase italic tracking-tight text-white mb-4">{item.title}</h4>
              <p className="text-zinc-500 font-bold text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
