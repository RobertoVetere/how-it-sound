// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD8tssVy1WU1_xn4baFblmJqA3Xd3_Ggg",
  authDomain: "photosong-4582e.firebaseapp.com",
  projectId: "photosong-4582e",
  storageBucket: "photosong-4582e.appspot.com",
  messagingSenderId: "18310628053",
  appId: "1:18310628053:web:9b5849e96d1436b6ca985c",
  measurementId: "G-1G6ZN21TX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };