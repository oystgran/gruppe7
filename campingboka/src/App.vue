<template>
  <div id="app">
    <NavBar v-if="isLoggedIn" />
    <router-view />
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: white;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #394856;
}
</style>
