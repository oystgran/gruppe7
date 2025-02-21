<template>
  <div id="app">
  <NavBar />
  <router-view />
</div>

</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #E9E9E9;
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
