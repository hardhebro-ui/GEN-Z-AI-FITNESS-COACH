import React, { useState } from 'react';
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
  weight: '',
  bodyType: '',
  fitnessLevel: '',
  primaryGoal: '',
  targetAreas: [],
  planDuration: '',
  workoutLocation: '',
  equipment: [],
  daysPerWeek: '',
  timePerSession: '',
  dietType: '',
  mealsPerDay: '',
  allergies: '',
  budget: '',
  activityLevel: '',
  sleepHours: '',
  hydration: '',
  medicalConditions: '',
  pastInjuries: ''
};

export default function MultiStepForm({ onSubmit }: MultiStepFormProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UserInputs>(initialData);

  const updateData = (fields: Partial<UserInputs>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 8));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1: return data.age && data.height && data.weight;
      case 2: return data.bodyType && data.fitnessLevel;
      case 3: return data.primaryGoal && data.targetAreas.length > 0 && data.planDuration;
      case 4: return data.workoutLocation && data.daysPerWeek && data.timePerSession;
      case 5: return data.dietType && data.mealsPerDay && data.budget;
      case 6: return data.activityLevel;
      case 7: return data.sleepHours && data.hydration;
      case 8: return true;
      default: return false;
    }
  };

  const calculateBMI = () => {
    const h = parseFloat(data.height) / 100;
    const w = parseFloat(data.weight);
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
            <h2 className="text-3xl font-bold">Basic Body Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Age</label>
                <input
                  type="number"
                  value={data.age}
                  onChange={e => updateData({ age: e.target.value })}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder="e.g. 25"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={data.height}
                    onChange={e => updateData({ height: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                    placeholder="e.g. 175"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={data.weight}
                    onChange={e => updateData({ weight: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                    placeholder="e.g. 70"
                  />
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

        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Body Type & Fitness</h2>
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
            </div>
          </div>
        );
      case 3:
        const goals = [
          { id: 'Fat Loss', label: 'Lose Fat', img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&q=80' },
          { id: 'Muscle Gain', label: 'Build Muscle', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80' },
          { id: 'Recomposition', label: 'Recomp', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' },
          { id: 'Endurance', label: 'Endurance', img: 'https://images.unsplash.com/photo-1552674605-15c2145eba67?w=400&q=80' }
        ];

        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Goals & Targets</h2>
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
            <h2 className="text-3xl font-bold">Workout Preferences</h2>
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
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Diet Preferences</h2>
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
                <label className="block text-sm font-medium text-zinc-600 mb-3">Meals per day</label>
                <div className="grid grid-cols-3 gap-3">
                  {['3', '4', '5'].map(meals => (
                    <button
                      key={meals}
                      onClick={() => updateData({ mealsPerDay: meals })}
                      className={`p-4 rounded-xl border ${data.mealsPerDay === meals ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
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
                      className={`p-4 rounded-xl border ${data.budget === budget ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {budget}
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
            <h2 className="text-3xl font-bold">Health & Lifestyle</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Daily Activity Level</label>
                <div className="grid grid-cols-1 gap-3">
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
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Average Sleep per Night</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'].map(sleep => (
                    <button
                      key={sleep}
                      onClick={() => updateData({ sleepHours: sleep })}
                      className={`p-4 rounded-xl border ${data.sleepHours === sleep ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {sleep}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-3">Daily Water Intake</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Less than 1L', '1-2 Liters', '2-3 Liters', 'More than 3L'].map(water => (
                    <button
                      key={water}
                      onClick={() => updateData({ hydration: water })}
                      className={`p-4 rounded-xl border ${data.hydration === water ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}`}
                    >
                      {water}
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
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500 block">Age / Height / Weight</span>
                  <span className="text-zinc-800">{data.age} / {data.height}cm / {data.weight}kg</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Goal</span>
                  <span className="text-zinc-800">{data.primaryGoal}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Workout</span>
                  <span className="text-zinc-800">{data.workoutLocation}, {data.daysPerWeek} days/wk</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Diet</span>
                  <span className="text-zinc-800">{data.dietType}, {data.mealsPerDay} meals/day</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col p-6">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm font-medium text-zinc-500 mb-4">
            <span>Step {step} of 8</span>
            <span>{Math.round((step / 8) * 100)}% Completed</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 8) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-900">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="p-4 rounded-full bg-white text-zinc-600 hover:text-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          {step < 8 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-zinc-950 font-semibold rounded-full hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => onSubmit({ ...data, bmi: calculateBMI() ? parseFloat(calculateBMI()!.value) : undefined })}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-zinc-950 font-semibold rounded-full hover:bg-emerald-400 transition-all"
            >
              Generate My Plan
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
