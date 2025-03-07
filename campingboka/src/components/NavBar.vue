<template>
    <el-menu
      :default-active="$route.path"
      class="custom-nav"
      mode="horizontal"
      background-color="#394856"
      text-color="#fff"
      active-text-color="#333"
      router
      :ellipsis="false"
      

    >
      <el-menu-item index="/">Dashboard</el-menu-item>
      <el-menu-item index="/book">Book</el-menu-item>
      <el-menu-item index="/map">Kart</el-menu-item>
      <el-menu-item index="/archive">Arkiv</el-menu-item>


      <el-sub-menu index="/tools" ref="toolsMenu">
      <template #title>Verktøy</template>
      <el-menu-item index="/control">Kontroll</el-menu-item>
      <el-menu-item index="/boatRental">Båtutleie</el-menu-item>
      <el-menu-item index="/weather">Været</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>



<script>
export default {
  name: "NavBar",

  methods: {

    setDropdownPosition() {
    this.$nextTick(() => {
      const submenu = this.$refs.toolsMenu?.$el;
      const dropdown = document.querySelector('.el-menu--horizontal > .el-menu--popup');
      if (submenu && dropdown) {
        const submenuRect = submenu.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.left = `${submenuRect.left + window.scrollX}px`;
        dropdown.style.top = `${submenuRect.bottom + window.scrollY}px`;
        dropdown.style.width = `${submenuRect.width}px`;
        
        dropdown.style.margin = '0';
        dropdown.style.padding = '0';
        dropdown.style.transform = 'none';
      }
    });
  }
},

  mounted() {
    window.addEventListener('resize', this.setDropdownPosition);
    window.addEventListener('scroll', this.setDropdownPosition);
    this.setDropdownPosition();
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.setDropdownPosition);
    window.removeEventListener('scroll', this.setDropdownPosition);
  }
};
</script>

<style>
.custom-nav {
  height: 50px;
  display: flex;
  width: 100%;
  padding: 0;
  margin: 0;
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif  !important;
  font-weight: bold !important;
  color: #ffffff !important;
}

.custom-nav::after {
  content: none;
}

.custom-nav .el-menu-item,
.custom-nav .el-sub-menu,
.custom-nav .el-sub-menu__title {
  flex: 1;
  margin: 0 !important;
  text-align: center;
  line-height: 50px;
  font-weight: bolder;
  border-radius: 7px 7px 0 0;
}

/* Override ELement Plus styles*/
body .el-menu--horizontal .el-menu--popup .el-menu-item {
  font-family: Avenir, Helvetica, Arial, sans-serif  !important;
  color: #ffffff !important;
  font-weight: bold !important;
  text-align: center;
  justify-content: center;
  height: 50px !important;
  line-height: 50px !important;
}

/* Override ELement Plus styles*/
body .el-menu--horizontal .el-menu--popup {
  position: absolute !important;
  margin: 0 !important;
  padding: 0 !important;
  top: -8px !important; 
  left: 0 !important;
  transform: none !important;
  overflow: hidden;
  border-radius: 0 0 7px 7px;
}

.custom-nav .el-sub-menu__title {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover */
.custom-nav .el-menu-item:hover,
.custom-nav .el-sub-menu:hover {
  background-color: #252f38;
}

/* Active */
.custom-nav .el-menu-item.is-active,
.custom-nav .el-sub-menu.is-active {
  background-color: white !important;
  color: #333 !important;
  border-bottom: none !important;
  margin-bottom: 0;
}

</style> 