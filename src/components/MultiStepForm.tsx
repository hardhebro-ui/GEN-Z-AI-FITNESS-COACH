import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserInputs } from '../types';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface MultiStepFormProps {
  onSubmit: (data: UserInputs) => void;
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

export default function MultiStepForm({ onSubmit }: MultiStepFormProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UserInputs>(initialData);
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

  const nextStep = () => setStep(s => Math.min(s + 1, 8));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

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
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Let’s Understand Your Body</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">Age (13-80)</label>
                  <input
                    type="number"
                    min="13"
                    max="80"
                    value={data.age}
                    onChange={e => updateData({ age: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                    placeholder="e.g. 25"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">Gender (Optional)</label>
                  <select
                    value={data.gender}
                    onChange={e => updateData({ gender: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-zinc-600">Height</label>
                    <div className="flex bg-zinc-100 rounded-lg p-0.5">
                      <button
                        onClick={() => updateData({ heightUnit: 'cm' })}
                        className={`px-2 py-1 text-xs rounded-md ${data.heightUnit === 'cm' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
                      >
                        cm
                      </button>
                      <button
                        onClick={() => updateData({ heightUnit: 'ft/in' })}
                        className={`px-2 py-1 text-xs rounded-md ${data.heightUnit === 'ft/in' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
                      >
                        ft/in
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={data.height}
                    onChange={e => updateData({ height: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                    placeholder={data.heightUnit === 'cm' ? "e.g. 175" : "e.g. 5'9\""}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-zinc-600">Current Weight</label>
                    <div className="flex bg-zinc-100 rounded-lg p-0.5">
                      <button
                        onClick={() => updateData({ weightUnit: 'kg' })}
                        className={`px-2 py-1 text-xs rounded-md ${data.weightUnit === 'kg' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
                      >
                        kg
                      </button>
                      <button
                        onClick={() => updateData({ weightUnit: 'lbs' })}
                        className={`px-2 py-1 text-xs rounded-md ${data.weightUnit === 'lbs' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
                      >
                        lbs
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={data.weight}
                    onChange={e => updateData({ weight: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                    placeholder={data.weightUnit === 'kg' ? "e.g. 70" : "e.g. 154"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">Goal Weight ({data.weightUnit}) (Optional)</label>
                  <input
                    type="number"
                    value={data.goalWeight}
                    onChange={e => updateData({ goalWeight: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                    placeholder={data.weightUnit === 'kg' ? "e.g. 65" : "e.g. 143"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">Body Fat Estimate (Optional)</label>
                  <select
                    value={data.bodyFatEstimate}
                    onChange={e => updateData({ bodyFatEstimate: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    <option value="">Not sure? AI will decide</option>
                    <option value="Low">Low</option>
                    <option value="Average">Average</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              {bmiData && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <span className="text-zinc-600 text-sm block">Your BMI</span>
                    <span className="text-2xl font-bold text-zinc-900">{bmiData.value}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-sm font-medium ${bmiData.color}`}>
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
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Your Fitness Starting Point</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Body Type</label>
                <div className="w-full h-48 bg-white rounded-xl overflow-hidden mb-4 border border-zinc-300 flex items-center justify-center p-2">
                  <img 
                    src="/body-types.png" 
                    alt="Body Types Reference" 
                    className="w-full h-full object-contain" 
                    onError={(e) => { 
                      // Fallback if the user hasn't uploaded the image yet
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'; 
                      e.currentTarget.className = "w-full h-full object-cover opacity-50";
                      e.currentTarget.parentElement!.className = "w-full h-48 bg-white rounded-xl overflow-hidden mb-4 border border-zinc-300";
                    }} 
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {bodyTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => updateData({ bodyType: type.id })}
                      className={`relative overflow-hidden rounded-xl border text-left transition-all p-4 ${data.bodyType === type.id ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
                    >
                      <div className={`font-medium ${data.bodyType === type.id ? 'text-emerald-600' : 'text-zinc-800'}`}>{type.label}</div>
                      <div className="text-xs text-zinc-500 mt-1">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Fitness Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {fitnessLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => updateData({ fitnessLevel: level.id })}
                      className={`relative overflow-hidden rounded-xl border text-left transition-all ${data.fitnessLevel === level.id ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-zinc-200 hover:border-zinc-300'}`}
                    >
                      <div className="h-20 w-full bg-zinc-100">
                        <img src={level.img} alt={level.label} className="w-full h-full object-cover opacity-90" />
                      </div>
                      <div className="p-3 bg-white">
                        <div className={`font-medium ${data.fitnessLevel === level.id ? 'text-emerald-600' : 'text-zinc-800'}`}>{level.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Workout Experience (Optional)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {workoutExperiences.map(exp => (
                    <button
                      key={exp}
                      onClick={() => updateData({ workoutExperience: exp })}
                      className={`p-3 rounded-xl border text-sm transition-all ${data.workoutExperience === exp ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'}`}
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
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What Do You Want to Achieve?</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Primary Goal</label>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => updateData({ primaryGoal: goal.id })}
                      className={`relative overflow-hidden rounded-xl border text-left transition-all ${data.primaryGoal === goal.id ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-zinc-200 hover:border-zinc-300'}`}
                    >
                      <div className="absolute inset-0 bg-white">
                        <img src={goal.img} alt={goal.label} className="w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      </div>
                      <div className="relative p-4 h-24 flex items-end">
                        <span className={`font-medium ${data.primaryGoal === goal.id ? 'text-emerald-400' : 'text-white'}`}>{goal.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Goal Priority</label>
                <div className="grid grid-cols-3 gap-3">
                  {priorities.map(priority => (
                    <button
                      key={priority.id}
                      onClick={() => updateData({ goalPriority: priority.id })}
                      className={`p-4 rounded-xl border text-left transition-all ${data.goalPriority === priority.id ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
                    >
                      <div className={`font-medium ${data.goalPriority === priority.id ? 'text-emerald-600' : 'text-zinc-800'}`}>{priority.label}</div>
                      <div className="text-xs text-zinc-500 mt-1">{priority.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Target Areas (Multi-select)</label>
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
                      className={`p-3 rounded-xl border text-sm ${data.targetAreas.includes(area) ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Plan Duration</label>
                <div className="grid grid-cols-3 gap-3">
                  {['4 weeks', '8 weeks', '12 weeks'].map(duration => (
                    <button
                      key={duration}
                      onClick={() => updateData({ planDuration: duration })}
                      className={`p-4 rounded-xl border ${data.planDuration === duration ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
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
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Your Workout Setup</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Workout Location</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Home', 'Gym'].map(loc => (
                    <button
                      key={loc}
                      onClick={() => updateData({ workoutLocation: loc })}
                      className={`p-4 rounded-xl border ${data.workoutLocation === loc ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Preferred Workout Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Strength training', 'Cardio focused', 'Mixed', 'Functional training'].map(style => (
                    <button
                      key={style}
                      onClick={() => updateData({ preferredWorkoutStyle: style })}
                      className={`p-4 rounded-xl border ${data.preferredWorkoutStyle === style ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Equipment Available (Multi-select)</label>
                <div className="grid grid-cols-2 gap-3">
                  {['None / Bodyweight', 'Dumbbells', 'Resistance bands', 'Barbell', 'Machines'].map(eq => (
                    <button
                      key={eq}
                      onClick={() => {
                        const newEq = data.equipment.includes(eq)
                          ? data.equipment.filter(e => e !== eq)
                          : [...data.equipment, eq];
                        updateData({ equipment: newEq });
                      }}
                      className={`p-4 rounded-xl border ${data.equipment.includes(eq) ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-3">Days per week</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['3', '4', '5', '6'].map(days => (
                      <button
                        key={days}
                        onClick={() => updateData({ daysPerWeek: days })}
                        className={`p-3 rounded-xl border ${data.daysPerWeek === days ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                      >
                        {days}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-3">Time per session</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['20–30 min', '30–45 min', '45–60 min'].map(time => (
                      <button
                        key={time}
                        onClick={() => updateData({ timePerSession: time })}
                        className={`p-3 rounded-xl border ${data.timePerSession === time ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Workout Time Preference</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Morning', 'Evening', 'Flexible'].map(time => (
                    <button
                      key={time}
                      onClick={() => updateData({ workoutTimePreference: time })}
                      className={`p-4 rounded-xl border ${data.workoutTimePreference === time ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
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
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Your Eating Style</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Diet Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Vegetarian', 'Non-Vegetarian', 'Vegan'].map(type => (
                    <button
                      key={type}
                      onClick={() => updateData({ dietType: type })}
                      className={`p-4 rounded-xl border ${data.dietType === type ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Food Preference Style</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'Indian home-style', label: 'Indian home-style 🇮🇳' },
                    { id: 'Mixed', label: 'Mixed (Indian + modern)' },
                    { id: 'Strict healthy diet', label: 'Strict healthy diet' }
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => updateData({ foodPreferenceStyle: style.id })}
                      className={`p-4 rounded-xl border text-sm ${data.foodPreferenceStyle === style.id ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-3">Meals per day</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['3', '4', '5'].map(meals => (
                      <button
                        key={meals}
                        onClick={() => updateData({ mealsPerDay: meals })}
                        className={`p-3 rounded-xl border ${data.mealsPerDay === meals ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                      >
                        {meals}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-3">Budget Preference</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Low', 'Medium', 'High'].map(budget => (
                      <button
                        key={budget}
                        onClick={() => updateData({ budget })}
                        className={`p-3 rounded-xl border ${data.budget === budget ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Protein Preference</label>
                <div className="grid grid-cols-3 gap-3">
                  {['High protein focus', 'Normal', 'Not important'].map(pref => (
                    <button
                      key={pref}
                      onClick={() => updateData({ proteinPreference: pref })}
                      className={`p-4 rounded-xl border text-sm ${data.proteinPreference === pref ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Allergies or restrictions (Optional)</label>
                <input
                  type="text"
                  value={data.allergies}
                  onChange={e => updateData({ allergies: e.target.value })}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder="e.g. Peanuts, Gluten"
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Your Lifestyle & Health</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Daily Activity Level</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Sedentary', 'Moderately active', 'Highly active'].map(level => (
                    <button
                      key={level}
                      onClick={() => updateData({ activityLevel: level })}
                      className={`p-4 rounded-xl border ${data.activityLevel === level ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-3">Daily Steps (Optional)</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Less than 3k', '3k–7k', '7k–10k', '10k+'].map(steps => (
                      <button
                        key={steps}
                        onClick={() => updateData({ dailySteps: steps })}
                        className={`p-3 rounded-xl border text-sm ${data.dailySteps === steps ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                      >
                        {steps}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-3">Stress Level (Optional)</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Low', 'Moderate', 'High'].map(stress => (
                      <button
                        key={stress}
                        onClick={() => updateData({ stressLevel: stress })}
                        className={`p-3 rounded-xl border text-sm ${data.stressLevel === stress ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                      >
                        {stress}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Medical Conditions (Optional)</label>
                <input
                  type="text"
                  value={data.medicalConditions}
                  onChange={e => updateData({ medicalConditions: e.target.value })}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder="e.g. Asthma, Hypertension"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Past Injuries (Optional)</label>
                <input
                  type="text"
                  value={data.pastInjuries}
                  onChange={e => updateData({ pastInjuries: e.target.value })}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder="e.g. Knee surgery, Lower back pain"
                />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Recovery & Hydration</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-3">Average Sleep per Night</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'].map(sleep => (
                      <button
                        key={sleep}
                        onClick={() => updateData({ sleepHours: sleep })}
                        className={`p-3 rounded-xl border text-sm ${data.sleepHours === sleep ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                      >
                        {sleep}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-3">Daily Water Intake</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Less than 1L', '1-2 Liters', '2-3 Liters', 'More than 3L'].map(water => (
                      <button
                        key={water}
                        onClick={() => updateData({ hydration: water })}
                        className={`p-3 rounded-xl border text-sm ${data.hydration === water ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                      >
                        {water}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Willingness for Rest Days</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Yes', label: 'Yes, I need recovery' },
                    { id: 'No', label: 'No, I want to train every day' }
                  ].map(rest => (
                    <button
                      key={rest.id}
                      onClick={() => updateData({ willingnessForRestDays: rest.id })}
                      className={`p-4 rounded-xl border text-sm ${data.willingnessForRestDays === rest.id ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
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
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Review & Confirm</h2>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-zinc-50 p-4 rounded-xl">
                  <span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">Body</span>
                  <span className="text-zinc-800 font-medium">{data.age} yrs / {data.height}{data.heightUnit} / {data.weight}{data.weightUnit}</span>
                  {data.goalWeight && <span className="text-zinc-600 block mt-1">Goal: {data.goalWeight}{data.weightUnit}</span>}
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl">
                  <span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">Goal</span>
                  <span className="text-zinc-800 font-medium">{data.primaryGoal}</span>
                  {data.goalPriority && <span className="text-zinc-600 block mt-1">{data.goalPriority}</span>}
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl">
                  <span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">Workout</span>
                  <span className="text-zinc-800 font-medium">{data.workoutLocation}, {data.daysPerWeek} days/wk</span>
                  {data.preferredWorkoutStyle && <span className="text-zinc-600 block mt-1">{data.preferredWorkoutStyle}</span>}
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl">
                  <span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">Diet</span>
                  <span className="text-zinc-800 font-medium">{data.dietType}, {data.mealsPerDay} meals/day</span>
                  {data.foodPreferenceStyle && <span className="text-zinc-600 block mt-1">{data.foodPreferenceStyle}</span>}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-[100dvh] bg-zinc-50 text-zinc-900 flex flex-col font-sans overflow-hidden">
      {/* Top Progress Bar - Fixed */}
      <div className="sticky top-0 z-30 bg-zinc-50/95 backdrop-blur-md pt-4 pb-4 px-4 md:px-6 border-b border-zinc-200 shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm font-semibold text-zinc-500 mb-3">
            <span>Step {step} of 8</span>
            <span className="text-emerald-600">{Math.round((step / 8) * 100)}%</span>
          </div>
          <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 8) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8 pb-40" // Increased padding bottom for sticky footer
      >
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation - Sticky */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="p-4 rounded-2xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          {step < 8 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-semibold text-lg rounded-2xl hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => onSubmit({ ...data, bmi: calculateBMI() ? parseFloat(calculateBMI()!.value) : undefined })}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-semibold text-lg rounded-2xl hover:bg-emerald-500 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
            >
              Generate Plan
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
