<template>
    <div class="dashboard-screen">
      <div class="dashboard-content">
        <div class="left-panel">
          <DateNavigator v-model="myDate" />
          <!-- <p>Selected date: {{ myDate.toDateString() }}</p> -->
          <h1>Dashboard</h1>
          <p>Campingboka</p>
          <el-button>I am ElButton</el-button>

          <AddGuestModal
            :visible="showAddGuestModal"
            :initialPlass="selectedPlass"
            @close="showAddGuestModal = false"
          />
        </div>
  
        <div class="right-panel">
          <MapComponent @rectangle-clicked="handleRectangleClicked" style="width: 100%; height: 100%;" />
        </div>
      </div>
    </div>
  </template>
  

<script>
import AddGuestModal from '@/components/AddGuestModal.vue';
import DateNavigator from '@/components/DateNavigator.vue';
import MapComponent from '@/components/MapComponent.vue';
import { ElButton } from 'element-plus';

export default {
  name: 'ControlScreen',
  components: { ElButton, AddGuestModal, MapComponent, DateNavigator},
  data() {
    return {
      showAddGuestModal: false,
      selectedPlass: null,
      myDate: new Date(),
    };
  },
  methods: {
    handleRectangleClicked(number) {
      this.selectedPlass = number;
      this.showAddGuestModal = true;
    },
    handleDateUpdate(newDate) {
      console.log("Selected Date:", newDate);
      // Logikk for å endre hva som vises basert på dato
    },
  },
};
</script>

<style scoped>
.dashboard-screen {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  height: 100vh;
}

.dashboard-content {
  display: flex;
  width: 100%;
  height: 100%;
}

.left-panel {
  flex: 1;
  padding: 20px;
  text-align: center;
  align-self: flex-start;
}

.right-panel {
  flex: 1;
  display: flex;
  align-self: flex-start;
  justify-content: center;
  border-left: 1px solid #eee;
  overflow: hidden;
}

h1 {
  font-size: 2.5em;
  color: #4CAF50;
}

p {
  font-size: 1.2em;
  color: #555;
}
</style>
