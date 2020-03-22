import firebase from '../../node_modules/@firebase/app';
import '../../node_modules/@firebase/auth';

var config = {
  apiKey: "AIzaSyBrJbhxONYQDprXw-kqmzHUEWl83e89Ky0",
  authDomain: "screamer-app.firebaseapp.com",
  databaseURL: "https://screamer-app.firebaseio.com",
  projectId: "screamer-app",
  storageBucket: "screamer-app.appspot.com",
  messagingSenderId: "215139518869",
  appId: "1:215139518869:web:f0ca47413af624c26e0e9c",
  measurementId: "G-LP0HYFSR1Y"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export { auth };
