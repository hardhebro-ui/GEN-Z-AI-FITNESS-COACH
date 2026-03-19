import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, GeneratedPlan } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAiInstance() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Please configure it in your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function generatePlan(inputs: UserInputs): Promise<GeneratedPlan> {
  const ai = getAiInstance();
  const prompt = `
    You are an expert fitness coach and nutritionist. Generate a highly personalized workout and diet plan based on the following user details:
    - Age: ${inputs.age}
    - Gender: ${inputs.gender}
    - Height: ${inputs.height} ${inputs.heightUnit}
    - Weight: ${inputs.weight} ${inputs.weightUnit}
    - Goal Weight: ${inputs.goalWeight ? `${inputs.goalWeight} ${inputs.weightUnit}` : 'Not specified'}
    - Body Fat Estimate: ${inputs.bodyFatEstimate || 'Not specified'}
    - BMI: ${inputs.bmi || 'Not calculated'}
    - Body Type: ${inputs.bodyType}
    - Fitness Level: ${inputs.fitnessLevel}
    - Workout Experience: ${inputs.workoutExperience || 'Not specified'}
    - Primary Goal: ${inputs.primaryGoal}
    - Goal Priority: ${inputs.goalPriority || 'Not specified'}
    - Target Areas: ${inputs.targetAreas?.join(', ') || 'Full Body'}
    - Plan Duration: ${inputs.planDuration}
    - Workout Location: ${inputs.workoutLocation}
    - Equipment: ${inputs.equipment?.join(', ') || 'None'}
    - Days per week: ${inputs.daysPerWeek}
    - Time per session: ${inputs.timePerSession}
    - Preferred Workout Style: ${inputs.preferredWorkoutStyle || 'Not specified'}
    - Workout Time Preference: ${inputs.workoutTimePreference || 'Not specified'}
    - Diet Type: ${inputs.dietType}
    - Food Preference Style: ${inputs.foodPreferenceStyle || 'Not specified'}
    - Protein Preference: ${inputs.proteinPreference || 'Not specified'}
    - Meals per day: ${inputs.mealsPerDay}
    - Allergies: ${inputs.allergies || 'None'}
    - Budget: ${inputs.budget}
    - Activity Level: ${inputs.activityLevel}
    - Daily Steps: ${inputs.dailySteps || 'Not specified'}
    - Stress Level: ${inputs.stressLevel || 'Not specified'}
    - Sleep Hours: ${inputs.sleepHours || 'Not specified'}
    - Hydration: ${inputs.hydration || 'Not specified'}
    - Willingness for Rest Days: ${inputs.willingnessForRestDays || 'Not specified'}
    - Medical Conditions: ${inputs.medicalConditions || 'None'}
    - Past Injuries: ${inputs.pastInjuries || 'None'}

    Provide a realistic, safe, and effective plan. Include budget-friendly Indian food options if applicable.
    Output the response strictly as a JSON object matching the provided schema. No markdown, no extra text.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          workout: {
            type: Type.OBJECT,
            properties: {
              weeklySplit: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING, description: "Day number or name (e.g., Day 1, Monday)" },
                    focus: { type: Type.STRING, description: "Focus of the day (e.g., Upper Body, Rest)" },
                    exercises: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          setsReps: { type: Type.STRING },
                          rest: { type: Type.STRING },
                          alternative: { type: Type.STRING },
                          notes: { type: Type.STRING }
                        },
                        required: ["name", "setsReps", "rest", "alternative", "notes"]
                      }
                    }
                  },
                  required: ["day", "focus", "exercises"]
                }
              }
            },
            required: ["weeklySplit"]
          },
          diet: {
            type: Type.OBJECT,
            properties: {
              dailyCalories: { type: Type.STRING },
              macros: {
                type: Type.OBJECT,
                properties: {
                  protein: { type: Type.STRING },
                  carbs: { type: Type.STRING },
                  fats: { type: Type.STRING }
                },
                required: ["protein", "carbs", "fats"]
              },
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Meal name (e.g., Breakfast)" },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    alternatives: { type: Type.STRING }
                  },
                  required: ["name", "options", "alternatives"]
                }
              }
            },
            required: ["dailyCalories", "macros", "meals"]
          },
          safetyNotes: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["workout", "diet", "safetyNotes"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate plan");
  }

  return JSON.parse(text) as GeneratedPlan;
}
