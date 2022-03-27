import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDf7D5LJ41-R7Xidx2xSMaFgThFeRATujA",
  authDomain: "deejam-80e56.firebaseapp.com",
  projectId: "deejam-80e56",
  storageBucket: "deejam-80e56.appspot.com",
  messagingSenderId: "81822298465",
  appId: "1:81822298465:web:875137479ac48ec1e9d520",
  measurementId: "G-S3T7JBJG7Y"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage};