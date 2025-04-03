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
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/main.js';

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
}

::v-deep .guest-tooltip {
  transform: rotate(-30deg) !important;
  transform-origin: center !important;
}
</style>