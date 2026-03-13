import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD7GanDk4FffdDTeOq5t4d8v9ei-eMYDiM",
  authDomain: "gen-z-ai-fitness-coach1.firebaseapp.com",
  projectId: "gen-z-ai-fitness-coach1",
  storageBucket: "gen-z-ai-fitness-coach1.firebasestorage.app",
  messagingSenderId: "523036471855",
  appId: "1:523036471855:web:2f50ebf52f32ab46264cda",
  measurementId: "G-T31NMFVLKQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
