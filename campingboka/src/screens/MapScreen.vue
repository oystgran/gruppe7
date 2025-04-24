<template>
  <div class="map-screen">
    <div class="map-panel">
      <MapComponent
        :guests="filteredGuests"
        @rectangle-clicked="handleRectangleClicked"
        style="transform: rotate(-10deg); transform-origin: center"
      />
    </div>

    <GuestModal
      :visible="showAddGuestModal || showUpdateGuestModal"
      :mode="showAddGuestModal ? 'add' : 'edit'"
      :initialSpot="selectedSpot"
      :guest="updateGuestData"
      @close="closeModal"
      @guestSaved="reloadGuests"
    />

    <el-button type="primary" @click="openPosterModal">Show Poster</el-button>
    <div v-if="isPosterModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closePosterModal">&times;</span>
        <img :src="posterMap" alt="Map Poster" class="modal-image" />
      </div>
    </div>
  </div>
</template>

<script>
import posterMap from "@/assets/posterMap.png";
import MapComponent from "@/components/MapComponent.vue";
import GuestModal from "@/components/GuestModal.vue";
import { useStaysStore } from "@/stores/stays";

export default {
  name: "MapScreen",
  components: { MapComponent, GuestModal },
  setup() {
    const store = useStaysStore();
    return { store };
  },
  data() {
    return {
      posterMap,
      isPosterModalOpen: false,
      showAddGuestModal: false,
      showUpdateGuestModal: false,
      selectedSpot: null,
      myDate: new Date(),
      guests: {},
      updateGuestData: null,
    };
  },
  computed: {
    filteredGuests() {
      const result = {};
      Object.keys(this.guests).forEach((spot) => {
        const guest = this.guests[spot];
        const checkIn = new Date(guest.check_in);
        const checkOut = new Date(guest.check_out);
        if (this.myDate >= checkIn && this.myDate <= checkOut) {
          result[spot] = guest;
        }
      });
      return result;
    },
  },
  watch: {
    myDate() {
      this.store.loadGuests();
    },
  },
  methods: {
    handleRectangleClicked(spot) {
      this.selectedSpot = Number(spot);
      const guest = this.store.bookingsToday[this.selectedSpot];

      if (guest) {
        this.updateGuestData = {
          name: guest.name,
          license_plate: guest.license_plate,
          nationality: guest.nationality,
          price: guest.price,
          spotId: this.selectedSpot,
          check_in: guest.check_in,
          check_out: guest.check_out,
          adults: guest.adults,
          children: guest.children,
          electricity: guest.electricity,
          stayId: guest.id,
          guestId: guest.guestId,
        };
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
      this.selectedSpot = null;
      this.updateGuestData = null;
    },
    reloadGuests() {
      this.store.loadGuests();
    },
    openPosterModal() {
      this.isPosterModalOpen = true;
    },
    closePosterModal() {
      this.isPosterModalOpen = false;
    },
  },
};
</script>

<style>
.map-screen {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-panel {
  position: relative;
  z-index: 10;
}

.map-panel {
  position: relative;
  z-index: 1;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal-content {
  background: white;
  padding: 10px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  text-align: center;
}

.modal-image {
  width: 100%;
  max-width: 700px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 34px;
  font-weight: bold;
  cursor: pointer;
  padding: 8px 10px;
  color: black;
}

.close:hover {
  color: red;
}

.map-screen .guest-tooltip {
  transform: rotate(10deg) !important;
  transform-origin: center !important;
  left: auto !important;
  top: auto !important;
}
</style>
