// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_c4ASk1O4z2Mcplq8U5oTSusuzZOUFIA",
  authDomain: "makingprogress-b2fb2.firebaseapp.com",
  projectId: "makingprogress-b2fb2",
  storageBucket: "makingprogress-b2fb2.firebasestorage.app",
  messagingSenderId: "1073331046554",
  appId: "1:1073331046554:web:0c66b29c78a882fd04b723",
  measurementId: "G-NFXPNHR5ZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };