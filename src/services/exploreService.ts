import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  increment,
  QueryConstraint
} from "firebase/firestore";
import { db } from "../firebase";
import { ExplorePlan } from "../types";
import { handleFirestoreError, OperationType } from "../utils/firestoreErrorHandler";

const PLANS_PER_PAGE = 24;
const CACHE_KEY = 'fitin60_explore_cache';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

export interface ExploreFilters {
  goal?: string;
  level?: string;
  duration?: string;
  location?: string;
  search?: string;
  sortBy?: 'downloads' | 'createdAt' | 'rating';
}

export async function fetchExplorePlans(
  filters: ExploreFilters,
  lastDoc: any = null
): Promise<{ plans: ExplorePlan[]; lastDoc: any }> {
  const path = "explorePlans";
  try {
    // Check cache for initial load without filters
    if (!lastDoc && !filters.goal && !filters.level && !filters.duration && !filters.location && !filters.search) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY && data && data.length > 0) {
          return { plans: data, lastDoc: null };
        }
      }
    }

    let plansRef = collection(db, "explorePlans");
    let constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.goal) constraints.push(where("goal", "==", filters.goal));
    if (filters.level) constraints.push(where("level", "==", filters.level));
    if (filters.duration) constraints.push(where("duration", "==", filters.duration));
    if (filters.location) constraints.push(where("location", "==", filters.location));

    // Apply sorting - Default to createdAt desc
    if (filters.sortBy === 'downloads') {
      constraints.push(orderBy("downloads", "desc"));
    } else if (filters.sortBy === 'rating') {
      constraints.push(orderBy("rating", "desc"));
    } else {
      // Use a more robust ordering or no ordering if it might fail
      constraints.push(orderBy("createdAt", "desc"));
    }

    // Pagination
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    constraints.push(limit(PLANS_PER_PAGE));

    let q = query(plansRef, ...constraints);
    let querySnapshot = await getDocs(q);

    // Fallback to "plans" collection if "explorePlans" is empty and no filters are applied
    if (querySnapshot.empty && !lastDoc && !filters.goal && !filters.level && !filters.duration && !filters.location) {
      console.log("explorePlans is empty, trying 'plans' collection...");
      const altPlansRef = collection(db, "plans");
      const altQ = query(altPlansRef, orderBy("createdAt", "desc"), limit(PLANS_PER_PAGE));
      querySnapshot = await getDocs(altQ);
      
      const plans = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Map "plans" schema to "ExplorePlan" schema
        return {
          id: doc.id,
          title: data.title || (data.inputs?.primaryGoal ? `${data.inputs.primaryGoal} Protocol` : "Custom Protocol"),
          goal: data.goal || data.inputs?.primaryGoal || "General",
          level: data.level || data.inputs?.fitnessLevel || "All Levels",
          duration: data.duration || data.inputs?.planDuration || "4 Weeks",
          location: data.location || data.inputs?.workoutLocation || "Gym",
          dietType: data.dietType || data.inputs?.dietType || "Standard",
          tags: data.tags || [],
          rating: data.rating,
          downloads: data.downloads,
          createdAt: data.createdAt,
          preview: data.preview || {
            summary: data.plan?.personalizedSummary ? (data.plan.personalizedSummary.substring(0, 100) + "...") : null,
            calories: data.plan?.diet?.dailyCalories || null
          },
          // We don't include planData here to support lazy loading
        };
      }) as ExplorePlan[];

      return {
        plans,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
      };
    }

    let plans = querySnapshot.docs.map(doc => {
      const { planData, ...rest } = doc.data();
      return {
        id: doc.id,
        ...rest
      };
    }) as ExplorePlan[];

    // Cache initial load only if we have data
    if (plans.length > 0 && !lastDoc && !filters.goal && !filters.level && !filters.duration && !filters.location && !filters.search) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: plans,
        timestamp: Date.now()
      }));
    }

    return {
      plans,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return { plans: [], lastDoc: null };
  }
}

