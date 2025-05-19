/*
  firebaseToken.js
  --------------------------------------------------
  Utility for retrieving Firebase ID token as Authorization header:
    • Uses Firebase Authentication to get the current user's ID token.
    • Throws an error if no user is logged in.
    • Returns headers object with Bearer token and JSON content type.
    • Used to authenticate API requests from frontend to backend.
*/
import { getAuth } from "firebase/auth";

export async function getIdTokenHeader() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Brukeren er ikke innlogget");

  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
