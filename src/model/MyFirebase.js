import { initializeApp } from "firebase/app";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from "firebase/auth"

function MyFirebase(){

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDshBjYuowOnMmWDDMaG0PObKBIjirBXvA",
        authDomain: "eda-board.firebaseapp.com",
        projectId: "eda-board",
        storageBucket: "eda-board.appspot.com",
        messagingSenderId: "141278240845",
        appId: "1:141278240845:web:d382e18dfa0c2757cb3c04"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication and get a reference to the service
    const auth = getAuth(app);

    // Initialize Cloud Firestore and get a reference to the service
    // const db = getFirestore(app);

    const me = {};

    me.signIn = async(email, password) => {


        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential);
        }).catch((error) => {
            console.log(error);
        })

    }

    me.signUp = async(email, password) => {

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential);
        }).catch((error) => {
            console.log(error);
        })

    }

    return me;
    
}

export const myFirebase = new MyFirebase();


