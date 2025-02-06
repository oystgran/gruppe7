import { createRouter, createWebHistory } from 'vue-router';
import HomeScreen from '../screens/HomeScreen.vue';
import MapScreen from '../screens/MapScreen.vue';

const routes = [
  { path: '/', component: HomeScreen },
  { path: '/map', component: MapScreen },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;