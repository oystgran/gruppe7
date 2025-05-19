/*
  auth.js (Pinia store)
  --------------------------------------------------
  Store for managing authentication state:
    • signIn(): Signs in user with Firebase Auth and sets `user`.
    • signOut(): Logs out the current user and resets state.
    • setUser(): Updates the user and sets loading to false (e.g. onAuthStateChanged).
    • State includes: current user object and loading status.
    • Getter `isLoggedIn` returns true if a user is signed in.
    • Used to protect routes and access user-specific features in the app.
*/
import { defineStore } from "pinia";
import { auth } from "@/tools/firebase.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: true,
  }),
  actions: {
    async signIn(email, password) {
      try {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        this.user = cred.user;
        return cred.user;
      } finally {
        this.loading = false;
      }
    },
    async signOut() {
      await auth.signOut();
      this.user = null;
    },
    setUser(u) {
      this.user = u;
      this.loading = false;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});
