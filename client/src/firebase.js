//Google ile hesap oluşturabilmek için "firebase google'dan" oluşturduğum apinin kodları.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-70c5f.firebaseapp.com",
  projectId: "mern-estate-70c5f",
  storageBucket: "mern-estate-70c5f.appspot.com",
  messagingSenderId: "80726800689",
  appId: "1:80726800689:web:04929476dc804310bf5810",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
