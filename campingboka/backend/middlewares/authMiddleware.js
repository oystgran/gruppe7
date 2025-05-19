/*
  middlewares/authMiddleware.js
  --------------------------------------------------
  Express middleware to verify Firebase ID tokens:
    • Initializes Firebase Admin SDK using a service account.
    • Extracts and validates Bearer token from Authorization header.
    • Attaches decoded user info to `req.user` if valid.
    • Returns 401 error if token is missing, invalid, or expired.
*/
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // legg til brukerinfo i req
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = verifyFirebaseToken;
