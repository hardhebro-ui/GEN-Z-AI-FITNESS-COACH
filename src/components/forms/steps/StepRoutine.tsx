import React from 'react';
import { UserInputs } from '../../../types';
import { StepHeader } from '../StepHeader';
import { 
  LOCATIONS, 
  STYLES, 
  EQUIPMENT_OPTIONS, 
  SCHEDULE_OPTIONS, 
  DURATION_OPTIONS, 
  PREFERENCES 
} from '../../../constants/form';

interface StepRoutineProps {
  data: UserInputs;
  updateData: (fields: Partial<UserInputs>) => void;
  description: string;
}

export const StepRoutine: React.FC<StepRoutineProps> = ({ data, updateData, description }) => {
  return (
    <div className="space-y-8">
      <StepHeader title="Your" highlight="Routine" description={description} />
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Workout Location</label>
          <div className="grid grid-cols-2 gap-3">
            {LOCATIONS.map(loc => (
              <button
                key={loc}
                onClick={() => updateData({ workoutLocation: loc })}
                className={`p-5 rounded-2xl border font-bold transition-all ${data.workoutLocation === loc ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Preferred Style</label>
          <div className="grid grid-cols-2 gap-3">
            {STYLES.map(style => (
              <button
                key={style}
                onClick={() => updateData({ preferredWorkoutStyle: style })}
                className={`p-5 rounded-2xl border text-xs font-bold transition-all ${data.preferredWorkoutStyle === style ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Equipment Available</label>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT_OPTIONS.map(eq => (
              <button
                key={eq}
                onClick={() => {
                  const newEq = data.equipment.includes(eq)
                    ? data.equipment.filter(e => e !== eq)
                    : [...data.equipment, eq];
                  updateData({ equipment: newEq });
                }}
                className={`p-4 rounded-2xl border text-xs font-bold transition-all ${data.equipment.includes(eq) ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Days per Week</label>
            <div className="grid grid-cols-4 gap-2">
              {SCHEDULE_OPTIONS.map(days => (
                <button
                  key={days}
                  onClick={() => updateData({ daysPerWeek: days })}
                  className={`p-4 rounded-2xl border font-bold transition-all ${data.daysPerWeek === days ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
                >
                  {days}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Time per Session</label>
            <div className="grid grid-cols-1 gap-2">
              {DURATION_OPTIONS.map(time => (
                <button
                  key={time}
                  onClick={() => updateData({ timePerSession: time })}
                  className={`p-4 rounded-2xl border text-xs font-bold transition-all ${data.timePerSession === time ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Time Preference</label>
          <div className="grid grid-cols-3 gap-3">
            {PREFERENCES.map(time => (
              <button
                key={time}
                onClick={() => updateData({ workoutTimePreference: time })}
                className={`p-5 rounded-2xl border font-bold transition-all ${data.workoutTimePreference === time ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
