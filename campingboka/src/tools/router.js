import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore }                  from "@/stores/auth";
import BookScreen from '@/screens/BookScreen.vue';
import MapScreen from '@/screens/MapScreen.vue';
import ControlScreen from '@/screens/ControlScreen.vue';
import BoatRentalScreen from '@/screens/BoatRentalScreen.vue';
import WeatherScreen from '@/screens/WeatherScreen.vue';
import DashboardScreen from '@/screens/DashboardScreen.vue';
import ArchiveScreen from '@/screens/ArchiveScreen.vue';
import LoginScreen from '@/screens/LoginScreen.vue';

const routes = [
  { path: '/', name:"Dashboard", component: DashboardScreen, meta: { requiresAuth: true } },
  { path: "/login", name:"Login", component: LoginScreen, meta: { requiresAuth: false } },
  { path: '/book', name:"Books",component: BookScreen , meta: { requiresAuth: true }},
  { path: '/map', name:"Map" ,component: MapScreen, meta: { requiresAuth: true } },
  { path: '/archive', name:"Archive", component: ArchiveScreen, meta: { requiresAuth: true } },
  { path: '/control', name:"Control", component: ControlScreen, meta: { requiresAuth: true } },
  { path: '/boatRental', name:"BoatRental", component: BoatRentalScreen, meta: { requiresAuth: true } },
  { path: '/weather', name:"Weather", component: WeatherScreen, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (auth.loading) {
    const unwatch = auth.$subscribe((mutation, state) => {
      if (!state.loading) {
        unwatch();
        proceed();
      }
    });
  } else {
    proceed();
  }
  function proceed() {
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return next({ name: "Login", query: { redirect: to.fullPath } });
    } else {
      next();
    }
  }
});

export default router;