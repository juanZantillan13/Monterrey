// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8Q8CmAtpKKi_x0VT3m5tG4mnqPd6nqfw",
  authDomain: "agua-mty.firebaseapp.com",
  databaseURL: "https://agua-mty-default-rtdb.firebaseio.com",
  projectId: "agua-mty",
  storageBucket: "agua-mty.firebasestorage.app",
  messagingSenderId: "695127151741",
  appId: "1:695127151741:web:ebdee1622a3439dcb68d14",
  measurementId: "G-5PKF86HZ96"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth, signInWithEmailAndPassword, signOut };