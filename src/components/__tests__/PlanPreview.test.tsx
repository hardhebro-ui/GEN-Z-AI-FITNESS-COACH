import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlanPreview from '../PlanPreview';
import { GeneratedPlan, UserInputs } from '../../types';

describe('PlanPreview Component', () => {
  const mockOnRegenerate = vi.fn();
  const mockOnExport = vi.fn();

  const mockPlan: GeneratedPlan = {
    personalizedSummary: 'This is a test summary',
    coachingTips: ['Tip 1', 'Tip 2'],
    workout: {
      weeklySplit: [
        {
          day: 'Day 1',
          focus: 'Full Body',
          dayPurpose: 'Strength',
          exercises: [
            { name: 'Squats', setsReps: '3x10', rest: '60s', notes: 'Keep back straight', alternative: 'Leg Press' }
          ]
        }
      ]
    },
    diet: {
      dailyCalories: '2500',
      macros: { protein: '150g', carbs: '250g', fats: '70g' },
      weeklySchedule: [
        {
          day: 'Day 1',
          meals: [
            { name: 'Breakfast', options: ['Oatmeal'], alternatives: 'Eggs' }
          ]
        }
      ]
    },
    safetyNotes: ['Stay hydrated'],
    dietStrategyTips: ['Eat more protein']
  };

  const mockInputs: UserInputs = {
    age: '25',
    gender: 'Male',
    height: '180',
    heightUnit: 'cm',
    weight: '80',
    weightUnit: 'kg',
    goalWeight: '75',
    bodyFatEstimate: '15%',
    bodyType: 'Ectomorph',
    fitnessLevel: 'Intermediate',
    workoutExperience: '2 years',
    primaryGoal: 'Muscle Gain',
    goalPriority: 'Strength',
    targetAreas: ['Legs'],
    planDuration: '8 Weeks',
    workoutLocation: 'Gym',
    equipment: ['Barbell'],
    daysPerWeek: '4',
    timePerSession: '60 min',
    preferredWorkoutStyle: 'Strength',
    workoutTimePreference: 'Morning',
    dietType: 'High Protein',
    mealsPerDay: '4',
    allergies: 'None',
    budget: 'Moderate',
    foodPreferenceStyle: 'Whole Foods',
    proteinPreference: 'Chicken',
    activityLevel: 'Active',
    dailySteps: '10000',
    stressLevel: 'Low',
    sleepHours: '8',
    hydration: '3L',
    willingnessForRestDays: 'Yes',
    medicalConditions: 'None',
    pastInjuries: 'None'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders plan details correctly', () => {
    render(
      <PlanPreview 
        plan={mockPlan} 
        inputs={mockInputs} 
        onRegenerate={mockOnRegenerate} 
        onExport={mockOnExport} 
      />
    );

    expect(screen.getByText(/Your fitin60.ai Plan/i)).toBeInTheDocument();
    expect(screen.getByText(mockPlan.personalizedSummary!)).toBeInTheDocument();
    expect(screen.getByText('Muscle Gain • 8 Weeks')).toBeInTheDocument();
  });

  it('calls onRegenerate when retry button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <PlanPreview 
        plan={mockPlan} 
        inputs={mockInputs} 
        onRegenerate={mockOnRegenerate} 
        onExport={mockOnExport} 
      />
    );

    const retryBtn = screen.getByText(/Retry/i);
    await user.click(retryBtn);

    expect(mockOnRegenerate).toHaveBeenCalled();
  });

  it('calls onExport when export button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <PlanPreview 
        plan={mockPlan} 
        inputs={mockInputs} 
        onRegenerate={mockOnRegenerate} 
        onExport={mockOnExport} 
      />
    );

    const exportBtn = screen.getByText(/Export Protocol/i);
    await user.click(exportBtn);

    expect(mockOnExport).toHaveBeenCalled();
  });

  it('renders workout exercises', () => {
    render(
      <PlanPreview 
        plan={mockPlan} 
        inputs={mockInputs} 
        onRegenerate={mockOnRegenerate} 
        onExport={mockOnExport} 
      />
    );

    expect(screen.getAllByText('Squats').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3x10').length).toBeGreaterThan(0);
  });

  it('renders diet information', () => {
    render(
      <PlanPreview 
        plan={mockPlan} 
        inputs={mockInputs} 
        onRegenerate={mockOnRegenerate} 
        onExport={mockOnExport} 
      />
    );

    expect(screen.getByText('2500')).toBeInTheDocument();
    expect(screen.getByText('150g')).toBeInTheDocument();
  });
});
