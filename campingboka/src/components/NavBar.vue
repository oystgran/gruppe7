<template>
    <el-menu
      :default-active="$route.path"
      class="custom-nav"
      mode="horizontal"
      background-color="#394856"
      text-color="#fff"
      active-text-color="#333"
      router
    >
      <el-menu-item index="/">Dashboard</el-menu-item>
      <el-menu-item index="/book">Book</el-menu-item>
      <el-menu-item index="/map">Kart</el-menu-item>
      <el-menu-item index="/control">Kontroll</el-menu-item>
      <el-menu-item index="/boatRental">Båtutleie</el-menu-item>
      <el-menu-item index="/weather">Været</el-menu-item>
    </el-menu>
  </template>


<script>
    export default{name: 'NavBar'}
</script>


<style>
.custom-nav {
  height: 50px;
  display: flex;
  width: 100%;
  padding: 0;
  margin: 0;
  position: relative;
}

.custom-nav::after {
  content: none;
}

.custom-nav .el-menu-item {
  flex: 1 0 auto;
  margin: 0 !important;
  padding: 0 15px;
  text-align: center;
  line-height: 50px;
  font-weight: bold;
  border-radius: 7px 7px 0 0;
}

.custom-nav .el-menu-item:hover {
  background-color: #252f38;
}

.custom-nav .el-menu-item.is-active {
  background-color: white !important;
  color: #333 !important;
  border-bottom: none !important;
  margin-bottom: 0;
}
</style>