import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

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

// Persistencia estricta de sesión: el token vive en sessionStorage.
// La sesión se mantiene al navegar (atrás/adelante, recargar) dentro de la misma
// pestaña y solo se cierra cuando el usuario cierra la pestaña o ventana.
if (typeof window !== "undefined") {
  setPersistence(auth, browserSessionPersistence).catch(() => {
    // ignore: ya hay una persistencia válida o el navegador la restringe
  });
}
