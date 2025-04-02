<template>
    <div class="dashboard-screen">
      <div class="dashboard-content">
        <div class="left-panel">
          <DateNavigator v-model="myDate" />
          <h1>Dashboard</h1>
          <p>Campingboka</p>
          <el-button>I am ElButton</el-button>
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
    <component
      v-if="showModal"
      :is="modalComponent"
      :visible="showModal"
      :initialPlass="selectedPlass"
      v-bind="modalProps"
      @close="showModal = false"
      @guestAdded="reloadGuests"
      @guestUpdated="reloadGuests"
    />
    </div>
  </template>
  

  <script>
  import AddGuestModal from '@/components/AddGuestModal.vue';
  import UpdateGuestModal from '@/components/UpdateGuestModal.vue';
  import DateNavigator from '@/components/DateNavigator.vue';
  import MapComponent from '@/components/MapComponent.vue';
  import { collection, query, orderBy, getDocs } from 'firebase/firestore';
  import { db } from '@/main.js';
  import { ElButton } from 'element-plus';
  
  export default {
    name: 'DashboardScreen',
    components: { 
      ElButton, 
      AddGuestModal, 
      UpdateGuestModal, 
      MapComponent, 
      DateNavigator 
    },
    data() {
      return {
        showModal: false,       
        selectedPlass: null,
        myDate: new Date(),
        guests: {}            
      };
    },
    computed: {
      filteredGuests() {
        return Object.values(this.guests).filter(guest => {
          if (!guest.Innsjekk || !guest.Utsjekk) return false;
          const checkIn = guest.Innsjekk.toDate();
          const checkOut = guest.Utsjekk.toDate();
          return this.myDate >= checkIn && this.myDate <= checkOut;
        });
      },
      isOccupied() {
        return !!this.guests[this.selectedPlass];
      },
      modalComponent() {
        return this.isOccupied ? UpdateGuestModal : AddGuestModal;
      },
      modalProps() {
        return this.isOccupied ? { guest: this.guests[this.selectedPlass] } : {};
      }
    },
    mounted() {
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
        this.showModal = true;
      },
      reloadGuests() {
        this.loadGuests();
      },
      handleDateUpdate(newDate) {
        console.log("Selected Date:", newDate);
        // foreløpig tom
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
  left: 200px;
  top: 300px;
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