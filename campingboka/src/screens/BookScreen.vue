<template>
  <div class="book-screen">
    <!-- GuestBook component -->
    <GuestBook
      ref="guestBook"
      @showAddGuestModal="handleShowAddModal"
      @showUpdateGuestModal="handleShowUpdateModal"
    />

    <!-- AddGuestModal component, passing the visibility and guest data -->
    <AddGuestModal
      :visible="showAddGuestModal"
      :initialPlass="selectedPlass"
      @close="closeModal"
      @guestAdded="refreshGuestList"
    />
    <UpdateGuestModal
      :visible="showUpdateGuestModal"
      :initialPlass="selectedPlass"
      @close="closeModal"
    />
  </div>
</template>

<script>
// Import the renamed 'GuestBook' component
import GuestBook from "@/components/GuestBook.vue";
import AddGuestModal from "@/components/AddGuestModal.vue";
import UpdateGuestModal from "@/components/UpdateGuestModal.vue";

export default {
  name: "BookScreen",
  components: { GuestBook, AddGuestModal, UpdateGuestModal },
  data() {
    return {
      showAddGuestModal: false, // Controls modal visibility
      showUpdateGuestModal: false,
      selectedPlass: null, // Store the selected guest's place (can be null or a default value)
    };
  },
  methods: {
    // Handle showing the modal
    handleShowAddModal(guestData) {
      this.selectedPlass = guestData.Plass;
      this.showAddGuestModal = true;
    },
    handleShowUpdateModal(guestData) {
      this.selectedPlass = guestData.Plass;
      this.showUpdateGuestModal = true;
    },
    closeModal() {
      this.showAddGuestModal = false;
      this.showUpdateGuestModal = false;
      this.selectedPlass = null;
    },
    refreshGuestList() {
      this.$refs.guestBook.loadGuests();
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
