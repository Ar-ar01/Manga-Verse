import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9QadDhlptsu1PoKRSmRxPJKl8r0LNVfQ",
  authDomain: "bookstore-59a4b.firebaseapp.com",
  projectId: "bookstore-59a4b",
  storageBucket: "bookstore-59a4b.appspot.com",
  messagingSenderId: "438690982962",
  appId: "1:438690982962:web:528af292abecbc5afba02b",
  measurementId: "G-4LD0K5MXCR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication

export { auth };

