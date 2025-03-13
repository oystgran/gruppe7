<template>
  <el-card shadow="hover">
    <el-row :gutter="20">
      <el-col :span="6"
        >Plass:
        <div class="grid-content ep-bg-purple"
      /></el-col>
      <el-col :span="6"
        >Bilnummer:
        <div class="grid-content ep-bg-purple"
      /></el-col>
      <el-col :span="6"
        >Dato:
        <div class="grid-content ep-bg-purple"
      /></el-col>
      <el-col :span="6"
        >Pris
        <div class="grid-content ep-bg-purple"
      /></el-col>
      <el-col :span="6"
        >Bet
        <div class="grid-content ep-bg-purple"
      /></el-col>
    </el-row>
    <!-- <p v-for="o in 4" :key="o" class="text item">
      {{ "List item " + o }}
    </p> -->
  </el-card>
</template>
<script>
export default {
  name: "GuestBookCard", // Changed to a multi-word name
};
</script>

<style scoped>
.el-card {
  height: auto; /* Automatisk høyde for innhold */
  display: grid; /* Bruk grid i stedet for flex */
  grid-template-columns: repeat(5, 1fr); /* 5 kolonner med lik bredde */
  gap: 20px; /* Avstand mellom elementene */
  min-height: 60px;
}

.el-row {
  display: grid; /* Bruk grid for å arrangere kolonner */
  grid-template-columns: repeat(5, 1fr); /* Del opp i 5 kolonner */
  gap: 20px; /* Avstand mellom kolonnene */
}

.el-col {
  display: flex;
  flex-direction: column; /* Plasserer tekst og innhold vertikalt */
  justify-content: center; /* Sentrerer innholdet vertikalt */
  border-radius: 4px;
}
</style>
