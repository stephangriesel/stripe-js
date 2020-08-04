import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyBUStwVZRStOBl2ZRZ_O1Ze-BFnj2NENBQ",
    authDomain: "stripe-js.firebaseapp.com",
    databaseURL: "https://stripe-js.firebaseio.com",
    projectId: "stripe-js",
    storageBucket: "stripe-js.appspot.com",
    messagingSenderId: "851900051481",
    appId: "1:851900051481:web:f7f0d974c38304c865ba88",
    measurementId: "G-FJ2N39YDK0"
};

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();
export const auth = firebase.auth();