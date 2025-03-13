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
        >Pris
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
  height: 80px; /* Fast høyde */
  display: flex; /* Aktiverer flexbox */
  flex-direction: row; /* Plasserer innhold horisontalt */
  align-items: center; /* Sentrerer innholdet vertikalt */
  justify-content: space-around; /* Sprer innholdet jevnt */
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
