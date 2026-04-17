import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserInputs } from '../types';
import { ShieldAlert } from 'lucide-react';
import { StepBasics } from './forms/steps/StepBasics';
import { StepProfile } from './forms/steps/StepProfile';
import { StepGoals } from './forms/steps/StepGoals';
import { StepRoutine } from './forms/steps/StepRoutine';
import { StepNutrition } from './forms/steps/StepNutrition';
import { StepActivity } from './forms/steps/StepActivity';
import { StepRecovery } from './forms/steps/StepRecovery';
import { StepReview } from './forms/steps/StepReview';
import { StepNavigation } from './forms/StepNavigation';
import { calculateBMI } from '../utils/calculations';

interface MultiStepFormProps {
  onSubmit: (data: UserInputs) => void;
  onShowTerms: () => void;
  onCancel: () => void;
}

const initialData: UserInputs = {
  age: '',
  gender: '',
  height: '',
  heightUnit: 'cm',
  weight: '',
  weightUnit: 'kg',
  goalWeight: '',
  bodyFatEstimate: '',
  bodyType: '',
  fitnessLevel: '',
  workoutExperience: '',
  primaryGoal: '',
  goalPriority: '',
  targetAreas: [],
  planDuration: '',
  workoutLocation: '',
  equipment: [],
  daysPerWeek: '',
  timePerSession: '',
  preferredWorkoutStyle: '',
  workoutTimePreference: '',
  dietType: '',
  mealsPerDay: '',
  allergies: '',
  budget: '',
  foodPreferenceStyle: '',
  proteinPreference: '',
  activityLevel: '',
  dailySteps: '',
  stressLevel: '',
  sleepHours: '',
  hydration: '',
  willingnessForRestDays: '',
  medicalConditions: '',
  pastInjuries: ''
};

export default function MultiStepForm({ onSubmit, onShowTerms, onCancel }: MultiStepFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [data, setData] = useState<UserInputs>(initialData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  const updateData = (fields: Partial<UserInputs>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, 8));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!(data.age && parseInt(data.age) >= 13 && parseInt(data.age) <= 80 && data.gender && data.height && data.weight);
      case 2: return !!(data.bodyType && data.fitnessLevel);
      case 3: return !!(data.primaryGoal && data.goalPriority && data.targetAreas.length > 0 && data.planDuration);
      case 4: return !!(data.workoutLocation && data.daysPerWeek && data.timePerSession && data.preferredWorkoutStyle && data.workoutTimePreference);
      case 5: return !!(data.dietType && data.mealsPerDay && data.budget && data.foodPreferenceStyle && data.proteinPreference);
      case 6: return !!data.activityLevel;
      case 7: return !!(data.sleepHours && data.hydration && data.willingnessForRestDays);
      case 8: return termsAccepted;
      default: return false;
    }
  };

  const bmiData = calculateBMI(data.height, data.weight, data.heightUnit, data.weightUnit);

  const getStepInfo = () => {
    switch (step) {
      case 1: return "Your age, height, and weight are the primary factors in calculating your Basal Metabolic Rate (BMR), which determines your daily caloric needs.";
      case 2: return "Identifying your body type and fitness level helps the AI adjust training volume and intensity to prevent overtraining and ensure steady progress.";
      case 3: return "Setting clear goals and identifying target areas allows the AI to prioritize specific muscle groups and choose the most effective training split for your objective.";
      case 4: return "Your environment and schedule are crucial. Whether you're at home or the gym, the AI optimizes your plan to fit your available time and equipment.";
      case 5: return "Nutrition is 70% of the battle. Your dietary preferences and budget help the AI create a sustainable meal plan that you'll actually enjoy following.";
      case 6: return "Lifestyle factors like sleep and stress levels significantly impact recovery. The AI considers these to suggest optimal rest days and intensity levels.";
      case 7: return "Safety is our top priority. Disclosing medical conditions and past injuries ensures the AI avoids high-risk movements and suggests safer alternatives.";
      case 8: return "Finalizing your protocol. Reviewing the terms ensures you understand the guidance is AI-generated and should be followed with awareness.";
      default: return "";
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <StepBasics data={data} updateData={updateData} bmiData={bmiData} description="" />;
      case 2:
        return <StepProfile data={data} updateData={updateData} description="" />;
      case 3:
        return <StepGoals data={data} updateData={updateData} description="" />;
      case 4:
        return <StepRoutine data={data} updateData={updateData} description="" />;
      case 5:
        return <StepNutrition data={data} updateData={updateData} description="" />;
      case 6:
        return <StepActivity data={data} updateData={updateData} description="" />;
      case 7:
        return <StepRecovery data={data} updateData={updateData} description="" />;
      case 8:
        return <StepReview data={data} termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} onShowTerms={onShowTerms} description="Confirm your details before we build your plan" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] bg-zinc-950 text-white flex flex-col font-sans overflow-hidden">
      {/* Top Progress Bar */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl pt-6 pb-6 px-6 md:px-10 border-b border-white/5 shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">
            <span>Step {step} <span className="text-zinc-700">/</span> 8</span>
            <span className="text-neon">{Math.round((step / 8) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neon shadow-[0_0_15px_rgba(204,255,0,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 8) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-10 pb-72 md:px-8 md:pt-12 md:pb-96 custom-scrollbar"
      >
        <div className="max-w-2xl mx-auto">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {renderStepContent()}

              <div className="mt-16 p-8 bg-zinc-900/30 border border-white/5 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-neon">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Expert Insight</span>
                </div>
                <p className="text-zinc-400 text-sm font-medium leading-relaxed italic">
                  {getStepInfo()}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <StepNavigation 
        step={step}
        isStepValid={isStepValid()}
        termsAccepted={termsAccepted}
        onNext={nextStep}
        onPrev={prevStep}
        onSubmit={() => onSubmit({ ...data, bmi: bmiData ? parseFloat(bmiData.value) : undefined })}
        onCancel={onCancel}
      />
    </div>
  );
}
