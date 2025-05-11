// backend/tools/firebaseAdmin.js
const admin = require("firebase-admin");

// Hvis du bruker .env + GOOGLE_APPLICATION_CREDENTIALS:
// admin.initializeApp();

admin.initializeApp({
  credential: admin.credential.applicationDefault(), // eller bruk .cert() og en .json-fil
});

module.exports = admin;
