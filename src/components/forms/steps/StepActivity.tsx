import React from 'react';
import { UserInputs } from '../../../types';
import { StepHeader } from '../StepHeader';
import { ShieldAlert } from 'lucide-react';
import { 
  ACTIVITY_LEVELS_MOCK, 
  STEPS_OPTIONS, 
  STRESS_LEVELS 
} from '../../../constants/form';

interface StepActivityProps {
  data: UserInputs;
  updateData: (fields: Partial<UserInputs>) => void;
  description: string;
}

export const StepActivity: React.FC<StepActivityProps> = ({ data, updateData, description }) => {
  return (
    <div className="space-y-8">
      <StepHeader title="Daily" highlight="Activity" description={description} />
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Activity Level</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ACTIVITY_LEVELS_MOCK.map(level => (
              <button
                key={level}
                onClick={() => updateData({ activityLevel: level })}
                className={`p-5 rounded-2xl border font-bold transition-all ${data.activityLevel === level ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Daily Steps</label>
            <div className="grid grid-cols-1 gap-2">
              {STEPS_OPTIONS.map(steps => (
                <button
                  key={steps}
                  onClick={() => updateData({ dailySteps: steps })}
                  className={`p-4 rounded-2xl border text-xs font-bold transition-all ${data.dailySteps === steps ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
                >
                  {steps}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Stress Level</label>
            <div className="grid grid-cols-1 gap-2">
              {STRESS_LEVELS.map(stress => (
                <button
                  key={stress}
                  onClick={() => updateData({ stressLevel: stress })}
                  className={`p-4 rounded-2xl border text-xs font-bold transition-all ${data.stressLevel === stress ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
                >
                  {stress}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Medical Conditions</label>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <ShieldAlert className="w-3 h-3 text-amber-500" />
              <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Safety Check</span>
            </div>
          </div>
          <input
            type="text"
            value={data.medicalConditions}
            onChange={e => updateData({ medicalConditions: e.target.value })}
            className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon transition-all font-bold"
            placeholder="e.g. Asthma, Hypertension"
          />
          <p className="mt-2 text-[9px] text-zinc-600 font-bold leading-relaxed">
            * We use this to adapt your plan for safety. Always consult a doctor first.
          </p>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Past Injuries</label>
          <input
            type="text"
            value={data.pastInjuries}
            onChange={e => updateData({ pastInjuries: e.target.value })}
            className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon transition-all font-bold"
            placeholder="e.g. Knee surgery, Lower back pain"
          />
        </div>
      </div>
    </div>
  );
};
