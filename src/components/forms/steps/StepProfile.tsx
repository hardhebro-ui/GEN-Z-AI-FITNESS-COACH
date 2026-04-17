import React from 'react';
import { UserInputs } from '../../../types';
import { StepHeader } from '../StepHeader';
import { SelectableCard } from '../../ui/SelectableCard';
import { BODY_TYPES, FITNESS_LEVELS, WORKOUT_EXPERIENCES } from '../../../constants/form';

interface StepProfileProps {
  data: UserInputs;
  updateData: (fields: Partial<UserInputs>) => void;
  description: string;
}

export const StepProfile: React.FC<StepProfileProps> = ({ data, updateData, description }) => {
  return (
    <div className="space-y-8">
      <StepHeader title="Your" highlight="Profile" description={description} />
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Body Type</label>
          <div className="grid grid-cols-3 gap-3">
            {BODY_TYPES.map(type => (
              <SelectableCard
                key={type.id}
                title={type.label}
                description={type.desc}
                selected={data.bodyType === type.id}
                onClick={() => updateData({ bodyType: type.id })}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Fitness Level</label>
          <div className="grid grid-cols-3 gap-3">
            {FITNESS_LEVELS.map(level => (
              <SelectableCard
                key={level.id}
                title={level.label}
                image={level.img}
                variant="icon"
                selected={data.fitnessLevel === level.id}
                onClick={() => updateData({ fitnessLevel: level.id })}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Workout Experience</label>
          <div className="grid grid-cols-2 gap-3">
            {WORKOUT_EXPERIENCES.map(exp => (
              <button
                key={exp}
                onClick={() => updateData({ workoutExperience: exp })}
                className={`p-4 rounded-2xl border text-sm font-bold transition-all ${data.workoutExperience === exp ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
