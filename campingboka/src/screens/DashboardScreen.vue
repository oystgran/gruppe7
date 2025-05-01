<template>
  <div class="dashboard-screen">
    <div class="dashboard-content">
      <div class="left-panel">
        <DateNavigator v-model="myDate" />
        <h1>Geirangerfjorden Feriesenter</h1>
        <div class="weather-card-container">
            <iframe 
                src="https://www.yr.no/en/content/1-177457/card.html" 
                title="Yr Weather Card"
                class="weather-card"
                frameborder="0"
                loading="eager"
                >
            </iframe>
        </div>

      </div>
      <div class="right-panel">
        <MapComponent 
          :guests="filteredGuests"
          @rectangle-clicked="handleRectangleClicked"
          style="transform: rotate(30deg); transform-origin: center;"
        />
      </div>
    </div>
    <GuestModal
      :visible="showAddGuestModal || showUpdateGuestModal"
      :mode="showAddGuestModal ? 'add' : 'edit'"
      :initialPlass="selectedPlass"
      :guest="updateGuestData"
      @close="closeModal"
      @guestSaved="reloadGuests"
    />
  </div>
</template>

<script>
import DateNavigator from '@/components/DateNavigator.vue';
import MapComponent from '@/components/MapComponent.vue';
import GuestModal from '@/components/GuestModal.vue';

export default {
  name: 'DashboardScreen',
  components: { DateNavigator, MapComponent, GuestModal },
  data() {
    return {
      showAddGuestModal: false,
      showUpdateGuestModal: false,
      selectedPlass: null,
      updateGuestData: null,
      myDate: new Date(),
      guests: {}
    };
  },
  
  methods: {
    handleRectangleClicked(plass) {
      this.selectedPlass = Number(plass);
      if (this.guests[this.selectedPlass]) {

        this.updateGuestData = this.guests[this.selectedPlass];
        this.showUpdateGuestModal = true;
        this.showAddGuestModal = false;
      } else {

        this.updateGuestData = null;
        this.showAddGuestModal = true;
        this.showUpdateGuestModal = false;
      }
    },
    closeModal() {
      this.showAddGuestModal = false;
      this.showUpdateGuestModal = false;
      this.selectedPlass = null;
      this.updateGuestData = null;
    },
    
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
.dashboard-content {
  display: flex;
  width: 100%;
  height: 100%;
}
.left-panel {
  flex: 1;
  padding: 20px;
  text-align: center;
}
.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  border-left: 1px solid #eee;
  height: 100%;
  overflow: hidden;
}

.weather-card-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;}

::v-deep .guest-tooltip {
  transform: rotate(-30deg) !important;
  transform-origin: center !important;
  left: 50px !important;
  top: 350px !important;
}
</style>