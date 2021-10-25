import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics"

const firebaseConfig = {
    // apiKey: "AIzaSyCSl6umMzO_KuVpSvltljlSn0RZXF55Uqg",
    // authDomain: "hana-cbdc.firebaseapp.com",
    // projectId: "hana-cbdc",
    // storageBucket: "hana-cbdc.appspot.com",
    // messagingSenderId: "783782723412",
    // appId: "1:783782723412:web:5ef3d75feff4709196d2c1",
    // measurementId: "G-71S4Y5PH75"
    apiKey: "AIzaSyAosfEbUKtEIb20RZSJGPvKEmSnSoIWVH4",
    authDomain: "hana-cbdc2.firebaseapp.com",
    projectId: "hana-cbdc2",
   storageBucket: "hana-cbdc2.appspot.com",
    messagingSenderId: "342269223222",
   appId: "1:342269223222:web:6c367ce8e24320a2045397",
   measurementId: "G-6KCXMHTMC3"
  };


firebase.initializeApp(firebaseConfig);


export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();
export const analyticService = firebase.analytics();