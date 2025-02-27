import { createApp } from 'vue';
import App from './App.vue';
import router from './tools/router.js';
import "./assets/styles.css";

const app = createApp(App);
app.use(router);
app.mount('#app');