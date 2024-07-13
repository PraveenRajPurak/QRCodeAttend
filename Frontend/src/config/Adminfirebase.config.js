// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const adminfirebaseConfig = {
  apiKey: "AIzaSyC6aPj4ncUBDNlJrrdo-rrMWQpmCuk1Mqs",
  authDomain: "qrcodeattend-admin.firebaseapp.com",
  projectId: "qrcodeattend-admin",
  storageBucket: "qrcodeattend-admin.appspot.com",
  messagingSenderId: "214111371011",
  appId: "1:214111371011:web:b904865f3cf5063bb0f336",
  measurementId: "G-RJL4T0831D"
};

// Initialize Firebase
const AdminFirebaseApp = initializeApp(adminfirebaseConfig, "AdminFirebaseApp");
export {AdminFirebaseApp};