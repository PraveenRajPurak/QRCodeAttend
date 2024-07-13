// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const userfirebaseConfig = {
  apiKey: "AIzaSyBsAsAOGoTa4V32V9E7JsAkDXcA-WEih0U",
  authDomain: "qrcodeattend-user.firebaseapp.com",
  projectId: "qrcodeattend-user",
  storageBucket: "qrcodeattend-user.appspot.com",
  messagingSenderId: "52406241291",
  appId: "1:52406241291:web:4beb7307b8483b7f489f0e",
  measurementId: "G-QZ67MB5E0X"
};

// Initialize Firebase
const UserFirebaseapp = initializeApp(userfirebaseConfig, "UserFirebaseapp");

export {UserFirebaseapp};