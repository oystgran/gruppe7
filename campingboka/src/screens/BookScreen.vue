<!--
  BookScreen.vue
  --------------------------------------------------
  Screen for managing guest bookings in a list format:
    • Displays the GuestBook component, showing all bookings per spot for the selected date.
    • Handles user interactions for adding or updating a guest (via emitted events).
    • Opens GuestModal in 'add' or 'edit' mode depending on user action.
    • Passes spot ID, guest data, and selected date to GuestModal.
    • Refreshes guest list from store after saving changes.
    • Resets internal modal state on close to avoid data leaks.
-->
<template>
  <div class="book-screen">
    <!-- GuestBook component -->
    <GuestBook
      ref="guestBook"
      :selectedDate="dateStore.selectedDate"
      @showAddGuestModal="handleShowAddModal"
      @showUpdateGuestModal="handleShowUpdateModal"
    />

    <!-- GuestModal component -->
    <GuestModal
      :key="selectedSpot + '-' + (showAddGuestModal ? 'add' : 'edit')"
      :visible="showAddGuestModal || showUpdateGuestModal"
      :mode="showAddGuestModal ? 'add' : 'edit'"
      :initialSpotId="selectedSpot"
      :guest="updateGuestData"
      :selectedDate="dateStore.selectedDate"
      @close="closeModal"
      @guestSaved="refreshGuestList"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import GuestBook from "@/components/GuestBook.vue";
import GuestModal from "@/components/GuestModal.vue";
import { useStaysStore } from "@/stores/stays";
import { useDateStore } from "@/stores/dateStore";

const dateStore = useDateStore();
const staysStore = useStaysStore();

const showAddGuestModal = ref(false);
const showUpdateGuestModal = ref(false);
const selectedSpot = ref(null);
const updateGuestData = ref(null);
const guestBook = ref(null);

const handleShowAddModal = (guestData) => {
  updateGuestData.value = null;
  selectedSpot.value = guestData.spotId;
  showAddGuestModal.value = true;
};

const handleShowUpdateModal = (guestData) => {
  selectedSpot.value = guestData.spotId;
  updateGuestData.value = guestData;
  showUpdateGuestModal.value = true;
};

const closeModal = () => {
  showAddGuestModal.value = false;
  showUpdateGuestModal.value = false;
  selectedSpot.value = null;
  updateGuestData.value = null;
};

const refreshGuestList = () => {
  staysStore.loadGuests(dateStore.selectedDate, true);
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
