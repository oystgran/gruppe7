<!--
  MapScreen.vue
  --------------------------------------------------
  Screen for managing and viewing camping spot bookings:
    • Displays the MapComponent with rotated SVG of spots and filtered guest data.
    • Computes `filteredGuests` to show only guests active on the selected date.
    • Handles spot clicks: opens GuestModal in add or edit mode based on booking existence.
    • Passes initial spot ID, guest data, and selected date to GuestModal.
    • Refreshes guest list on save and resets state on modal close.
-->
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
      :key="selectedSpot + '-' + (showAddGuestModal ? 'add' : 'edit')"
      :visible="showAddGuestModal || showUpdateGuestModal"
      :mode="showAddGuestModal ? 'add' : 'edit'"
      :initialSpotId="selectedSpot"
      :guest="updateGuestData"
      :selectedDate="dateStore.selectedDate"
      @close="closeModal"
      @guestSaved="refreshGuestList"
    />
  </div>
</template>

<script>
import MapComponent from "@/components/MapComponent.vue";
import GuestModal from "@/components/GuestModal.vue";
import { useStaysStore } from "@/stores/stays";
import { useDateStore } from "@/stores/dateStore";
import { isGuestActiveOnDate } from "@/utils/dateUtils";

export default {
  name: "MapScreen",
  components: { MapComponent, GuestModal },
  setup() {
    const store = useStaysStore();
    const dateStore = useDateStore();
    return { store, dateStore };
  },
  data() {
    return {
      showAddGuestModal: false,
      showUpdateGuestModal: false,
      selectedSpot: null,
      updateGuestData: null,
    };
  },
  computed: {
    filteredGuests() {
      const result = {};
      Object.keys(this.store.bookingsToday).forEach((spot) => {
        const guest = this.store.bookingsToday[spot];
        if (isGuestActiveOnDate(guest, this.dateStore.selectedDate)) {
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
      const guest = this.store.bookingsToday[String(this.selectedSpot)];

      if (guest) {
        this.updateGuestData = {
          name: guest.name,
          car_number: guest.car_number,
          nationality: guest.nationality,
          price: guest.price,
          spotId: this.selectedSpot,
          check_in: guest.check_in,
          check_out: guest.check_out,
          adults: guest.adults,
          children: guest.children,
          electricity: guest.electricity,
          stayId: guest.id,
          guestId: guest.guest_id,
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
    refreshGuestList() {
      this.store.loadGuests(this.dateStore.selectedDate, true);
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
  /* left: 350px !important;
  top: 90px !important; */
}
</style>
