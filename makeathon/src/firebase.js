// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDMFI6eCzyQgJX06lgL53X1FvaFIHijpzQ",
  authDomain: "smart-cold-storage-controller.firebaseapp.com",
  databaseURL:
    "https://smart-cold-storage-controller-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-cold-storage-controller",
  storageBucket: "smart-cold-storage-controller.appspot.com",
  messagingSenderId: "133394667485",
  appId: "1:133394667485:web:07b601cf7c6911ce8e0834",
  measurementId: "G-BEP4PS71ED",
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase();
export const storage = getStorage();
export const auth = getAuth();
