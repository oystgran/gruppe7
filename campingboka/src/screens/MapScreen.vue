<template>
  <div class="map-screen">
    <div class="top-panel">
      <DateNavigator v-model="myDate" />
    </div>
    <div class="map-panel"><MapComponent 
      :guests="filteredGuests"
      @rectangle-clicked="handleRectangleClicked"
      style="transform: rotate(-10deg); transform-origin: center;"
    />
  
    </div>
    <GuestModal
      :visible="showAddGuestModal || showUpdateGuestModal"
      :mode="showAddGuestModal ? 'add' : 'edit'"
      :initialPlass="selectedPlass"
      :guest="updateGuestData"
      @close="closeModal"
      @guestSaved="reloadGuests"
    />
    <el-button type="primary" @click="openPosterModal">Vis plakat</el-button>
    <div v-if="isPosterModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closePosterModal">&times;</span>
        <img :src="posterMap" alt="Kart" class="modal-image" />
      </div>
    </div>
  </div>
</template>

<script>
import posterMap from '@/assets/posterMap.png';
import MapComponent from '@/components/MapComponent.vue';
import DateNavigator from '@/components/DateNavigator.vue';
import GuestModal from '@/components/GuestModal.vue';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/main.js';

export default {
  name: 'MapScreen',
  components: { MapComponent, DateNavigator, GuestModal },
  data() {
    return {
      posterMap,
      isPosterModalOpen: false,
      showAddGuestModal: false,
      showUpdateGuestModal: false,
      selectedPlass: null,
      myDate: new Date(),
      guests: {},
      updateGuestData: null,
    };
  },
  computed: {
    filteredGuests() {
      const result = {};
      Object.keys(this.guests).forEach(plass => {
        const guest = this.guests[plass];
        const checkIn =
          guest.Innsjekk && guest.Innsjekk.toDate
            ? guest.Innsjekk.toDate()
            : new Date(guest.Innsjekk);
        const checkOut =
          guest.Utsjekk && guest.Utsjekk.toDate
            ? guest.Utsjekk.toDate()
            : new Date(guest.Utsjekk);
        if (this.myDate >= checkIn && this.myDate <= checkOut) {
          result[plass] = guest;
        }
      });
      return result;
    }
  },
  mounted() {
    this.loadGuests();
  },
  watch: {
  myDate() {
    this.loadGuests();
  }
},
  methods: {
    async loadGuests() {
      const snapshot = await getDocs(collection(db, "Overnattinger"));
      const guestsData = {};
      for (const docSnap of snapshot.docs) {
        const stay = docSnap.data();
        const innsjekk =
          stay.innsjekk?.toDate ? stay.innsjekk.toDate() : new Date(stay.innsjekk);
        const utsjekk =
          stay.utsjekk?.toDate ? stay.utsjekk.toDate() : new Date(stay.utsjekk);
        if (!innsjekk || !utsjekk) continue;
        if (this.myDate < innsjekk || this.myDate > utsjekk) continue;
        const guestRef = doc(db, "Gjest", stay.gjestId);
        const guestSnap = await getDoc(guestRef);
        if (!guestSnap.exists()) continue;
        const guest = guestSnap.data();
        stay.plassId.forEach(plassId => {
          guestsData[plassId] = {
            gjestId: guestSnap.id,
            overnattingId: docSnap.id,
            Bilnummer: guest.bilnummer,
            Nasjonalitet: guest.nasjonalitet,
            Navn: guest.navn,
            Vip: guest.vip,
            Innsjekk: innsjekk,
            Utsjekk: utsjekk,
            Pris: stay.pris,
            Voksne: stay.voksne,
            Barn: stay.barn,
            Elektrisitet: stay.elektrisitet,
            Plass: Number(plassId)
          };
        });
      }
      this.guests = guestsData;
    },
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
