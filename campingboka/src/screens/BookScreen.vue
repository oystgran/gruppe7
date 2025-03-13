<template>
  <div class="book-screen">
    <!-- <AgGridTable></AgGridTable> -->
    <GuestBook></GuestBook>
  </div>
</template>

<script>
// Import the renamed 'GuestBook' component
import GuestBook from "@/components/GuestBook.vue";

export default {
  name: "BookScreen",
  components: {
    GuestBook, // Register 'GuestBook' here
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
