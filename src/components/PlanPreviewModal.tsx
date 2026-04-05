import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Download, 
  Zap, 
  Flame, 
  Utensils, 
  Dumbbell, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { ExplorePlan } from '../types';

interface PlanPreviewModalProps {
  plan: ExplorePlan;
  onClose: () => void;
  onDownload: () => void;
}

const PlanPreviewModal: React.FC<PlanPreviewModalProps> = ({ plan, onClose, onDownload }) => {
  const { planData } = plan;

  if (!planData) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      >
        <div className="bg-zinc-950 border border-white/10 p-8 rounded-3xl text-center space-y-4">
          <p className="text-zinc-400">Plan details are currently unavailable.</p>
          <button onClick={onClose} className="px-6 py-2 bg-neon text-black rounded-xl font-bold">Close</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(204,255,0,0.1)] flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-white/5 bg-zinc-900/40 flex items-center justify-between shrink-0">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center text-neon">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white">{plan.title}</h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {plan.duration}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="flex items-center gap-1.5"><Flame className="w-3 h-3" /> {plan.goal}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> {plan.level}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-12 custom-scrollbar">
          {/* Summary Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neon italic">Coach's Insight</h3>
            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed italic font-medium">
              "{plan.preview?.summary || planData?.personalizedSummary?.slice(0, 250) || "This elite protocol is designed to optimize your performance and body composition through science-backed training and nutrition strategies."}..."
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Workout Teaser */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-5 h-5 text-neon" />
                <h3 className="text-lg font-black uppercase italic tracking-tight">Weekly Structure</h3>
              </div>
              <div className="space-y-3">
                {planData?.workout?.weeklySplit?.slice(0, 4).map((day, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-neon uppercase tracking-widest w-12">{day.day.slice(0, 3)}</span>
                      <span className="text-sm font-bold text-white italic">{day.focus}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-zinc-700" />
                  </div>
                )) || (
                  <div className="p-6 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10 text-center">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest italic">Full split available in PDF</p>
                  </div>
                )}
                {planData?.workout?.weeklySplit && planData.workout.weeklySplit.length > 4 && (
                  <div className="p-4 bg-zinc-900/20 rounded-2xl border border-dashed border-white/5 text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">+ {planData.workout.weeklySplit.length - 4} More Days</p>
                  </div>
                )}
              </div>
            </section>

            {/* Diet Teaser */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Utensils className="w-5 h-5 text-neon" />
                <h3 className="text-lg font-black uppercase italic tracking-tight">Fueling Strategy</h3>
              </div>
              <div className="bg-zinc-900/40 rounded-3xl p-6 border border-white/5 space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Daily Target</p>
                    <p className="text-3xl font-black text-neon italic tracking-tighter">
                      {plan.preview?.calories || planData?.diet?.dailyCalories || "2400"} <span className="text-xs text-zinc-500 font-bold uppercase not-italic">kcal</span>
                    </p>
                  </div>
                  {planData?.diet?.macros && (
                    <div className="flex gap-4 text-right">
                      <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Protein</p>
                        <p className="text-sm font-bold text-white">{planData.diet.macros.protein}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Carbs</p>
                        <p className="text-sm font-bold text-white">{planData.diet.macros.carbs}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Sample Meals</p>
                  {planData?.diet?.weeklySchedule?.[0]?.meals?.slice(0, 2).map((meal, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon mt-1.5 shrink-0" />
                      <p className="text-xs font-bold text-zinc-300">{meal.options[0]}</p>
                    </div>
                  )) || (
                    <p className="text-xs font-bold text-zinc-500 italic uppercase tracking-widest">Personalized meal plan included in PDF</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 md:p-10 bg-zinc-900/60 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${plan.id}${i}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-zinc-400 italic">Join {plan.downloads || 0}+ athletes using this protocol</p>
          </div>
          <button 
            onClick={onDownload}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-neon text-black rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(204,255,0,0.3)]"
          >
            <Download className="w-5 h-5" />
            Unlock Full Protocol
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlanPreviewModal;
