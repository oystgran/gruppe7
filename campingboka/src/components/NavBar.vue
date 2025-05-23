<!--
  NavBar.vue
  --------------------------------------------------
  Main navigation bar component for the application:
    • Displays "Book", "Map", and "Archive" menu items with active-route highlighting.
    • Includes a DateNavigator for selecting dates and debounced loading of guests.
    • Handles user logout and navigation.
    • Responsive: hides most menu items under (phone screen) 600px width, showing only "Book" and "Logout".
-->
<template>
  <el-menu
    :default-active="$route.path"
    class="nav-bar"
    mode="horizontal"
    background-color="#394856"
    text-color="#fff"
    active-text-color="white"
    router
    :ellipsis="false"
  >
    <el-menu-item index="/" class="book-menu-item">Book</el-menu-item>
    <el-menu-item index="/map">Map</el-menu-item>
    <el-menu-item index="/archive">Archive</el-menu-item>

    <el-menu-item
      v-if="auth.isLoggedIn"
      @click="logout"
      class="logout-menu-item"
    >
      Log out
    </el-menu-item>
    <div class="date-navigator-wrapper">
      <DateNavigator v-model="selectedDate" />
    </div>
  </el-menu>
</template>

<script setup>
import { computed, watch } from "vue";
import DateNavigator from "./DateNavigator.vue";
import { useStaysStore } from "@/stores/stays";
import { useRouter } from "vue-router";
import { debounce } from "lodash";
import { useDateStore } from "@/stores/dateStore";
import { useAuthStore } from "@/stores/auth";

const store = useStaysStore();
const dateStore = useDateStore();
const auth = useAuthStore();
const router = useRouter();
const selectedDate = computed({
  get: () => dateStore.selectedDate,
  set: (val) => dateStore.setDate(val),
});

console.log(store);
const debouncedLoadGuests = debounce(() => {
  console.log("selectedDate:", selectedDate.value);
  store.loadGuests(selectedDate.value);
}, 1000);

watch(selectedDate, () => {
  debouncedLoadGuests();
});

function logout() {
  auth.signOut();
  router.push({ name: "Login" });
}
</script>

<style scoped>
.nav-bar {
  background-color: #394856;
  padding: 0 clamp(10px, 2vw, 20px) 0 0;
  height: clamp(40px, 8vh, 60px);
  line-height: clamp(40px, 8vh, 60px);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-bar .el-menu-item,
.nav-bar .el-sub-menu__title {
  padding: 0 clamp(8px, 1.5vw, 15px);
  font-size: clamp(14px, 1.5vw, 18px);
}

/* Hover */
.nav-bar .el-menu-item:hover,
.nav-bar .el-sub-menu__title:hover {
  background-color: #2e3a46;
}

/* Active */
.nav-bar .el-menu-item.is-active,
.nav-bar .el-sub-menu.is-active .el-sub-menu__title {
  background-color: white !important;
  color: #333 !important;
}

.el-menu--popup .el-menu-item.is-active {
  background-color: #2e3a46 !important;
  color: white !important;
}

.el-menu--horizontal .el-menu--popup .el-menu-item {
  color: #fff;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: lighter;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
}

.el-menu--horizontal .el-menu--popup .el-menu-item:hover {
  background-color: #2e3a46;
}
.date-navigator-wrapper {
  margin-left: auto;
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.logout-menu-item {
  color: rgb(255, 73, 73) !important;
  font-size: clamp(14px, 1.5vw, 18px);
}
@media (max-width: 600px) {
  .nav-bar .el-menu-item {
    display: none !important;
  }
  .nav-bar .book-menu-item,
  .nav-bar .logout-menu-item {
    display: inline-flex !important;
  }

  .date-navigator-wrapper {
    display: flex !important;
    margin-left: auto;
    margin-right: 10px;
    align-items: center;
  }
}
</style>
