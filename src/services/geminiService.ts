import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, GeneratedPlan } from "../types";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  limit, 
  serverTimestamp, 
  doc, 
  getDoc, 
  setDoc, 
  increment,
  runTransaction
} from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../utils/firestoreErrorHandler";

let aiInstance: GoogleGenAI | null = null;

function getAiInstance() {
  if (!aiInstance) {
    const apiKey = 
      process.env.GEMINI_API_KEY || 
      import.meta.env.VITE_GEMINI_API_KEY || 
      localStorage.getItem('user_gemini_api_key');

    if (!apiKey) {
      throw new Error("MISSING_API_KEY");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Helper to create a stable hash or string representation of inputs for caching
function getInputsHash(inputs: UserInputs): string {
  // Select key fields that define the plan
  const keyFields = {
    age: inputs.age,
    gender: inputs.gender,
    height: inputs.height,
    weight: inputs.weight,
    goalWeight: inputs.goalWeight,
    primaryGoal: inputs.primaryGoal,
    fitnessLevel: inputs.fitnessLevel,
    workoutLocation: inputs.workoutLocation,
    dietType: inputs.dietType,
    daysPerWeek: inputs.daysPerWeek
  };
  return JSON.stringify(keyFields);
}

export async function getTotalPlansCount(): Promise<number> {
  const path = "stats/global";
  try {
    const statsDoc = await getDoc(doc(db, "stats", "global"));
    if (statsDoc.exists()) {
      return statsDoc.data().totalPlans || 0;
    }
    return 0;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return 0;
  }
}

async function incrementTotalPlans() {
  const path = "stats/global";
  const statsRef = doc(db, "stats", "global");
  try {
    await setDoc(statsRef, { totalPlans: increment(1) }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function generatePlan(inputs: UserInputs): Promise<GeneratedPlan> {
  // 1. Check for existing related plan (simple exact match on key fields for now)
  const inputsHash = getInputsHash(inputs);
  const path = "plans";
  try {
    const plansRef = collection(db, "plans");
    const q = query(plansRef, where("inputsHash", "==", inputsHash), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log("Found existing related plan, reusing...");
      return querySnapshot.docs[0].data().plan as GeneratedPlan;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  // 2. Generate new plan if not found
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

  let response;
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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
      break; // Success
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
        retries++;
        if (retries === maxRetries) throw error;
        // Exponential backoff: 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      } else {
        throw error;
      }
    }
  }

  if (!response) {
    throw new Error("Failed to generate plan after retries");
  }

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate plan");
  }

  const plan = JSON.parse(text) as GeneratedPlan;

  // 3. Save new plan to Firestore and increment count
  const savePath = "plans";
  try {
    await addDoc(collection(db, "plans"), {
      inputs,
      inputsHash,
      plan,
      createdAt: serverTimestamp()
    });
    await incrementTotalPlans();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, savePath);
  }

  return plan;
}
