import React from 'react';
import { UserInputs } from '../../../types';
import { StepHeader } from '../StepHeader';
import { 
  SLEEP_OPTIONS, 
  WATER_OPTIONS, 
  REST_DAY_OPTIONS 
} from '../../../constants/form';

interface StepRecoveryProps {
  data: UserInputs;
  updateData: (fields: Partial<UserInputs>) => void;
  description: string;
}

export const StepRecovery: React.FC<StepRecoveryProps> = ({ data, updateData, description }) => {
  return (
    <div className="space-y-8">
      <StepHeader title="Recovery &" highlight="Hydration" description={description} />
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Sleep per Night</label>
            <div className="grid grid-cols-1 gap-2">
              {SLEEP_OPTIONS.map(sleep => (
                <button
                  key={sleep}
                  onClick={() => updateData({ sleepHours: sleep })}
                  className={`p-4 rounded-2xl border text-xs font-bold transition-all ${data.sleepHours === sleep ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
                >
                  {sleep}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Water Intake</label>
            <div className="grid grid-cols-1 gap-2">
              {WATER_OPTIONS.map(water => (
                <button
                  key={water}
                  onClick={() => updateData({ hydration: water })}
                  className={`p-4 rounded-2xl border text-xs font-bold transition-all ${data.hydration === water ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
                >
                  {water}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Willingness for Rest Days</label>
          <div className="grid grid-cols-2 gap-3">
            {REST_DAY_OPTIONS.map(rest => (
              <button
                key={rest.id}
                onClick={() => updateData({ willingnessForRestDays: rest.id })}
                className={`p-5 rounded-2xl border text-xs font-bold transition-all ${data.willingnessForRestDays === rest.id ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {rest.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
