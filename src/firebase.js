// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxj-uKTdNBUGntITBYMTSk6qyjPSgDZJ4",
  authDomain: "ecommerce-1593a.firebaseapp.com",
  projectId: "ecommerce-1593a",
  storageBucket: "ecommerce-1593a.firebasestorage.app",
  messagingSenderId: "1040163215112",
  appId: "1:1040163215112:web:e772d124affaaec320febd",
  measurementId: "G-3K61WJG2XM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
