import { getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, EmailAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzHSZId5eUKLt0htmiALtyGF2Z_eo5sMU",
  authDomain: "vorsto-a421c.firebaseapp.com",
  projectId: "vorsto-a421c",
  storageBucket: "vorsto-a421c.appspot.com",
  messagingSenderId: "680416294727",
  appId: "1:680416294727:web:8435c6435198f4ec71fe62",
  measurementId: "G-XWDTZ052ZT"
};

// Initialize Firebase
let app = null;
if (!app) {
  try {
    app = getApp("vorsto");
  } catch (error) {
    app = initializeApp(firebaseConfig,
        "vorsto"
    );
  }
}

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider(); 
const githubProvider = new GithubAuthProvider();
const emailProvider = new EmailAuthProvider(); 
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, githubProvider, emailProvider, facebookProvider };
