<template>
  <div class="guestbook-wrapper">
    <div class="bookCards">
      <div v-for="(group, i) in groupedSpotIds" :key="i" class="group">
        <GuestBookCard
          class="guestcard"
          v-for="spotId in group"
          :key="spotId"
          :spot="spotId"
          :nationality="store.bookingsToday[spotId]?.nationality"
          :checkIn="
            store.bookingsToday[spotId]?.check_in
              ? formatDate(store.bookingsToday[spotId].check_in)
              : ''
          "
          :checkOut="
            store.bookingsToday[spotId]?.check_out
              ? formatDate(store.bookingsToday[spotId].check_out)
              : ''
          "
          :price="store.bookingsToday[spotId]?.price"
          @click="openModalWithGuest(spotId)"
        >
          <template v-slot:car_number>
            <span v-if="store.bookingsToday[spotId]?.car_number">
              {{ store.bookingsToday[spotId]?.car_number }}
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
        this.$emit("showAddGuestModal", { spotId: index });
      } else {
        this.$emit("showUpdateGuestModal", {
          name: guest.name,
          car_number: guest.car_number,
          nationality: guest.nationality,
          price: guest.price,
          spotId: index,
          check_in: guest.check_in,
          check_out: guest.check_out,
          adults: guest.adults,
          children: guest.children,
          electricity: guest.electricity,
          stayId: guest.id,
          guestId: guest.guestId,
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
    groupedSpotIds() {
      const totalSpots = 42;
      const groups = [];
      const perGroup = Math.ceil(totalSpots / this.groupCount);

      for (let i = 0; i < this.groupCount; i++) {
        const start = i * perGroup + 1;
        const end = Math.min(start + perGroup - 1, totalSpots);
        groups.push(
          Array.from({ length: end - start + 1 }, (_, j) => start + j)
        );
      }
      return groups;
    },
  },
};
</script>

<style scoped>
.bookCards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-template-columns: repeat(3, minmax(350px, 1fr));
  height: 100%;
  width: 100vw;
}
@media (max-width: 1300px) {
  .bookCards {
    grid-template-columns: repeat(2, minmax(350px, 1fr));
  }
}
@media (max-width: 960px) {
  .bookCards {
    grid-template-columns: repeat(1, minmax(350px, 1fr));
  }
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
  visibility: visible;
  display: flex;
  align-items: left;
  justify-content: left;
}
</style>
