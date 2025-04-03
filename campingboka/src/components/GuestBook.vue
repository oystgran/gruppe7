<template>
  <DateNavigator v-model="selectedDate" />
  <div class="bookCards">
    <!-- First group: 1 to 14 -->
    <div class="group1">
      <GuestBookCard
        class="guestcard"
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
        class="guestcard"
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
        class="guestcard"
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
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import GuestBookCard from "./GuestBookCard.vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import DateNavigator from "./DateNavigator.vue";

export default {
  name: "GuestBook",
  components: {
    GuestBookCard,
    CirclePlusFilled,
    DateNavigator,
  },
  emits: ["showAddGuestModal", "showUpdateGuestModal"],
  data() {
    return {
      guests: {},
      selectedDate: new Date(), // default = i dag
    };
  },
  mounted() {
    this.loadGuests();
  },
  watch: {
    selectedDate() {
      this.loadGuests();
    },
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return "";
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString();
      }

      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString();
      }
      return String(timestamp);
    },
    onDateChanged(newDate) {
      this.selectedDate = new Date(newDate);
      this.loadGuests();
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

        // Bruk separate kopier til sammenligning:
        const innsjekkCheck = new Date(innsjekk);
        const utsjekkCheck = new Date(utsjekk);
        const selectedCheck = new Date(selected);

        innsjekkCheck.setHours(0, 0, 0, 0);
        utsjekkCheck.setHours(0, 0, 0, 0);
        selectedCheck.setHours(0, 0, 0, 0);

        // Sammenligning:
        if (selectedCheck < innsjekkCheck || selectedCheck >= utsjekkCheck)
          continue;

        // Hent gjest
        const guestRef = doc(db, "Gjest", stay.gjestId);
        const guestSnap = await getDoc(guestRef);
        const guest = guestSnap.exists() ? guestSnap.data() : null;

        if (!guest) continue;

        stay.plassId.forEach((plassId) => {
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
            Voksne: guest.voksne,
            Barn: guest.barn,
            Elektrisitet: guest.elektrisitet,
            Plass: plassId,
          };
        });
      }
      this.guests = guestsData;
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
