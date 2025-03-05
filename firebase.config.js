// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3RhVRKm6zr1MShxIdL8I9YiqJttgBtsc",
  authDomain: "e-group-d04ff.firebaseapp.com",
  projectId: "e-group-d04ff",
  storageBucket: "e-group-d04ff.firebasestorage.app",
  messagingSenderId: "360705188152",
  appId: "1:360705188152:web:e7d7c4f6d1f5bb26b521cd",
  measurementId: "G-QC42FCLKZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);