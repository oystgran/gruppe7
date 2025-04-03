<template>
  <div class="guestbook-wrapper">
    <DateNavigator v-model="selectedDate" />
    <div class="bookCards">
      <div v-for="(gruppe, i) in groupedPlassIds" :key="i" class="gruppe">
        <GuestBookCard
          class="guestcard"
          v-for="plassId in gruppe"
          :key="plassId"
          :plass="plassId"
          :nasjonalitet="guests[plassId]?.nasjonalitet"
          :innsjekk="
            guests[plassId]?.innsjekk
              ? formatDate(guests[plassId].innsjekk)
              : ''
          "
          :utsjekk="
            guests[plassId]?.utsjekk ? formatDate(guests[plassId].utsjekk) : ''
          "
          :pris="guests[plassId]?.pris"
          @click="openModalWithGuest(plassId)"
        >
          <template v-slot:bilnummer>
            <span v-if="guests[plassId]?.bilnummer">
              {{ guests[plassId]?.bilnummer }}
            </span>
            <el-icon v-else class="plus-icon">
              <CirclePlusFilled />
            </el-icon>
          </template>
        </GuestBookCard>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/main";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import GuestBookCard from "./GuestBookCard.vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import DateNavigator from "./DateNavigator.vue";

export default {
  name: "GuestBook",
  components: { GuestBookCard, CirclePlusFilled, DateNavigator },
  emits: ["showAddGuestModal", "showUpdateGuestModal"],
  watch: {
    selectedDate() {
      this.loadGuests();
    },
  },
  data() {
    return {
      guests: {},
      selectedDate: new Date(),
      windowWidth: window.innerWidth,
    };
  },
  mounted() {
    this.loadGuests();
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  methods: {
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    formatDate(timestamp) {
      if (!timestamp) return "";
      if (timestamp instanceof Date) return timestamp.toLocaleDateString();
      if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
      return String(timestamp);
    },
    openModalWithGuest(index) {
      const guest = this.guests[index];
      if (!guest) {
        this.$emit("showAddGuestModal", { Plass: index });
      } else {
        this.$emit("showUpdateGuestModal", {
          ...guest,
          overnattingId: guest.overnattingId,
          gjestId: guest.gjestId,
          Plass: index,
        });
      }
    },
    async loadGuests() {
      const snapshot = await getDocs(collection(db, "Overnattinger"));
      const guestsData = {};

      for (const docSnap of snapshot.docs) {
        const stay = docSnap.data();
        const innsjekk = stay.innsjekk?.toDate?.() || null;
        const utsjekk = stay.utsjekk?.toDate?.() || null;
        const selected = new Date(this.selectedDate);

        if (!innsjekk || !utsjekk) continue;

        const innsjekkCheck = new Date(innsjekk);
        const utsjekkCheck = new Date(utsjekk);
        const selectedCheck = new Date(selected);

        innsjekkCheck.setHours(0, 0, 0, 0);
        utsjekkCheck.setHours(0, 0, 0, 0);
        selectedCheck.setHours(0, 0, 0, 0);

        if (selectedCheck < innsjekkCheck || selectedCheck >= utsjekkCheck)
          continue;

        const guestRef = doc(db, "Gjest", stay.gjestId);
        const guestSnap = await getDoc(guestRef);
        const guest = guestSnap.exists() ? guestSnap.data() : null;

        if (!guest) continue;

        stay.plassId.forEach((plassId) => {
          guestsData[plassId] = {
            gjestId: guestSnap.id,
            overnattingId: docSnap.id,
            bilnummer: guest.bilnummer,
            nasjonalitet: guest.nasjonalitet,
            navn: guest.navn,
            vip: guest.vip,
            innsjekk: innsjekk,
            utsjekk: utsjekk,
            pris: stay.pris,
            voksne: stay.voksne,
            barn: stay.barn,
            elektrisitet: stay.elektrisitet,
            plass: plassId,
          };
        });
      }
      this.guests = guestsData;
    },
  },
  computed: {
    groupCount() {
      if (this.windowWidth <= 960) return 1;
      if (this.windowWidth <= 1300) return 2;
      return 3;
    },
    groupedPlassIds() {
      const totalPlasser = 42;
      const grupper = [];
      const perGruppe = Math.ceil(totalPlasser / this.groupCount);

      for (let i = 0; i < this.groupCount; i++) {
        const start = i * perGruppe + 1;
        const end = Math.min(start + perGruppe - 1, totalPlasser);
        grupper.push(
          Array.from({ length: end - start + 1 }, (_, j) => start + j)
        );
      }
      return grupper;
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
@media (max-width: 1300px) {
  .bookCards {
    grid-template-columns: repeat(2, minmax(350px, 1fr));
  }
}

/* Når skjermen er for smal for 2 kolonner (f.eks. under 750px) → 1 kolonne */
@media (max-width: 960px) {
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
  color: #39484645;
  vertical-align: middle;
  visibility: hidden;
}
.guestcard {
  cursor: pointer;
}
.guestcard:hover {
  background-color: hsl(0, 0%, 94%);
}
.guestcard:hover .plus-icon {
  visibility: visible; /* Make the icon visible when the guestcard is hovered */
  display: flex;
  align-items: left;
  justify-content: left;
}
</style>
