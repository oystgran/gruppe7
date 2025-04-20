<template>
  <div class="guestbook-wrapper">
    <div class="bookCards">
      <div v-for="(gruppe, i) in groupedPlassIds" :key="i" class="gruppe">
        <GuestBookCard
          class="guestcard"
          v-for="plassId in gruppe"
          :key="plassId"
          :plass="plassId"
          :nasjonalitet="store.bookingsToday[plassId]?.nasjonalitet"
          :innsjekk="
            store.bookingsToday[plassId]?.innsjekk
              ? formatDate(store.bookingsToday[plassId].innsjekk)
              : ''
          "
          :utsjekk="
            store.bookingsToday[plassId]?.utsjekk
              ? formatDate(store.bookingsToday[plassId].utsjekk)
              : ''
          "
          :pris="store.bookingsToday[plassId]?.pris"
          @click="openModalWithGuest(plassId)"
        >
          <template v-slot:bilnummer>
            <span v-if="store.bookingsToday[plassId]?.bilnummer">
              {{ store.bookingsToday[plassId]?.bilnummer }}
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
import GuestBookCard from "./GuestBookCard.vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { useStaysStore } from "@/stores/stays";

export default {
  name: "GuestBook",
  components: { GuestBookCard, CirclePlusFilled },
  emits: ["showAddGuestModal", "showUpdateGuestModal"],
  setup() {
    const store = useStaysStore();
    console.log(store.count);
    return { store };
  },
  watch: {
    selectedDate() {
      this.store.loadGuests(this.selectedDate);
    },
  },
  data() {
    return {
      selectedDate: new Date(),
      windowWidth: window.innerWidth,
    };
  },
  mounted() {
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  methods: {
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    formatDate(value) {
      const date =
        value instanceof Date ? value : value?.toDate?.() ?? new Date(value);

      return isNaN(date) ? "" : date.toLocaleDateString("no-NO");
    },
    openModalWithGuest(index) {
      const guest = this.store.bookingsToday[index];
      if (!guest) {
        this.$emit("showAddGuestModal", { Plass: index });
      } else {
        this.$emit("showUpdateGuestModal", {
          Navn: guest.navn,
          Bilnummer: guest.bilnummer,
          Nasjonalitet: guest.nasjonalitet,
          Pris: guest.pris,
          Plass: index,
          Innsjekk: guest.innsjekk,
          Utsjekk: guest.utsjekk,
          Voksne: guest.voksne,
          Barn: guest.barn,
          Elektrisitet: guest.elektrisitet,
          overnattingId: guest.id, // ← fra firestore ID
          gjestId: guest.gjestId,
        });
      }
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
