import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD7GanDk4FffdDTeOq5t4d8v9ei-eMYDiM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-z-ai-fitness-coach1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-z-ai-fitness-coach1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-z-ai-fitness-coach1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "523036471855",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:523036471855:web:2f50ebf52f32ab46264cda",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-T31NMFVLKQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
