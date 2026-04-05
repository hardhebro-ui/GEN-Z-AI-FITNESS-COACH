import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserInputs } from '../types';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, X } from 'lucide-react';

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
    // Scroll to top on step change
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
      case 1: return data.age && parseInt(data.age) >= 13 && parseInt(data.age) <= 80 && data.height && data.weight;
      case 2: return data.bodyType && data.fitnessLevel;
      case 3: return data.primaryGoal && data.goalPriority && data.targetAreas.length > 0 && data.planDuration;
      case 4: return data.workoutLocation && data.daysPerWeek && data.timePerSession && data.preferredWorkoutStyle && data.workoutTimePreference;
      case 5: return data.dietType && data.mealsPerDay && data.budget && data.foodPreferenceStyle && data.proteinPreference;
      case 6: return data.activityLevel;
      case 7: return data.sleepHours && data.hydration && data.willingnessForRestDays;
      case 8: return true;
      default: return false;
    }
  };

  const calculateBMI = () => {
    let h = parseFloat(data.height);
    let w = parseFloat(data.weight);
    
    if (data.heightUnit === 'ft/in') {
      // Parse ft/in format like 5'9" or 5.75
      if (data.height.includes("'")) {
        const parts = data.height.split("'");
        const ft = parseFloat(parts[0]) || 0;
        const inches = parseFloat(parts[1]?.replace('"', '')) || 0;
        h = (ft * 12 + inches) * 2.54;
      } else {
        h = h * 30.48; // Assume decimal feet if no quote
      }
    }
    
    if (data.weightUnit === 'lbs') {
      w = w * 0.453592;
    }

    h = h / 100; // Convert to meters

    if (h > 0 && w > 0) {
      const bmi = w / (h * h);
      let category = '';
      let color = '';
      if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-400'; }
      else if (bmi < 25) { category = 'Normal'; color = 'text-emerald-600'; }
      else if (bmi < 30) { category = 'Overweight'; color = 'text-amber-400'; }
      else { category = 'Obese'; color = 'text-red-400'; }
      return { value: bmi.toFixed(1), category, color };
    }
    return null;
  };

  const bmiData = calculateBMI();

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
              The <span className="text-neon">Basics</span>
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">Age (13-80)</label>
                  <input
                    id="age"
                    type="number"
                    min="13"
                    max="80"
                    value={data.age}
                    onChange={e => updateData({ age: e.target.value })}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all"
                    placeholder="e.g. 25"
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">Gender</label>
                  <select
                    id="gender"
                    value={data.gender}
                    onChange={e => updateData({ gender: e.target.value })}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all appearance-none"
                  >
                    <option value="" className="bg-zinc-950">Select</option>
                    <option value="Male" className="bg-zinc-950">Male</option>
                    <option value="Female" className="bg-zinc-950">Female</option>
                    <option value="Other" className="bg-zinc-950">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="height" className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Height</label>
                    <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5">
                      <button
                        onClick={() => updateData({ heightUnit: 'cm' })}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${data.heightUnit === 'cm' ? 'bg-neon text-black shadow-lg' : 'text-zinc-500'}`}
                      >
                        CM
                      </button>
                      <button
                        onClick={() => updateData({ heightUnit: 'ft/in' })}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${data.heightUnit === 'ft/in' ? 'bg-neon text-black shadow-lg' : 'text-zinc-500'}`}
                      >
                        FT
                      </button>
                    </div>
                  </div>
                  <input
                    id="height"
                    type="text"
                    value={data.height}
                    onChange={e => updateData({ height: e.target.value })}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all"
                    placeholder={data.heightUnit === 'cm' ? "e.g. 175" : "e.g. 5'9\""}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="weight" className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Weight</label>
                    <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5">
                      <button
                        onClick={() => updateData({ weightUnit: 'kg' })}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${data.weightUnit === 'kg' ? 'bg-neon text-black shadow-lg' : 'text-zinc-500'}`}
                      >
                        KG
                      </button>
                      <button
                        onClick={() => updateData({ weightUnit: 'lbs' })}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${data.weightUnit === 'lbs' ? 'bg-neon text-black shadow-lg' : 'text-zinc-500'}`}
                      >
                        LB
                      </button>
                    </div>
                  </div>
                  <input
                    id="weight"
                    type="number"
                    value={data.weight}
                    onChange={e => updateData({ weight: e.target.value })}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all"
                    placeholder={data.weightUnit === 'kg' ? "e.g. 70" : "e.g. 154"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">Goal Weight</label>
                  <input
                    type="number"
                    value={data.goalWeight}
                    onChange={e => updateData({ goalWeight: e.target.value })}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all"
                    placeholder={data.weightUnit === 'kg' ? "e.g. 65" : "e.g. 143"}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">Body Fat %</label>
                  <select
                    value={data.bodyFatEstimate}
                    onChange={e => updateData({ bodyFatEstimate: e.target.value })}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all appearance-none"
                  >
                    <option value="" className="bg-zinc-950">Not Sure</option>
                    <option value="Low" className="bg-zinc-950">Low (&lt; 15%)</option>
                    <option value="Average" className="bg-zinc-950">Average (15-25%)</option>
                    <option value="High" className="bg-zinc-950">High (&gt; 25%)</option>
                  </select>
                </div>
              </div>
              
              {bmiData && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-2xl"
                >
                  <div>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-1">Body Mass Index</span>
                    <span className="text-4xl font-black text-white font-display italic leading-none">{bmiData.value}</span>
                  </div>
                  <div className={`px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-xs font-black uppercase tracking-widest ${bmiData.color}`}>
                    {bmiData.category}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );
      case 2:
        const bodyTypes = [
          { id: 'Ectomorph', label: 'Ectomorph', desc: 'Naturally lean' },
          { id: 'Mesomorph', label: 'Mesomorph', desc: 'Athletic build' },
          { id: 'Endomorph', label: 'Endomorph', desc: 'Broad, gains easily' }
        ];
        
        const fitnessLevels = [
          { id: 'Beginner', label: 'Beginner', img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80' },
          { id: 'Intermediate', label: 'Intermediate', img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400&q=80' },
          { id: 'Advanced', label: 'Advanced', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' }
        ];

        const workoutExperiences = [
          'Never trained',
          '1–6 months',
          '6–12 months',
          '1+ year'
        ];

        return (
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
              Your <span className="text-neon">Profile</span>
            </h2>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Body Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {bodyTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => updateData({ bodyType: type.id })}
                      className={`relative overflow-hidden rounded-2xl border text-left transition-all p-5 ${data.bodyType === type.id ? 'border-neon bg-neon/10 shadow-[0_0_20px_rgba(204,255,0,0.1)]' : 'border-white/5 bg-zinc-900/40 hover:border-white/10'}`}
                    >
                      <div className={`font-black uppercase italic text-sm ${data.bodyType === type.id ? 'text-neon' : 'text-white'}`}>{type.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-1 font-bold">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Fitness Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {fitnessLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => updateData({ fitnessLevel: level.id })}
                      className={`relative overflow-hidden rounded-2xl border text-left transition-all group ${data.fitnessLevel === level.id ? 'border-neon bg-neon/10' : 'border-white/5 bg-zinc-900/40'}`}
                    >
                      <div className="h-24 w-full bg-zinc-800 overflow-hidden">
                        <img src={level.img} alt={level.label} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <div className={`font-black uppercase italic text-sm ${data.fitnessLevel === level.id ? 'text-neon' : 'text-white'}`}>{level.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Workout Experience</label>
                <div className="grid grid-cols-2 gap-3">
                  {workoutExperiences.map(exp => (
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
      case 3:
        const goals = [
          { id: 'Fat Loss', label: 'Fat Loss 🔥', img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&q=80' },
          { id: 'Muscle Gain', label: 'Muscle Gain 💪', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80' },
          { id: 'Body Recomposition', label: 'Body Recomposition ⚖️', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' },
          { id: 'Strength', label: 'Strength ⚡', img: 'https://images.unsplash.com/photo-1552674605-15c2145eba67?w=400&q=80' },
          { id: 'General Fitness', label: 'General Fitness 🏃', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80' }
        ];

        const priorities = [
          { id: 'Aggressive', label: 'Aggressive', desc: 'Fast results' },
          { id: 'Balanced', label: 'Balanced', desc: 'Steady progress' },
          { id: 'Sustainable', label: 'Sustainable', desc: 'Slow & steady' }
        ];

        return (
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
              Your <span className="text-neon">Goals</span>
            </h2>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Primary Goal</label>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => updateData({ primaryGoal: goal.id })}
                      className={`relative overflow-hidden rounded-2xl border text-left transition-all group ${data.primaryGoal === goal.id ? 'border-neon ring-1 ring-neon' : 'border-white/5 hover:border-white/10'}`}
                    >
                      <div className="absolute inset-0 bg-zinc-900">
                        <img src={goal.img} alt={goal.label} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                      </div>
                      <div className="relative p-5 h-28 flex items-end">
                        <span className={`font-black uppercase italic text-sm ${data.primaryGoal === goal.id ? 'text-neon' : 'text-white'}`}>{goal.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Goal Priority</label>
                <div className="grid grid-cols-3 gap-3">
                  {priorities.map(priority => (
                    <button
                      key={priority.id}
                      onClick={() => updateData({ goalPriority: priority.id })}
                      className={`p-5 rounded-2xl border text-left transition-all ${data.goalPriority === priority.id ? 'border-neon bg-neon/10 shadow-[0_0_20px_rgba(204,255,0,0.1)]' : 'border-white/5 bg-zinc-900/40 hover:border-white/10'}`}
                    >
                      <div className={`font-black uppercase italic text-sm ${data.goalPriority === priority.id ? 'text-neon' : 'text-white'}`}>{priority.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-1 font-bold">{priority.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Target Areas</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Chest', 'Back', 'Legs', 'Core', 'Arms', 'Shoulders', 'Full Body'].map(area => (
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
                  {['4 weeks', '8 weeks', '12 weeks'].map(duration => (
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
      case 4:
        const scheduleOptions = ['3', '4', '5', '6'];
        const durationOptions = ['20–30 min', '30–45 min', '45–60 min'];
        const locations = ['Home', 'Gym'];
        const styles = ['Strength training', 'Cardio focused', 'Mixed', 'Functional training'];
        const preferences = ['Morning', 'Evening', 'Flexible'];

        return (
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
              Your <span className="text-neon">Routine</span>
            </h2>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Workout Location</label>
                <div className="grid grid-cols-2 gap-3">
                  {locations.map(loc => (
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
                  {styles.map(style => (
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
                  {['None / Bodyweight', 'Dumbbells', 'Resistance bands', 'Barbell', 'Machines'].map(eq => (
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
                    {scheduleOptions.map(days => (
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
                    {durationOptions.map(time => (
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
                  {preferences.map(time => (
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
      case 5:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
              Your <span className="text-neon">Fuel</span>
            </h2>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Diet Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Vegetarian', 'Non-Vegetarian', 'Vegan'].map(type => (
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
                  {[
                    { id: 'Indian home-style', label: 'Indian home-style 🇮🇳' },
                    { id: 'Mixed', label: 'Mixed (Indian + modern)' },
                    { id: 'Strict healthy diet', label: 'Strict healthy diet' }
                  ].map(style => (
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
                    {['3', '4', '5'].map(meals => (
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
                    {['Low', 'Medium', 'High'].map(budget => (
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
                  {['High protein focus', 'Normal', 'Not important'].map(pref => (
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
      case 6:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
              Daily <span className="text-neon">Activity</span>
            </h2>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Activity Level</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Sedentary', 'Moderately active', 'Highly active'].map(level => (
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
                    {['Less than 3k', '3k–7k', '7k–10k', '10k+'].map(steps => (
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
                    {['Low', 'Moderate', 'High'].map(stress => (
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
      case 7:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
              Recovery & <span className="text-neon">Hydration</span>
            </h2>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-[0.2em]">Sleep per Night</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'].map(sleep => (
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
                    {['Less than 1L', '1-2 Liters', '2-3 Liters', 'More than 3L'].map(water => (
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
                  {[
                    { id: 'Yes', label: 'Yes, I need recovery' },
                    { id: 'No', label: 'No, I want to train every day' }
                  ].map(rest => (
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
      case 8:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
                Review <span className="text-neon">Profile</span>
              </h2>
              <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Confirm your details before we build your plan</p>
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
    }
  };

  return (
    <div className="h-[100dvh] bg-zinc-950 text-white flex flex-col font-sans overflow-hidden">
      {/* Top Progress Bar - Fixed */}
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

      {/* Main Content Area - Scrollable */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-10 pb-72 md:px-8 md:pt-12 md:pb-96 custom-scrollbar"
      >
        <div className="max-w-2xl mx-auto">
          <AnimatePresence custom={direction}>
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
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation - Sticky */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-20 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="p-5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all shrink-0 active:scale-90"
              aria-label="Cancel"
              title="Cancel and return to home"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl text-zinc-400 border border-white/5 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shrink-0 active:scale-90"
              aria-label="Previous step"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
          
          {step < 8 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-neon text-black font-black text-xl rounded-2xl md:rounded-3xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.95] font-display uppercase italic"
            >
              Next Step
              <ArrowRight className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={() => onSubmit({ ...data, bmi: calculateBMI() ? parseFloat(calculateBMI()!.value) : undefined })}
              disabled={!termsAccepted}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-neon text-black font-black text-xl rounded-2xl md:rounded-3xl hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all active:scale-[0.95] shadow-lg font-display uppercase italic disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Generate Plan
              <CheckCircle2 className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
