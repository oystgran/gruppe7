<template>
    <div class="dashboard-screen">
      <div class="dashboard-content">
        <div class="left-panel">
          <DateNavigator v-model="myDate" />
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
          <MapComponent 
          :guests="filteredGuests"
          @rectangle-clicked="handleRectangleClicked" 
          style=" 
          transform: rotate(30deg);
          transform-origin: center;" />

        </div>
      </div>
    </div>
  </template>
  

<script>
import AddGuestModal from '@/components/AddGuestModal.vue';
import DateNavigator from '@/components/DateNavigator.vue';
import MapComponent from '@/components/MapComponent.vue';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/main.js';
import { ElButton } from 'element-plus';

export default {
  name: 'DashboardScreen',
  components: { ElButton, AddGuestModal, MapComponent, DateNavigator},
  data() {
    return {
      showAddGuestModal: false,
      selectedPlass: null,
      myDate: new Date(),
      guests: {}
    };
  },
  mounted(){
    this.loadGuests();
  },
  methods: {
    async loadGuests() {

      const latestQuery = query(
      collection(db, "Camping", "Gjester", "Gjester"),
      orderBy("Plass")
    );
    const snapshot = await getDocs(latestQuery);
    let guestsData = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      guestsData[data.Plass] = data;
    });
    this.guests = guestsData;
  },

    handleRectangleClicked(number) {
      this.selectedPlass = number;
      this.showAddGuestModal = true;
    },
    handleDateUpdate(newDate) {
      console.log("Selected Date:", newDate);
      // Logikk for å endre hva som vises basert på dato
    },
  },
  computed: {
  filteredGuests() {
    return Object.values(this.guests).filter(guest => {
      if (!guest.Innsjekk || !guest.Utsjekk) return false;
      const checkIn = guest.Innsjekk.toDate();
      const checkOut = guest.Utsjekk.toDate();
      return this.myDate >= checkIn && this.myDate <= checkOut;
    });
  }
}

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

.right-panel :deep(.guest-tooltip) {
  transform: rotate(-30deg);
  transform-origin: center;
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
  height: 100%;
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
