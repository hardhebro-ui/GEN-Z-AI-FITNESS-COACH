import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { UserInputs } from '../../../types';
import { StepHeader } from '../StepHeader';

interface StepReviewProps {
  data: UserInputs;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  onShowTerms: () => void;
  description: string;
}

export const StepReview: React.FC<StepReviewProps> = ({ 
  data,
  termsAccepted, 
  setTermsAccepted, 
  onShowTerms,
  description 
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
          Review <span className="text-neon">Profile</span>
        </h2>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neon/10 flex items-center justify-center text-neon">
              <CheckCircle2 size={16} />
            </div>
            <h3 className="font-black uppercase italic text-sm tracking-wider">Physical Stats</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Age / Gender</span>
              <span className="text-sm font-bold">{data.age} yrs / {data.gender}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Height / Weight</span>
              <span className="text-sm font-bold">{data.height}{data.heightUnit} / {data.weight}{data.weightUnit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Body Type</span>
              <span className="text-sm font-bold">{data.bodyType}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neon/10 flex items-center justify-center text-neon">
              <CheckCircle2 size={16} />
            </div>
            <h3 className="font-black uppercase italic text-sm tracking-wider">Fitness Goals</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Primary Goal</span>
              <span className="text-sm font-bold text-neon">{data.primaryGoal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Level</span>
              <span className="text-sm font-bold">{data.fitnessLevel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Duration</span>
              <span className="text-sm font-bold">{data.planDuration}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neon/10 flex items-center justify-center text-neon">
              <CheckCircle2 size={16} />
            </div>
            <h3 className="font-black uppercase italic text-sm tracking-wider">Workout Routine</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Location</span>
              <span className="text-sm font-bold">{data.workoutLocation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Frequency</span>
              <span className="text-sm font-bold">{data.daysPerWeek} days/wk</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Style</span>
              <span className="text-sm font-bold">{data.preferredWorkoutStyle}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neon/10 flex items-center justify-center text-neon">
              <CheckCircle2 size={16} />
            </div>
            <h3 className="font-black uppercase italic text-sm tracking-wider">Nutrition</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Diet Type</span>
              <span className="text-sm font-bold">{data.dietType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Meals</span>
              <span className="text-sm font-bold">{data.mealsPerDay} / day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Budget</span>
              <span className="text-sm font-bold">{data.budget}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-neon/5 border border-neon/20 space-y-4">
        <p className="text-xs text-zinc-400 font-medium leading-relaxed">
          By clicking <span className="text-neon font-bold">Generate My Plan</span>, our AI will analyze your profile and create a personalized workout and nutrition strategy tailored specifically for your goals and lifestyle.
        </p>
        
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex items-center mt-0.5">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-6 h-6 border-2 border-white/10 rounded-lg bg-zinc-900 transition-all peer-checked:border-neon peer-checked:bg-neon group-hover:border-white/20" />
            <CheckCircle2 
              className={`absolute inset-0 w-6 h-6 text-black transition-all scale-50 opacity-0 ${termsAccepted ? 'scale-75 opacity-100' : ''}`}
            />
          </div>
          <span className="text-[11px] text-zinc-500 font-bold leading-relaxed select-none">
            I agree to the <button onClick={onShowTerms} className="text-neon hover:underline">Terms & Conditions</button> and acknowledge that this plan is for informational purposes only and <span className="text-white">not medical advice</span>.
          </span>
        </label>
      </div>
    </div>
  );
};
