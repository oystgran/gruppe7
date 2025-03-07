<template>
  <div class="archive-screen">
    <h1>Arkiv</h1>
    <ArchiveTable></ArchiveTable>
  </div>
</template>

<script>
import ArchiveTable from "@/components/ArchiveTable.vue";
export default {
  name: "ArchiveScreen",
  components: {
    ArchiveTable,
  },
};
</script>

<style scoped>
.archive-screen {
  text-align: center;
  margin-top: 50px;
  width: 800px; /* 80% av viewport width */
  max-width: 1200px; /* Valgfritt: setter en maks bredde */
  height: 100vh; /* Sikrer at den fyller høyden av skjermen */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}

.archive-screen h1 {
  font-size: 2.5em;
  color: #4caf50;
}

.archive-screen p {
  font-size: 1.2em;
  color: #555;
}
</style>
