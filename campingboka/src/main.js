/*
  main.js
  --------------------------------------------------
  Main entry point for the Vue 3 app:
    • Initializes Firebase using the legacy compat SDK — used only for authentication.
    • Creates the Vue application and sets up:
        – Vue Router for navigation between pages.
        – Pinia for global state management (auth, stays, etc.).
        – Element Plus as the UI framework.
    • Mounts the app to the DOM (#app).
    • Listens to Firebase auth state changes and updates the Pinia auth store.

  About Firebase config and security:
    • The Firebase config object (including `apiKey`) is included directly in this file.
    • This is safe and intended — the `apiKey` is **not a secret**.
    • It is used to identify the Firebase project in client-side code.
    • Firebase ensures that all sensitive operations (e.g. reading data, signing in) are
      protected by security rules and authentication, not just the API key.
    • In this project, only Firebase Authentication is used — Firestore and other services
      have been removed or disabled.

      src: https://firebase.google.com/support/guides/security-checklist#understand-api-keys
*/
import { createApp } from "vue";
import App from "./App.vue";
import router from "./tools/router.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { createPinia } from "pinia";
import { auth } from "./tools/firebase.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxCKeN-Ajc-HEqfukqs8a2nh7rYzi0GIQ",
  authDomain: "campingboka-baa2f.firebaseapp.com",
  projectId: "campingboka-baa2f",
  storageBucket: "campingboka-baa2f.firebasestorage.app",
  messagingSenderId: "663902017379",
  appId: "1:663902017379:web:e30372e9e45bdbdd9ba556",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase);

const app = createApp(App);
const pinia = createPinia();
app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.mount("#app");

import { useAuthStore } from "@/stores/auth.js";
auth.onAuthStateChanged((user) => {
  const authStore = useAuthStore();
  authStore.setUser(user);
});
