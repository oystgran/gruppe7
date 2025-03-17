<template>
  <div class="bookCards">
    <GuestBookCard
      v-for="index in 42"
      :key="index"
      :plass="index"
      :bilnummer="getGuestData(index, 'Bilnummer')"
      :dato="getGuestData(index, 'Dato')"
      :pris="getGuestData(index, 'Pris')"
      :bet="getGuestData(index, 'Betaling')"
    />
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/main";
import GuestBookCard from "./GuestBookCard.vue";

export default {
  name: "GuestBook",
  components: {
    GuestBookCard,
  },
  data() {
    return {
      guests: {}, // Bruker et objekt i stedet for array for rask oppslag
    };
  },
  async mounted() {
    try {
      const guestsCollectionRef = collection(
        db,
        "Camping",
        "Gjester",
        "Gjester"
      );
      const querySnapshot = await getDocs(guestsCollectionRef);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        this.guests[data.Plass] = data; // Lagre gjester etter plassnummer
      });

      console.log("Gjester hentet:", this.guests);
    } catch (error) {
      console.error("Feil ved henting av data:", error);
    }
  },
  methods: {
    getGuestData(plass, key) {
      return this.guests[plass]?.[key] || "-"; // Returnerer data hvis den finnes, ellers '-'
    },
  },
};
</script>

<style scoped>
.add-symbol {
  font-size: 1.5rem;
  color: #888; /* Grå farge for å indikere tom plass */
  cursor: pointer; /* Kan brukes til å indikere at man kan legge til noe */
}
.bookCards {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-template-columns: repeat(3, minmax(350px, 1fr)); /* Maks 3 kolonner */
  /* gap: 10px; */ /* Valgfritt: Mellomrom mellom kortene */
}

/* Når skjermen er for smal for 3 kolonner (f.eks. under 1100px) → 2 kolonner */
@media (max-width: 1100px) {
  .bookCards {
    grid-template-columns: repeat(2, minmax(350px, 1fr));
  }
}

/* Når skjermen er for smal for 2 kolonner (f.eks. under 750px) → 1 kolonne */
@media (max-width: 750px) {
  .bookCards {
    grid-template-columns: repeat(1, minmax(350px, 1fr));
  }
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
</style>
