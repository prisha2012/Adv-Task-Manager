import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc011tsrNEVz162dc-e_K2lveIw-wdx3s",
  authDomain: "task-manager-efb5b.firebaseapp.com",
  projectId: "task-manager-efb5b",
  storageBucket: "task-manager-efb5b.appspot.com",
  messagingSenderId: "1073959238572",
  appId: "1:1073959238572:web:d8d936a03144705c849809",
  measurementId: "G-LT5Z9SSW7C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);