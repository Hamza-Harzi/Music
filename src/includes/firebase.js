import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// storage li bich t5asen fih l7ajetli 3maltelh upload w t3aytelha fi upload component
const firebaseConfig = {
  apiKey: "AIzaSyAgnHI8cIIDGwRWbriEnX1lY8fVXj2oy2k",
  authDomain: "music-b2ecc.firebaseapp.com",
  projectId: "music-b2ecc",
  storageBucket: "music-b2ecc.appspot.com",
  appId: "1:442328620924:web:349f590a5465940bed8ef9",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
}); //the enable persistence function will tell Firebase to keep a copy of the database on the user's browser if the user disconnects from the internet the SDK we will switch to using the local copy of the user's machine

const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  storage,
  commentsCollection,
};
