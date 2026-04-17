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
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("MISSING_API_KEY");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Helper to create a fuzzy key for caching based on ranges and core inputs
function getInputsHash(inputs: UserInputs): string {
  // Normalize height to CM
  let h = parseFloat(inputs.height);
  if (inputs.heightUnit === 'ft/in') {
    if (inputs.height.includes("'")) {
      const parts = inputs.height.split("'");
      const ft = parseFloat(parts[0]) || 0;
      const inches = parseFloat(parts[1]?.replace('"', '')) || 0;
      h = (ft * 12 + inches) * 2.54;
    } else {
      h = h * 30.48;
    }
  }

  // Normalize weight to KG
  let w = parseFloat(inputs.weight);
  if (inputs.weightUnit === 'lbs') {
    w = w * 0.453592;
  }

  // Grouping into ranges for fuzzy matching
  const ageRange = Math.floor(parseInt(inputs.age) / 5) * 5; // Group by 5 years
  const weightRange = Math.floor(w / 5) * 5; // Group by 5kg
  const heightRange = Math.floor(h / 5) * 5; // Group by 5cm

  // Select key fields that define the plan similarity
  const fuzzyKey = {
    ageRange,
    gender: inputs.gender,
    heightRange,
    weightRange,
    primaryGoal: inputs.primaryGoal,
    fitnessLevel: inputs.fitnessLevel,
    workoutLocation: inputs.workoutLocation,
    dietType: inputs.dietType,
    daysPerWeek: inputs.daysPerWeek,
    // Sort equipment to ensure consistent key regardless of selection order
    equipment: [...(inputs.equipment || [])].sort().join(',')
  };
  
  return JSON.stringify(fuzzyKey);
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

export async function generatePlan(inputs: UserInputs, force: boolean = false): Promise<{ plan: GeneratedPlan; fromCache: boolean }> {
  // 1. Check for existing related plan (fuzzy match on key fields)
  const inputsHash = getInputsHash(inputs);
  const path = "plans";
  
  if (!force) {
    try {
      const plansRef = collection(db, "plans");
      const q = query(plansRef, where("inputsHash", "==", inputsHash), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log("Found existing related plan, reusing...");
        return { 
          plan: querySnapshot.docs[0].data().plan as GeneratedPlan,
          fromCache: true 
        };
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }

  // 2. Generate new plan if not found
  const ai = getAiInstance();
  const prompt = `
    You are a professional, motivating, and practical AI Fitness & Nutrition Coach. Your goal is to generate a clean, highly personalized fitness and nutrition plan that feels like a premium report created by a human expert.

    USER PROFILE:
    - Age: ${inputs.age}
    - Gender: ${inputs.gender}
    - Height: ${inputs.height} ${inputs.heightUnit}
    - Weight: ${inputs.weight} ${inputs.weightUnit}
    - Goal Weight: ${inputs.goalWeight ? `${inputs.goalWeight} ${inputs.weightUnit}` : 'Not specified'}
    - Body Type: ${inputs.bodyType}
    - Fitness Level: ${inputs.fitnessLevel}
    - Primary Goal: ${inputs.primaryGoal}
    - Target Areas: ${inputs.targetAreas?.join(', ') || 'Full Body'}
    - Plan Duration: ${inputs.planDuration}
    - Workout Location: ${inputs.workoutLocation}
    - Equipment: ${inputs.equipment?.join(', ') || 'None'}
    - Days per week: ${inputs.daysPerWeek}
    - Diet Type: ${inputs.dietType}
    - Activity Level: ${inputs.activityLevel}
    - Medical Conditions: ${inputs.medicalConditions || 'None'}
    - Past Injuries: ${inputs.pastInjuries || 'None'}

    INSTRUCTIONS:
    1. **Coach's Insight**: Start with a strong, natural summary (not robotic). Explain exactly why this plan is designed for the user based on their goal, body type, and lifestyle. Avoid generic placeholders.
    2. **Tone**: Use a real coach's tone—clear, motivating, and practical. Relatable, not robotic.
    3. **Workout Section**: 
       - Clean weekly format with clear day names and focus areas.
       - Each day must have a short one-line "dayPurpose" (e.g., "Focus: Build strength while improving fat burn").
       - Exercise instructions must be concise (MAX 1 line per note).
       - Ensure sets, reps, and rest are cleanly specified and aligned.
       - Prioritize quality over quantity—don't overload exercises.
       - Provide 1 realistic alternative for each exercise.
    4. **Diet Plan**:
       - Generate a **7-day weekly meal schedule** (Monday to Sunday).
       - For each day, include Breakfast, Lunch, Dinner, and 1–2 Snacks.
       - Provide 2–3 alternative options per meal to maintain variety.
       - Use realistic Indian food options tailored to the user's goal, diet type, and budget.
       - Ensure meals are practical, affordable, and easy to prepare.
       - Maintain consistency in calorie and macro targets across all days while rotating ingredients to avoid monotony.
       - Balance protein sources (eggs, chicken, paneer, dal, soy, etc.).
    5. **Diet Strategy Tips**: Include 2–3 short tips on swapping meals, managing cravings, and staying consistent.
    6. **Coaching Tips**: Include 2–3 personalized coaching tips specific to the user (e.g., for beginners, ectomorphs, or fat loss cases).
    7. **Safety**: Include only ONE short, clean safety note at the end. No repetition.
    8. **Readability**: The output must feel like a premium, easy-to-follow fitness plan that is motivating and actionable.

    Output the response strictly as a JSON object matching the provided schema.
  `;

  let response;
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              personalizedSummary: { type: Type.STRING, description: "A strong, natural Coach's Insight summary." },
              workout: {
                type: Type.OBJECT,
                properties: {
                  weeklySplit: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.STRING, description: "Day name (e.g., Monday)" },
                        focus: { type: Type.STRING, description: "Focus of the day (e.g., Push Day)" },
                        dayPurpose: { type: Type.STRING, description: "One-line purpose of the day." },
                        exercises: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              name: { type: Type.STRING },
                              setsReps: { type: Type.STRING },
                              rest: { type: Type.STRING },
                              alternative: { type: Type.STRING },
                              notes: { type: Type.STRING, description: "Max 1 line instruction." }
                            },
                            required: ["name", "setsReps", "rest", "alternative", "notes"]
                          }
                        }
                      },
                      required: ["day", "focus", "dayPurpose", "exercises"]
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
                  weeklySchedule: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.STRING, description: "Day name (e.g., Monday)" },
                        meals: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              name: { type: Type.STRING, description: "Meal name (e.g., Breakfast)" },
                              options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 variety options." },
                              alternatives: { type: Type.STRING, description: "Quick swap tip." }
                            },
                            required: ["name", "options", "alternatives"]
                          }
                        }
                      },
                      required: ["day", "meals"]
                    }
                  }
                },
                required: ["dailyCalories", "macros", "weeklySchedule"]
              },
              dietStrategyTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 diet strategy tips."
              },
              coachingTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 personalized coaching tips."
              },
              safetyNotes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "One short, clean safety note."
              }
            },
            required: ["personalizedSummary", "workout", "diet", "dietStrategyTips", "coachingTips", "safetyNotes"]
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
    // Derive fields for Explore feature
    const title = `${inputs.primaryGoal} Protocol: ${inputs.fitnessLevel} ${inputs.workoutLocation}`;
    const tags = [
      inputs.primaryGoal,
      inputs.fitnessLevel,
      inputs.workoutLocation,
      inputs.dietType,
      ...(inputs.targetAreas || [])
    ].filter(Boolean);

    await addDoc(collection(db, "plans"), {
      title,
      goal: inputs.primaryGoal,
      level: inputs.fitnessLevel,
      duration: inputs.planDuration,
      location: inputs.workoutLocation,
      dietType: inputs.dietType,
      tags,
      rating: 0, // No rating yet
      downloads: 0,
      inputs,
      inputsHash,
      plan,
      planData: plan, // For consistency with ExplorePlan interface
      createdAt: serverTimestamp()
    });
    await incrementTotalPlans();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, savePath);
  }

  return { plan, fromCache: false };
}
