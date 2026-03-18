export interface UserInputs {
  age: string;
  gender: string;
  height: string;
  heightUnit: 'cm' | 'ft/in';
  weight: string;
  weightUnit: 'kg' | 'lbs';
  goalWeight: string;
  bodyFatEstimate: string;
  bodyType: string;
  fitnessLevel: string;
  workoutExperience: string;
  primaryGoal: string;
  goalPriority: string;
  targetAreas: string[];
  planDuration: string;
  workoutLocation: string;
  equipment: string[];
  daysPerWeek: string;
  timePerSession: string;
  preferredWorkoutStyle: string;
  workoutTimePreference: string;
  dietType: string;
  mealsPerDay: string;
  allergies: string;
  budget: string;
  foodPreferenceStyle: string;
  proteinPreference: string;
  activityLevel: string;
  dailySteps: string;
  stressLevel: string;
  sleepHours: string;
  hydration: string;
  willingnessForRestDays: string;
  medicalConditions: string;
  pastInjuries: string;
  bmi?: number;
}

export interface WorkoutPlan {
  weeklySplit: {
    day: string;
    focus: string;
    exercises: {
      name: string;
      setsReps: string;
      rest: string;
      alternative: string;
      notes: string;
    }[];
  }[];
}

export interface DietPlan {
  dailyCalories: string;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  meals: {
    name: string;
    options: string[];
    alternatives: string;
  }[];
}

export interface GeneratedPlan {
  workout: WorkoutPlan;
  diet: DietPlan;
  safetyNotes: string[];
}

export interface Review {
  id: string | number;
  rating: number;
  text: string;
  name: string;
  date: string;
}
