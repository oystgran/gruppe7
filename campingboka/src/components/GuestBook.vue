<template>
  <div class="bookCards">
    <GuestBookCard
      v-for="index in 42"
      :key="index"
      :plass="index"
      :bilnummer="guests[index]?.Bilnummer || '+'"
      :nasjonalitet="guests[index]?.Nasjonalitet"
      :innsjekk="
        guests[index]?.Innsjekk ? formatDate(guests[index].Innsjekk) : ''
      "
      :utsjekk="guests[index]?.Utsjekk ? formatDate(guests[index].Utsjekk) : ''"
      :pris="guests[index]?.Pris"
    />
  </div>
</template>

<script>
import { db } from "@/main";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import GuestBookCard from "./GuestBookCard.vue";

export default {
  name: "GuestBook",
  components: {
    GuestBookCard,
  },
  data() {
    return {
      guests: {}, // Objekt for å holde gjestedataene
    };
  },
  async mounted() {
    const latestQuery = query(
      collection(db, "Camping", "Gjester", "Gjester"),
      orderBy("Plass")
    );
    const snapshot = await getDocs(latestQuery);

    let guestsData = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      guestsData[data.Plass] = data; // Bruk plassnummer som nøkkel
    });

    console.log("Gjester hentet:", guestsData);
    this.guests = guestsData; // Lagre gjestedataene
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate(); // Konverter Timestamp til Date
      return date.toLocaleString(); // Returner datoen som en lokal streng
    },
  },
};
</script>

<style scoped>
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
