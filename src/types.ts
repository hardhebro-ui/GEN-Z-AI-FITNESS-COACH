export interface UserInputs {
  age: string;
  gender: string;
  height: string;
  weight: string;
  bodyType: string;
  fitnessLevel: string;
  primaryGoal: string;
  targetAreas: string[];
  planDuration: string;
  workoutLocation: string;
  equipment: string[];
  daysPerWeek: string;
  timePerSession: string;
  dietType: string;
  mealsPerDay: string;
  allergies: string;
  budget: string;
  activityLevel: string;
  sleepHours: string;
  hydration: string;
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
  id: number;
  rating: number;
  text: string;
  name: string;
  date: string;
}
