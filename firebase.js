import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNWKjlUlVfaAi7CAAL_poVfI9UjbldfGs",
  authDomain: "signal-clone-d3c75.firebaseapp.com",
  projectId: "signal-clone-d3c75",
  storageBucket: "signal-clone-d3c75.appspot.com",
  messagingSenderId: "1055349531566",
  appId: "1:1055349531566:web:b2ffa8b95e82c4f702de3f",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
