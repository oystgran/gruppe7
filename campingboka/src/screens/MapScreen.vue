<template>
    <div class="map-screen">
        <DateNavigator v-model="myDate" />

        <MapComponent 
        :guests="filteredGuests"
        @rectangle-clicked="handleRectangleClicked" 
        style="transform: rotate(-10deg);
        transform-origin: center;
        "
        />  

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

        <el-button type="primary" @click="openModal">Vis plakat</el-button>

        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <img :src="posterMap" alt="Kart" class="modal-image" />
            </div>
        </div>
    </div>
</template>

<script>
import posterMap from '@/assets/posterMap.png';
import MapComponent from '@/components/MapComponent.vue';
import AddGuestModal from '@/components/AddGuestModal.vue';
import UpdateGuestModal from '@/components/UpdateGuestModal.vue';
import DateNavigator from '@/components/DateNavigator.vue';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/main.js';

export default {
  name: 'MapScreen',
  components: { 
    MapComponent, 
    DateNavigator, 
    AddGuestModal, 
    UpdateGuestModal 
  },
  data() {
    return {
      posterMap,
      isPosterModalOpen: false,
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
    openPosterModal() {
      this.isPosterModalOpen = true;
    },
    closePosterModal() {
      this.isPosterModalOpen = false;
    }
  }
};
</script>

<style>
.map-screen {
    text-align: center;
}

.map-screen h1 {
    font-size: 2.5em;
    color: #4CAF50;
}

.map-screen p {
    font-size: 1.2em;
    color: #555;
}


button {
    font-size: 15px;
    cursor: pointer;
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
    z-index: 10;
}

.modal-content {
    position: relative;
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
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 10px;
    padding-right: 10px;
    color: black;
}

.close:hover {
    color: red;
}

.guest-tooltip {
    transform: rotate(10deg);
    transform-origin: center;
    position: absolute;
    left: 400px;
    top: 150px;
}
</style>