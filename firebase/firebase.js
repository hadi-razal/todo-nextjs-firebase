import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyDyGkppNMgAaABEgWgewUYjp0HyWAw9_os",
    authDomain: "nextjs-todo-1ebad.firebaseapp.com",
    projectId: "nextjs-todo-1ebad",
    storageBucket: "nextjs-todo-1ebad.appspot.com",
    messagingSenderId: "806529555938",
    appId: "1:806529555938:web:8f988f44d06ae3a41badbb"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

