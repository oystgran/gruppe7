<template>
  <div class="bookCards">
    <div class="bookCards">
      <GuestBookCard v-for="index in 42" :key="index" :plass="index" />
    </div>
  </div>
</template>

<script>
import GuestBookCard from "./GuestBookCard.vue";
export default {
  name: "GuestBook", // Changed to a multi-word name
  components: {
    GuestBookCard,
  },
};
</script>

<style scoped>
.bookCards {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-template-columns: repeat(3, minmax(350px, 1fr)); /* Maks 3 kolonner */
  /* gap: 10px; */ /* Valgfritt: Mellomrom mellom kortene */
}

/* Når skjermen er for smal for 3 kolonner (f.eks. under 1100px) → 2 kolonner */
@media (max-width: 1100px) {
  .bookCards {
    grid-template-columns: repeat(2, minmax(350px, 1fr));
  }
}

/* Når skjermen er for smal for 2 kolonner (f.eks. under 750px) → 1 kolonne */
@media (max-width: 750px) {
  .bookCards {
    grid-template-columns: repeat(1, minmax(350px, 1fr));
  }
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
</style>
