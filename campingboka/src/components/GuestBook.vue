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
          :vip="store.bookingsToday[spotId]?.vip"
          @click="openModalWithGuest(spotId)"
          draggable="true"
          @dragstart="onDragStart(spotId)"
          @dragover.prevent
          @drop="onDrop(spotId)"
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
  props: {
    selectedDate: Date,
  },
  watch: {
    selectedDate: {
      immediate: true,
      handler(newDate) {
        this.store.loadGuests(newDate);
      },
    },
  },

  data() {
    return {
      windowWidth: window.innerWidth,
      dragSourceSpotId: null,
    };
  },
  mounted() {
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  methods: {
    onDragStart(spotId) {
      this.dragSourceSpotId = spotId;
    },
    async onDrop(targetSpotId) {
      const sourceSpotId = this.dragSourceSpotId;
      if (sourceSpotId === null || sourceSpotId === targetSpotId) return;

      const stay1 = this.store.bookingsToday[sourceSpotId];
      const stay2 = this.store.bookingsToday[targetSpotId];

      const fromDate = new Date(this.selectedDate);
      fromDate.setHours(14, 0, 0, 0); // innsjekkstid
      const fromDateISO = fromDate.toISOString();

      // 1. 🔁 SWAP hvis begge har opphold
      if (stay1 && stay2) {
        const confirmed = await this.$confirm(
          `Swap ${stay1.car_number} (spot ${sourceSpotId}) with ${
            stay2.car_number
          } (spot ${targetSpotId}) from ${fromDate.toLocaleDateString(
            "no-NO"
          )}?`,
          "Confirm Swap",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            type: "warning",
          }
        ).catch(() => false);

        if (!confirmed) return;

        try {
          const response = await fetch("/api/stays/partial-swap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stay1: { id: stay1.id },
              stay2: { id: stay2.id },
              fromDate,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Swap failed.");
          }

          this.$message.success("Guests swapped!");
          this.store.loadGuests(this.selectedDate);
        } catch (err) {
          console.error("Swap failed:", err);
          this.$message.error(err.message || "Swap failed.");
        }

        // 2. 🛏 MOVE hvis kun én har opphold
      } else if (stay1 && !stay2) {
        const confirmed = await this.$confirm(
          `Move ${
            stay1.car_number
          } from spot ${sourceSpotId} to ${targetSpotId} from ${fromDate.toLocaleDateString(
            "no-NO"
          )}?`,
          "Confirm Move",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            type: "warning",
          }
        ).catch(() => false);

        if (!confirmed) return;

        try {
          const response = await fetch("/api/stays/move", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stayId: stay1.id,
              newSpotId: targetSpotId,
              fromDate,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Move failed.");
          }

          this.$message.success("Guest moved!");
          this.store.loadGuests(this.selectedDate);
        } catch (err) {
          console.error("Move failed:", err);
          this.$message.error(err.message || "Move failed.");
        }
      } else {
        // 3. ❌ Begge tomme
        this.$message.info("Nothing to move or swap.");
      }

      this.dragSourceSpotId = null;
    },
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
          guestId: guest.guest_id,
          vip: guest.vip,
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
.guestcard.drag-over {
  border: 2px dashed #409eff;
}
</style>
