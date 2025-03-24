<template>
  <div class="book-screen">
    <!-- GuestBook component -->
    <GuestBook @showAddGuestModal="handleShowModal" />

    <!-- AddGuestModal component, passing the visibility and guest data -->
    <AddGuestModal
      :visible="showAddGuestModal"
      :initialPlass="selectedPlass"
      @close="closeModal"
    />
  </div>
</template>

<script>
// Import the renamed 'GuestBook' component
import GuestBook from "@/components/GuestBook.vue";
import AddGuestModal from "@/components/AddGuestModal.vue";

export default {
  name: "BookScreen",
  components: { GuestBook, AddGuestModal },
  data() {
    return {
      showAddGuestModal: false, // Controls modal visibility
      selectedPlass: null, // Store the selected guest's place (can be null or a default value)
    };
  },
  methods: {
    // Handle showing the modal
    handleShowModal(guest) {
      if (guest) {
        this.selectedPlass = guest.Plass; // Set the selected guest's place if the guest exists
      } else {
        this.selectedPlass = "Default Place"; // Set to a default value if no guest data is passed
      }
      this.showAddGuestModal = true; // Always open the modal
    },
    // Close the modal
    closeModal() {
      this.showAddGuestModal = false; // Close the modal
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
