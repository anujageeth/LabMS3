const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "labms-d87c3.appspot.com", // Replace with your Firebase project ID
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
