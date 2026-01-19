
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBAk91MIoqSx6ti9Mf0RKMkX6My4P2nlzU",
    authDomain: "nandanatea-3d398.firebaseapp.com",
    projectId: "nandanatea-3d398",
    storageBucket: "nandanatea-3d398.firebasestorage.app",
    messagingSenderId: "518052125983",
    appId: "1:518052125983:web:bdb9d7dbaabbfdf539a42a",
    measurementId: "G-XL77KKMFDK"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, db, auth, storage, analytics };
