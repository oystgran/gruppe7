<template>
  <el-card shadow="hover">
    <el-row :gutter="10">
      <el-col :span="1">{{ plass }}</el-col>
      <el-col :span="5">
        <slot name="bilnummer"></slot>
      </el-col>
      <el-col :span="5">{{ nasjonalitet }}</el-col>
      <el-col :span="5">{{ innsjekk }} </el-col>
      <el-col :span="5">{{ utsjekk }} </el-col>
      <el-col :span="2">{{ pris }}</el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: "GuestBookCard",
  props: {
    plass: Number,
    bilnummer: String,
    nasjonalitet: String,
    innsjekk: String,
    pris: [Number, String], // Pris kan være et tall eller tom
    utsjekk: String,
  },
};
</script>

<style scoped>
.el-card {
  height: auto; /* Sørger for at kortet har automatisk høyde basert på innholdet */
  min-height: 62px;
}

.el-card_body {
  padding: -10px;
}

.el-row {
  display: flex;
  justify-content: center;
  align-items: center; /* Sørger for at alle kolonner strekker seg over samme høyde */
  min-height: 22.88px;
}

.el-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100px;
  /* border-radius: 4px; */
}

/* Spesifikk stil for innsjekk og utsjekk kolonne */
</style>
