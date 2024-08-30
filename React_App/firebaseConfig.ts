// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA67lTsVthQK5Cz41MtcqM5ppxDkuGVCw",
  authDomain: "softwaredesign-project1.firebaseapp.com",
  projectId: "softwaredesign-project1",
  storageBucket: "softwaredesign-project1.appspot.com",
  messagingSenderId: "692181274891",
  appId: "1:692181274891:web:b0a78319ad44182f9f520e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
