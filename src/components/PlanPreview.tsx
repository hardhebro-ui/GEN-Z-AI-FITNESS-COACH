import React, { useRef } from 'react';
import { GeneratedPlan, UserInputs } from '../types';
import { Download, RefreshCw, AlertTriangle, User, Target, Activity, Zap, ShieldAlert, Instagram } from 'lucide-react';
import { motion } from 'motion/react';

interface PlanPreviewProps {
  plan: GeneratedPlan;
  inputs: UserInputs;
  onRegenerate: () => void;
  onExport: () => void;
}

export default function PlanPreview({ plan, inputs, onRegenerate, onExport }: PlanPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const appUrl = window.location.origin;

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white flex flex-col font-sans overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-72 md:px-12 md:pt-20 md:pb-96 custom-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-12 relative" ref={contentRef} id="pdf-content">
        {/* Watermark */}
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-0 overflow-hidden">
          <div className="text-[200px] font-black rotate-[-45deg] whitespace-nowrap uppercase italic font-display">
            GEN-Z AI
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center space-y-4 pt-12 pb-8 relative z-10">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/30 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <ShieldAlert className="w-3 h-3 text-neon" />
              No Data Stored
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/30 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <Zap className="w-3 h-3 text-neon" />
              AI-Generated Plan
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/30 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <AlertTriangle className="w-3 h-3 text-neon" />
              Not Medical Advice
            </div>
          </div>
          <p className="text-neon text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 font-display italic">Your AI Fitness Coach</p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic font-display leading-none"
          >
            Your <span className="text-neon">Fitin60ai.in</span> Plan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl font-bold uppercase tracking-[0.3em]"
          >
            {inputs.primaryGoal} • {inputs.planDuration}
          </motion.p>
        </div>

        {/* Personalized Summary */}
        {plan?.personalizedSummary && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 md:p-12 backdrop-blur-xl relative z-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-neon/10 text-neon flex items-center justify-center text-sm font-black shrink-0 italic">AI</div>
              <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tight">Coach's Brief</h2>
            </div>
            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed font-medium italic">
              "{plan?.personalizedSummary}"
            </p>
          </motion.div>
        )}

        {/* User Summary */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl relative z-10">
          <h2 className="text-xl md:text-2xl font-black mb-8 flex items-center gap-4 uppercase italic tracking-tight">
            <span className="w-10 h-10 rounded-full bg-neon/10 text-neon flex items-center justify-center text-sm font-black shrink-0">01</span>
            Profile Analysis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-zinc-950/40 p-5 rounded-2xl border border-white/5">
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Physical Stats</p>
              <p className="font-bold text-white leading-relaxed">{inputs.age} yrs<br/>{inputs.height}{inputs.heightUnit}<br/>{inputs.weight}{inputs.weightUnit}</p>
            </div>
            <div className="bg-zinc-950/40 p-5 rounded-2xl border border-white/5">
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Body Type</p>
              <p className="font-bold text-white">{inputs.bodyType}</p>
            </div>
            <div className="bg-zinc-950/40 p-5 rounded-2xl border border-white/5">
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Fitness Level</p>
              <p className="font-bold text-white">{inputs.fitnessLevel}</p>
            </div>
            <div className="bg-zinc-950/40 p-5 rounded-2xl border border-white/5">
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Activity</p>
              <p className="font-bold text-white">{inputs.activityLevel}</p>
            </div>
          </div>
        </div>

        {/* Coaching Tips */}
        {plan?.coachingTips && plan.coachingTips.length > 0 && (
          <div className="space-y-8 relative z-10">
            <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4 uppercase italic tracking-tight">
              <span className="w-12 h-12 rounded-full bg-neon/10 text-neon flex items-center justify-center text-lg font-black shrink-0">02</span>
              Coaching Insights
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {plan.coachingTips.map((tip, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl flex gap-6 items-start"
                >
                  <div className="w-10 h-10 rounded-2xl bg-neon/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-neon" />
                  </div>
                  <p className="text-zinc-300 text-sm md:text-base font-bold leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Workout Plan */}
        <div className="space-y-8 relative z-10">
          <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4 uppercase italic tracking-tight">
            <span className="w-12 h-12 rounded-full bg-neon/10 text-neon flex items-center justify-center text-lg font-black shrink-0">03</span>
            Training Protocol
          </h2>
          <div className="space-y-6">
            {plan?.workout?.weeklySplit?.map((day, i) => (
              <motion.details 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl" 
                open={i === 0}
              >
                <summary className="flex items-center justify-between p-6 md:p-8 cursor-pointer select-none">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight group-open:text-neon transition-colors">{day.day}</h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-1">
                      <p className="text-zinc-500 font-bold text-xs md:text-sm uppercase tracking-widest">{day.focus}</p>
                      <span className="hidden md:block text-zinc-800">•</span>
                      <p className="text-neon/60 font-medium text-[10px] md:text-xs italic">{day.dayPurpose}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-open:rotate-180 transition-all shrink-0 group-hover:bg-white/10">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-8 pt-2">
                  <div className="space-y-4 md:space-y-0 md:overflow-x-auto">
                    {/* Mobile View: Cards */}
                    <div className="md:hidden space-y-4">
                      {day.exercises?.map((ex, j) => (
                        <div key={j} className="bg-zinc-950/40 rounded-2xl p-5 border border-white/5">
                          <p className="font-black uppercase italic text-sm mb-2 tracking-tight">{ex.name}</p>
                          <p className="text-[10px] text-zinc-500 mb-4 font-bold uppercase tracking-wider leading-relaxed">{ex.notes}</p>
                          <div className="flex flex-wrap gap-2 text-[10px]">
                            <span className="px-3 py-2 bg-neon/10 text-neon rounded-lg font-black uppercase tracking-widest">{ex.setsReps}</span>
                            <span className="px-3 py-2 bg-white/5 text-zinc-400 rounded-lg font-black uppercase tracking-widest">{ex.rest} rest</span>
                          </div>
                          {ex.alternative && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">Alternative</p>
                              <p className="text-xs text-zinc-400 font-bold">{ex.alternative}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Desktop View: Table */}
                    <table className="hidden md:table w-full text-left">
                      <thead>
                        <tr className="text-zinc-500 border-b border-white/5">
                          <th className="pb-4 font-black uppercase text-[10px] tracking-[0.2em]">Exercise</th>
                          <th className="pb-4 font-black uppercase text-[10px] tracking-[0.2em]">Sets × Reps</th>
                          <th className="pb-4 font-black uppercase text-[10px] tracking-[0.2em]">Rest</th>
                          <th className="pb-4 font-black uppercase text-[10px] tracking-[0.2em]">Alternative</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {day.exercises?.map((ex, j) => (
                          <tr key={j} className="group/row hover:bg-white/[0.02] transition-colors">
                            <td className="py-6 pr-6">
                              <p className="font-black uppercase italic text-sm tracking-tight text-white group-hover/row:text-neon transition-colors">{ex.name}</p>
                              <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase tracking-wider max-w-xs">{ex.notes}</p>
                            </td>
                            <td className="py-6 pr-6 whitespace-nowrap text-neon font-black text-sm tracking-widest">{ex.setsReps}</td>
                            <td className="py-6 pr-6 whitespace-nowrap text-zinc-400 font-bold text-xs uppercase tracking-widest">{ex.rest}</td>
                            <td className="py-6 text-zinc-500 text-xs font-bold">{ex.alternative}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.details>
            ))}
          </div>
        </div>

        {/* Diet Plan */}
        <div className="space-y-8 relative z-10">
          <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4 uppercase italic tracking-tight">
            <span className="w-12 h-12 rounded-full bg-neon/10 text-neon flex items-center justify-center text-lg font-black shrink-0">04</span>
            Fueling Strategy
          </h2>
          <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl">
            <div className="p-6 md:p-10 border-b border-white/5 bg-zinc-950/40 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Daily Energy Target</p>
                <p className="text-5xl font-black text-neon italic tracking-tighter">{plan?.diet?.dailyCalories} <span className="text-xl text-zinc-500 font-bold uppercase tracking-widest not-italic">kcal</span></p>
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-6 w-full md:w-auto">
                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-white/5 text-center">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Protein</p>
                  <p className="font-black text-white text-sm tracking-widest">{plan?.diet?.macros?.protein}</p>
                </div>
                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-white/5 text-center">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Carbs</p>
                  <p className="font-black text-white text-sm tracking-widest">{plan?.diet?.macros?.carbs}</p>
                </div>
                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-white/5 text-center">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Fats</p>
                  <p className="font-black text-white text-sm tracking-widest">{plan?.diet?.macros?.fats}</p>
                </div>
              </div>
            </div>

            {/* Diet Strategy Tips */}
            {plan?.dietStrategyTips && plan.dietStrategyTips.length > 0 && (
              <div className="p-6 md:p-10 border-b border-white/5 bg-zinc-900/20">
                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-4">Diet Strategy Tips</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {plan.dietStrategyTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-zinc-400 font-bold">
                      <Zap className="w-4 h-4 shrink-0 text-neon" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 md:p-10 space-y-6">
              {plan?.diet?.weeklySchedule?.map((day, i) => (
                <motion.details 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden"
                  open={i === 0}
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                    <h4 className="font-black text-neon text-lg uppercase italic tracking-tight group-open:text-white transition-colors">{day.day}</h4>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-open:rotate-180 transition-all shrink-0">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      {day.meals?.map((meal, j) => (
                        <div key={j} className="bg-zinc-900/40 rounded-xl p-5 border border-white/5">
                          <h5 className="font-black text-neon/80 mb-3 text-sm uppercase italic tracking-tight">{meal.name}</h5>
                          <ul className="space-y-2 mb-4">
                            {meal.options?.map((opt, k) => (
                              <li key={k} className="flex items-start gap-3 text-xs text-zinc-300 font-bold">
                                <span className="w-1 h-1 rounded-full bg-neon mt-1.5 shrink-0" />
                                {opt}
                              </li>
                            ))}
                          </ul>
                          <div className="pt-3 border-t border-white/5 flex items-start gap-2 text-[10px] text-zinc-500 font-bold italic">
                            <RefreshCw className="w-3 h-3 mt-0.5 shrink-0 text-neon/50" />
                            <span>{meal.alternatives}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Notes */}
        <div className="bg-neon/10 border-2 border-neon/30 rounded-[2rem] p-8 md:p-12 relative z-10 shadow-[0_0_50px_rgba(204,255,0,0.1)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-neon rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.4)]">
              <AlertTriangle className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-neon font-black uppercase italic tracking-tight text-2xl md:text-3xl">Safety Protocol</h3>
              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Critical Guidelines for Your Protection</p>
            </div>
          </div>
          <ul className="grid md:grid-cols-2 gap-6 text-zinc-300 text-sm font-bold list-none">
            {plan?.safetyNotes?.map((note, i) => (
              <li key={i} className="flex items-start gap-4 p-4 bg-zinc-950/40 rounded-2xl border border-white/5">
                <span className="w-2 h-2 rounded-full bg-neon mt-1.5 shrink-0 shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                <span className="leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Footer */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <a 
            href="https://www.instagram.com/fitin60ai.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 rounded-full border border-white/5 text-zinc-400 hover:text-neon transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Fitin60ai.in</span>
          </a>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 md:p-10 text-center space-y-4 relative z-10 mb-12">
          <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em]">Medical Disclaimer</p>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl mx-auto">
            This plan is generated by an Artificial Intelligence and is intended for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or before starting a new fitness or nutrition program.
          </p>
        </div>
      </div>
    </div>

      {/* Floating Action Bar - Native Mobile Style */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent z-40 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegenerate}
            className="flex-1 py-5 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 font-black uppercase italic tracking-widest text-[10px] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            className="flex-[2] py-5 rounded-2xl bg-neon text-black font-black uppercase italic tracking-widest text-[10px] shadow-[0_0_30px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Protocol
          </motion.button>
        </div>
      </div>
    </div>
  );
}
