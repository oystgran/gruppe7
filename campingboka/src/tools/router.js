import { createRouter, createWebHistory } from 'vue-router';
import HomeScreen from '@/screens/HomeScreen.vue';
import MapScreen from '@/screens/MapScreen.vue';
import ControlScreen from '@/screens/ControlScreen.vue';
import BoatRentalScreen from '@/screens/BoatRentalScreen.vue';
import WeatherScreen from '@/screens/WeatherScreen.vue';

const routes = [
  { path: '/', component: HomeScreen },
  { path: '/map', component: MapScreen },
  { path: '/control', component: ControlScreen },
  { path: '/boatRental', component: BoatRentalScreen },
  { path: '/weather', component: WeatherScreen },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;