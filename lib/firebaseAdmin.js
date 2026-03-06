// lib/firebaseAdmin.js
// Expects env: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && rawPrivateKey) {
    const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
    if (!privateKey.includes("-----END PRIVATE KEY-----")) {
      throw new Error(
        "[firebaseAdmin] FIREBASE_PRIVATE_KEY is incomplete (missing -----END PRIVATE KEY-----). " +
          "Paste the full key from your service account JSON."
      );
    }
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
}

export const db = admin.firestore();