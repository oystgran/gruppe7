import { createApp } from 'vue';
import App from './App.vue';
import router from './tools/router.js';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import firebase from 'firebase/compat/app';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxCKeN-Ajc-HEqfukqs8a2nh7rYzi0GIQ",
    authDomain: "campingboka-baa2f.firebaseapp.com",
    projectId: "campingboka-baa2f",
    storageBucket: "campingboka-baa2f.firebasestorage.app",
    messagingSenderId: "663902017379",
    appId: "1:663902017379:web:e30372e9e45bdbdd9ba556"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase);

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount('#app');