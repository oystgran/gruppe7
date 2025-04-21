<template>
  <div class="book-screen">
    <!-- GuestBook component -->
    <GuestBook
      ref="guestBook"
      @showAddGuestModal="handleShowAddModal"
      @showUpdateGuestModal="handleShowUpdateModal"
    />

    <!-- AddGuestModal component, passing the visibility and guest data -->
    <GuestModal
      :visible="showAddGuestModal || showUpdateGuestModal"
      :mode="showAddGuestModal ? 'add' : 'edit'"
      :initialPlass="selectedPlass"
      :guest="updateGuestData"
      @close="closeModal"
      @guestSaved="refreshGuestList"
    />
    <!-- <AddGuestModal
      :visible="showAddGuestModal"
      :initialPlass="selectedPlass"
      @close="closeModal"
      @guestAdded="refreshGuestList"
    />
    <UpdateGuestModal
      :visible="showUpdateGuestModal"
      :initialPlass="selectedPlass"
      :guest="updateGuestData"
      @close="closeModal"
      @guestUpdated="refreshGuestList"
    /> -->
  </div>
</template>

<script>
// Import the renamed 'GuestBook' component
import GuestBook from "@/components/GuestBook.vue";
import GuestModal from "@/components/GuestModal.vue";
import { useStaysStore } from "@/stores/stays";
/* import AddGuestModal from "@/components/AddGuestModal.vue";
import UpdateGuestModal from "@/components/UpdateGuestModal.vue"; */

export default {
  name: "BookScreen",
  components: { GuestBook, GuestModal },
  data() {
    return {
      showAddGuestModal: false,
      showUpdateGuestModal: false,
      selectedPlass: null,
      updateGuestData: null,
    };
  },
  methods: {
    handleShowAddModal(guestData) {
      this.updateGuestData = null;
      this.selectedPlass = guestData.Plass;
      this.showAddGuestModal = true;
    },
    handleShowUpdateModal(guestData) {
      this.selectedPlass = guestData.Plass;
      this.updateGuestData = guestData;
      this.showUpdateGuestModal = true;
    },
    closeModal() {
      this.showAddGuestModal = false;
      this.showUpdateGuestModal = false;
      this.selectedPlass = null;
      this.updateGuestData = null;
    },
    refreshGuestList() {
      const store = useStaysStore();
      store.loadGuests(store.selectedDate);
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
/* .plus-icon {
  font-size: 30.74px;
  color: #1da03b;
  vertical-align: middle;
  visibility: hidden;
} */
</style>
