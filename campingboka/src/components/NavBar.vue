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
    <el-menu-item index="/">Dashboard</el-menu-item>
    <el-menu-item index="/book">Book</el-menu-item>
    <el-menu-item index="/map">Kart</el-menu-item>
    <el-menu-item index="/archive">Arkiv</el-menu-item>

    <el-sub-menu index="/tools" :class="{ 'is-active': isVerktoyActive }">
      <template #title>Verktøy</template>
      <el-menu-item index="/control">Kontroll</el-menu-item>
      <el-menu-item index="/boatRental">Båtutleie</el-menu-item>
      <el-menu-item index="/weather">Været</el-menu-item>
    </el-sub-menu>
    <div class="date-navigator-wrapper">
      <DateNavigator v-model="selectedDate" />
    </div>
  </el-menu>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import DateNavigator from "./DateNavigator.vue";
import { useStaysStore } from "@/stores/stays";
import { useRoute } from "vue-router";
import { debounce } from "lodash";
const store = useStaysStore();
const selectedDate = store.selectedDate;
const isVerktoyActive = computed(() => {
  return ["/control", "/boatRental", "/weather"].includes(useRoute.path);
});
console.log(store);
watch(
  selectedDate,
  debounce(() => {
    console.log("selectedDate: ");
    console.log(selectedDate);
    store.loadGuests(selectedDate);
  }, 300)
);
store.loadGuests(selectedDate);
</script>

<style scoped>
.nav-bar {
  background-color: #394856;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  border: none;
  width: auto;
}

/* Menu Items */
.nav-bar .el-menu-item,
.nav-bar .el-sub-menu__title {
  padding: 0 15px;
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

/* Dropdown menu */
.el-menu--horizontal .el-menu--popup {
  background-color: #394856;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
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
</style>
