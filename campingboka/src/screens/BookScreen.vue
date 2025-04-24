<template>
  <div class="book-screen">
    <!-- GuestBook component -->
    <GuestBook
      ref="guestBook"
      @showAddGuestModal="handleShowAddModal"
      @showUpdateGuestModal="handleShowUpdateModal"
    />

    <!-- GuestModal component -->
    <GuestModal
      :key="selectedSpot + '-' + modalMode"
      :visible="showAddGuestModal || showUpdateGuestModal"
      :mode="showAddGuestModal ? 'add' : 'edit'"
      :initialSpotId="selectedSpot"
      :guest="updateGuestData"
      @close="closeModal"
      @guestSaved="refreshGuestList"
    />
  </div>
</template>

<script>
import GuestBook from "@/components/GuestBook.vue";
import GuestModal from "@/components/GuestModal.vue";

export default {
  name: "BookScreen",
  components: { GuestBook, GuestModal },
  data() {
    return {
      showAddGuestModal: false,
      showUpdateGuestModal: false,
      selectedSpot: null,
      updateGuestData: null,
    };
  },
  methods: {
    handleShowAddModal(guestData) {
      this.updateGuestData = null;
      this.selectedSpot = guestData.spotId;
      this.showAddGuestModal = true;
    },
    handleShowUpdateModal(guestData) {
      this.selectedSpot = guestData.spotId;
      this.updateGuestData = guestData;
      this.showUpdateGuestModal = true;
    },
    closeModal() {
      this.showAddGuestModal = false;
      this.showUpdateGuestModal = false;
      this.selectedSpot = null;
      this.updateGuestData = null;
    },
    refreshGuestList() {
      this.$refs.guestBook.store.loadGuests();
    },
  },
};
</script>

<style scoped>
.book-screen {
}

.book-screen h1 {
  font-size: 2.5em;
  color: #4caf50;
}

.book-screen p {
  font-size: 1.2em;
  color: #555;
}
</style>
