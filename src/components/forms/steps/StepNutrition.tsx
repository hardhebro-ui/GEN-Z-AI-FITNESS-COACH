import React from 'react';
import { UserInputs } from '../../../types';
import { StepHeader } from '../StepHeader';
import { 
  DIET_TYPES, 
  FOOD_STYLES, 
  MEALS_PER_DAY_OPTIONS, 
  BUDGETS, 
  PROTEIN_PREFERENCES 
} from '../../../constants/form';

interface StepNutritionProps {
  data: UserInputs;
  updateData: (fields: Partial<UserInputs>) => void;
  description: string;
}

export const StepNutrition: React.FC<StepNutritionProps> = ({ data, updateData, description }) => {
  return (
    <div className="space-y-8">
      <StepHeader title="Your" highlight="Fuel" description={description} />
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Diet Type</label>
          <div className="grid grid-cols-3 gap-3">
            {DIET_TYPES.map(type => (
              <button
                key={type}
                onClick={() => updateData({ dietType: type })}
                className={`p-5 rounded-2xl border font-bold transition-all ${data.dietType === type ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Food Style</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {FOOD_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => updateData({ foodPreferenceStyle: style.id })}
                className={`p-5 rounded-2xl border text-xs font-bold transition-all ${data.foodPreferenceStyle === style.id ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Meals per Day</label>
            <div className="grid grid-cols-3 gap-3">
              {MEALS_PER_DAY_OPTIONS.map(meals => (
                <button
                  key={meals}
                  onClick={() => updateData({ mealsPerDay: meals })}
                  className={`p-5 rounded-2xl border font-bold transition-all ${data.mealsPerDay === meals ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
                >
                  {meals}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Budget</label>
            <div className="grid grid-cols-3 gap-3">
              {BUDGETS.map(budget => (
                <button
                  key={budget}
                  onClick={() => updateData({ budget })}
                  className={`p-5 rounded-2xl border text-[10px] font-bold transition-all ${data.budget === budget ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Protein Preference</label>
          <div className="grid grid-cols-3 gap-3">
            {PROTEIN_PREFERENCES.map(pref => (
              <button
                key={pref}
                onClick={() => updateData({ proteinPreference: pref })}
                className={`p-5 rounded-2xl border text-xs font-bold transition-all ${data.proteinPreference === pref ? 'border-neon bg-neon/10 text-neon' : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/10'}`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Allergies / Restrictions</label>
          <input
            type="text"
            value={data.allergies}
            onChange={e => updateData({ allergies: e.target.value })}
            className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon transition-all font-bold"
            placeholder="e.g. Peanuts, Gluten"
          />
        </div>
      </div>
    </div>
  );
};
