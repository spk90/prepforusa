
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpGTBcw9keuTxbp-XJD48QU5OorfgtbrU",
  authDomain: "f1visa-4ed4e.firebaseapp.com",
  projectId: "f1visa-4ed4e",
  storageBucket: "f1visa-4ed4e.firebasestorage.app",
  messagingSenderId: "117978896980",
  appId: "1:117978896980:web:92cf59b7906e952b6febc1",
  measurementId: "G-Z6TFCXF725"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