export async function incrementDownloadCount(planId: string) {
  try {
    // Try explorePlans first
    const planRef = doc(db, "explorePlans", planId);
    const planDoc = await getDoc(planRef);
    
    if (planDoc.exists()) {
      await updateDoc(planRef, {
        downloads: increment(1)
      });
    } else {
      // Fallback to plans collection
      const altPlanRef = doc(db, "plans", planId);
      const altPlanDoc = await getDoc(altPlanRef);
      if (altPlanDoc.exists()) {
        await updateDoc(altPlanRef, {
          downloads: increment(1)
        });
      }
    }
  } catch (error) {
    // The error might have happened in either collection, but we'll report the planId
    handleFirestoreError(error, OperationType.WRITE, `plans_or_explorePlans/${planId}`);
  }
}

export async function fetchTrendingPlans(): Promise<ExplorePlan[]> {
  const path = "explorePlans";
  try {
    const plansRef = collection(db, "explorePlans");
    const q = query(plansRef, orderBy("downloads", "desc"), limit(4));
    let querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const altPlansRef = collection(db, "plans");
      const altQ = query(altPlansRef, orderBy("createdAt", "desc"), limit(4));
      querySnapshot = await getDocs(altQ);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || (data.inputs?.primaryGoal ? `${data.inputs.primaryGoal} Protocol` : "Custom Protocol"),
          goal: data.goal || data.inputs?.primaryGoal || "General",
          level: data.level || data.inputs?.fitnessLevel || "All Levels",
          duration: data.duration || data.inputs?.planDuration || "4 Weeks",
          location: data.location || data.inputs?.workoutLocation || "Gym",
          dietType: data.dietType || data.inputs?.dietType || "Standard",
          tags: data.tags || [],
          rating: data.rating,
          downloads: data.downloads,
          createdAt: data.createdAt,
          preview: data.preview || {
            summary: data.plan?.personalizedSummary ? (data.plan.personalizedSummary.substring(0, 100) + "...") : null,
            calories: data.plan?.diet?.dailyCalories || null
          },
          planData: data.planData || data.plan
        } as ExplorePlan;
      });
    }

    return querySnapshot.docs.map(doc => {
      const { planData, ...rest } = doc.data();
      return {
        id: doc.id,
        ...rest
      };
    }) as ExplorePlan[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function fetchPlanDetails(planId: string): Promise<ExplorePlan | null> {
  try {
    // Try explorePlans first
    const planRef = doc(db, "explorePlans", planId);
    const planDoc = await getDoc(planRef);
    
    if (planDoc.exists()) {
      const data = planDoc.data();
      return {
        id: planDoc.id,
        ...data
      } as ExplorePlan;
    } else {
      // Fallback to plans collection
      const altPlanRef = doc(db, "plans", planId);
      const altPlanDoc = await getDoc(altPlanRef);
      if (altPlanDoc.exists()) {
        const data = altPlanDoc.data();
        return {
          id: altPlanDoc.id,
          title: data.title || (data.inputs?.primaryGoal ? `${data.inputs.primaryGoal} Protocol` : "Custom Protocol"),
          goal: data.goal || data.inputs?.primaryGoal || "General",
          level: data.level || data.inputs?.fitnessLevel || "All Levels",
          duration: data.duration || data.inputs?.planDuration || "4 Weeks",
          location: data.location || data.inputs?.workoutLocation || "Gym",
          dietType: data.dietType || data.inputs?.dietType || "Standard",
          tags: data.tags || [],
          rating: data.rating,
          downloads: data.downloads,
          createdAt: data.createdAt,
          preview: data.preview || {
            summary: data.plan?.personalizedSummary ? (data.plan.personalizedSummary.substring(0, 100) + "...") : null,
            calories: data.plan?.diet?.dailyCalories || null
          },
          planData: data.planData || data.plan
        } as ExplorePlan;
      }
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `plans_or_explorePlans/${planId}`);
    return null;
  }
}
