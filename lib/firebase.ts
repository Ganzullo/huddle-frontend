import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcX0Tfsj2NcFcXKY_ATXT7wg4PrKR4HWY",
  authDomain: "huddle-978d8.firebaseapp.com",
  projectId: "huddle-978d8",
  storageBucket: "huddle-978d8.firebasestorage.app",
  messagingSenderId: "979911057257",
  appId: "1:979911057257:web:0c8b9e5a7d2c3f1e4b8c9",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);