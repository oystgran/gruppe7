import { createApp } from "vue";
import App from "./App.vue";
import router from "./tools/router.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
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
export const db = firebase.firestore();
console.log(firebase);

const app = createApp(App);
const pinia = createPinia();
app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.mount("#app");

import { useAuthStore } from "@/stores/auth.js";
auth.onAuthStateChanged(user => {
  const authStore = useAuthStore();
  authStore.setUser(user);
});