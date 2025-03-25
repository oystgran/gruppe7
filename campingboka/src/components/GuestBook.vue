<template>
  <div class="bookCards">
    <!-- First group: 1 to 14 -->
    <div class="group1">
      <GuestBookCard
        v-for="index in 14"
        :key="index"
        :plass="index"
        :nasjonalitet="guests[index]?.Nasjonalitet"
        :innsjekk="
          guests[index]?.Innsjekk ? formatDate(guests[index].Innsjekk) : ''
        "
        :utsjekk="
          guests[index]?.Utsjekk ? formatDate(guests[index].Utsjekk) : ''
        "
        :pris="guests[index]?.Pris"
        @click="openModalWithGuest(index)"
      >
        <template v-slot:bilnummer>
          <span v-if="guests[index]?.Bilnummer">
            {{ guests[index]?.Bilnummer }}
          </span>
          <el-icon v-else class="plus-icon">
            <CirclePlusFilled />
          </el-icon>
        </template>
      </GuestBookCard>
    </div>

    <!-- Second group: 15 to 28 -->
    <div class="group2">
      <GuestBookCard
        v-for="index in 14"
        :key="index + 14"
        :plass="index + 14"
        :nasjonalitet="guests[index + 14]?.Nasjonalitet"
        :innsjekk="
          guests[index + 14]?.Innsjekk
            ? formatDate(guests[index + 14].Innsjekk)
            : ''
        "
        :utsjekk="
          guests[index + 14]?.Utsjekk
            ? formatDate(guests[index + 14].Utsjekk)
            : ''
        "
        :pris="guests[index + 14]?.Pris"
        @click="openModalWithGuest(index + 14)"
      >
        <template v-slot:bilnummer>
          <span v-if="guests[index + 14]?.Bilnummer">{{
            guests[index + 14]?.Bilnummer
          }}</span>
          <el-icon v-else class="plus-icon">
            <CirclePlusFilled />
          </el-icon>
        </template>
      </GuestBookCard>
    </div>

    <!-- Third group: 29 to 42 -->
    <div class="group3">
      <GuestBookCard
        v-for="index in 14"
        :key="index + 28"
        :plass="index + 28"
        :nasjonalitet="guests[index + 28]?.Nasjonalitet"
        :innsjekk="
          guests[index + 28]?.Innsjekk
            ? formatDate(guests[index + 28].Innsjekk)
            : ''
        "
        :utsjekk="
          guests[index + 28]?.Utsjekk
            ? formatDate(guests[index + 28].Utsjekk)
            : ''
        "
        :pris="guests[index + 28]?.Pris"
        @click="openModalWithGuest(index + 28)"
      >
        <template v-slot:bilnummer>
          <span v-if="guests[index + 28]?.Bilnummer">{{
            guests[index + 28]?.Bilnummer
          }}</span>
          <el-icon v-else class="plus-icon">
            <CirclePlusFilled />
          </el-icon>
        </template>
      </GuestBookCard>
    </div>
  </div>
</template>

<script>
import { db } from "@/main";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import GuestBookCard from "./GuestBookCard.vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";

export default {
  name: "GuestBook",
  components: {
    GuestBookCard,
    CirclePlusFilled,
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
      return date.toLocaleDateString(); // Returner datoen som en lokal streng
    },
    openModalWithGuest(index) {
      const guest = this.guests[index];

      // Hvis det IKKE finnes noen gjest på denne plassen (altså ruten er tom)
      if (!guest) {
        console.log("Tom plass valgt:", index);
        this.$emit("showAddGuestModal", { Plass: index }); // emit med kun plassnummer eller tom objekt
      } else {
        // Hvis plassen er opptatt, gjør ingenting eller vis informasjon om gjesten hvis ønskelig
        console.log("Plassen er allerede opptatt:", guest);
      }
    },
  },
};
</script>

<style scoped>
.bookCards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-template-columns: repeat(3, minmax(350px, 1fr)); /* Maks 3 kolonner */
  height: 100%;
  width: 100vw;
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

/* .el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
} */
.el-card__body {
  /* padding: 15.3px !important; */
}
.plus-icon {
  font-size: 30.74px;
  color: #1da03b;
  vertical-align: middle;
  visibility: hidden;
}
.plus-icon:hover {
  font-size: 30.74px;
  color: #1da03b;
  vertical-align: middle;
  visibility: visible;
}
</style>
