/*
  tools/firebaseAdmin.js
  --------------------------------------------------
  Initializes Firebase Admin SDK:
    • Uses application default credentials (ADC) to verify ID tokens.
    • Required for server-side authentication checks (e.g. in middleware).
    • Used in authMiddleware.js to validate incoming requests.
*/
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

module.exports = admin;
