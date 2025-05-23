// // lib/firebaseClient.js
// import { initializeApp } from "firebase/app";
// import { getFirestore   } from "firebase/firestore";

// const app = initializeApp({
//   apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// });

// export const db = getFirestore(app);

// lib/firebaseClient.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. Define your Firebase config object
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 2. Initialize the Firebase app using the config object
const app = initializeApp(firebaseConfig);

// 3. Export your database instance (this is fine as a named export)
export const db = getFirestore(app);

// 4. Export the firebaseConfig object as the default export
export default firebaseConfig;