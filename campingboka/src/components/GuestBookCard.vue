<template>
  <el-card shadow="hover">
    <el-row :gutter="30">
      <el-col :span="2">{{ plass }}</el-col>
      <el-col :span="6" style="font-weight: bold">
        <slot name="bilnummer"></slot>
      </el-col>
      <el-col :span="4" style="display: flex; align-items: center; gap: 6px">
        <el-tooltip
          v-if="country"
          :content="country.name"
          placement="top"
          effect="dark"
          :hide-after="0"
          popper-class="custom-tooltip"
        >
          <img
            :src="country.flag"
            :alt="country.name"
            width="20"
            height="15"
            style="cursor: pointer"
          />
        </el-tooltip>
      </el-col>
      <!-- <el-col :span="2" style="display: flex; align-items: center; gap: 6px">
        <img
          v-if="countryFlag"
          :src="countryFlag"
          :alt="countryCode"
          width="32"
          height="21"
          :title="nasjonalitet"
        />
      </el-col> -->
      <!-- <el-col :span="4" style="display: flex; align-items: center; gap: 6px">
        <img
          v-if="country"
          :src="country.flag"
          :alt="country.name"
          width="20"
          height="15"
        />
        <span>{{ country?.name || nasjonalitet }}</span>
      </el-col> -->
      <el-col :span="4">{{ innsjekk }} </el-col>
      <el-col :span="4">{{ utsjekk }} </el-col>
      <el-col :span="2">{{ pris }}</el-col>
    </el-row>
  </el-card>
</template>
<script>
import { countries } from "@/tools/countries";
//import { ElTooltip } from "element-plus";

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
  computed: {
    country() {
      if (!this.nasjonalitet || typeof this.nasjonalitet !== "string")
        return null;

      // Sjekk om nasjonaliteten er en landkode som finnes i countries
      if (countries[this.nasjonalitet]) {
        return countries[this.nasjonalitet];
      }

      // Hvis nasjonaliteten er skrevet som navn ("Argentina") → prøv å finne koden
      const entry = Object.entries(countries).find(
        (
          [, data] // tom plass for første element = ignoreres
        ) => data?.name?.toLowerCase() === this.nasjonalitet.toLowerCase()
      );
      return entry ? entry[1] : null;
    },
  },
};
</script>

<style scoped>
.el-card {
  height: auto; /* Sørger for at kortet har automatisk høyde basert på innholdet */
  min-height: 52px;
  --el-card-padding: 10px;
  /* display: flex;
  align-items: center;
  justify-content: left; */
}

.el-card_body {
}
.el-card-is-hover-shadow {
  background-color: green;
}

.el-row {
  display: flex;
  justify-content: left;
  align-items: center; /* Sørger for at alle kolonner strekker seg over samme høyde */
  min-height: 35.88px;
}

.el-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100px;
  /* border-radius: 4px; */
}

.custom-tooltip {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #fff; /* optional */
}
/* Spesifikk stil for innsjekk og utsjekk kolonne */
</style>
