<template>
  <div class="book-screen">
    <h1>Book</h1>
    <p>Campingboka</p>
    <!-- <AgGridTable></AgGridTable> -->
  </div>
</template>

<script>
/* import AgGridTable from "@/components/AgGridTable.vue"; */

export default {
  name: "BookScreen",
  components: {
    /* AgGridTable, */
    // Add it here
  },
};
</script>

<style scoped>
.book-screen {
  text-align: center;
  margin-top: 50px;
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
