import React from 'react';
import { UserInputs } from '../../../types';
import { StepHeader } from '../StepHeader';
import { SelectableCard } from '../../ui/SelectableCard';
import { GOALS, GOAL_PRIORITIES, TARGET_AREAS, PLAN_DURATIONS } from '../../../constants/form';

interface StepGoalsProps {
  data: UserInputs;
  updateData: (fields: Partial<UserInputs>) => void;
  description: string;
}

export const StepGoals: React.FC<StepGoalsProps> = ({ data, updateData, description }) => {
  return (
    <div className="space-y-8">
      <StepHeader title="Your" highlight="Goals" description={description} />
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Primary Goal</label>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(goal => (
              <SelectableCard
                key={goal.id}
                title={goal.label}
                image={goal.img}
                variant="large"
                selected={data.primaryGoal === goal.id}
                onClick={() => updateData({ primaryGoal: goal.id })}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Goal Priority</label>
          <div className="grid grid-cols-3 gap-3">
            {GOAL_PRIORITIES.map(priority => (
              <SelectableCard
                key={priority.id}
                title={priority.label}
                description={priority.desc}
                selected={data.goalPriority === priority.id}
                onClick={() => updateData({ goalPriority: priority.id })}
              />
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Target Areas</label>
          <div className="grid grid-cols-3 gap-2">
            {TARGET_AREAS.map(area => (
              <button
                key={area}
                onClick={() => {
                  const newAreas = data.targetAreas.includes(area)
                    ? data.targetAreas.filter(a => a !== area)
                    : [...data.targetAreas, area];
                  updateData({ targetAreas: newAreas });
                }}
                className={`p-4 rounded-2xl border text-xs font-bold transition-all ${data.targetAreas.includes(area) ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Plan Duration</label>
          <div className="grid grid-cols-3 gap-3">
            {PLAN_DURATIONS.map(duration => (
              <button
                key={duration}
                onClick={() => updateData({ planDuration: duration })}
                className={`p-5 rounded-2xl border font-bold transition-all ${data.planDuration === duration ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
