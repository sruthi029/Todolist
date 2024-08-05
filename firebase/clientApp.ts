// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.SB,
  messagingSenderId: process.env.MID,
  appId: process.env.APPID,
  measurementId: process.env.MEASID
};
const app =getApps().length?getApp():initializeApp(firebaseConfig);
const db=getFirestore(app)
export {db}