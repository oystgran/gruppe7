<template>
  <el-card shadow="hover">
    <el-row :gutter="20">
      <el-col :span="6">{{ plass }}</el-col>
      <el-col :span="6">{{ bilnummer }}</el-col>
      <el-col :span="6">{{ dato }}</el-col>
      <el-col :span="6">{{ pris }}</el-col>
      <el-col :span="6">{{ bet }}</el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: "GuestBookCard",
  props: {
    plass: Number,
    bilnummer: String,
    dato: String,
    pris: [Number, String], // Pris kan være et tall eller tom
    bet: String,
  },
};
</script>

<style scoped>
.el-card {
  height: auto; /* Automatisk høyde for innhold */
  display: grid; /* Bruk grid i stedet for flex */
  grid-template-columns: repeat(5, 1fr); /* 5 kolonner med lik bredde */
  gap: 20px; /* Avstand mellom elementene */
  min-height: 40px;
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
.add-symbol {
  font-size: 1.5rem;
  color: #888; /* Grå farge for å indikere tom plass */
  cursor: pointer; /* Kan brukes til å indikere at man kan legge til noe */
}
</style>
