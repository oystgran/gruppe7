// tools/firebaseToken.js
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
