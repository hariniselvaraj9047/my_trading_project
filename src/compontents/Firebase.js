import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_MY_API_KEY,
  authDomain: process.env.REACT_APP_MY_AUTHDOMAIN,
  projectId: process.env.REACT_APP_MY_PROJECTID,
  storageBucket: process.env.REACT_APP_MY_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MY_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_MY_APPID,
  measurementId: process.env.REACT_APP_MY_MEASUREMENTID,
};
 console.log( process.env.REACT_APP_MY_APPID)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, setDoc, getDoc, doc };