<template>
  <el-card shadow="hover">
    <el-row :gutter="30">
      <el-col :span="2">{{ spot }}</el-col>
      <el-col :span="6" style="font-weight: bold">
        <slot name="car_number">
          {{ car_number }}
        </slot>
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
      <el-col :span="4">{{ checkIn }}</el-col>
      <el-col :span="4">{{ checkOut }}</el-col>
      <el-col :span="2">{{ price }}</el-col>
    </el-row>
  </el-card>
</template>

<script>
import { countries } from "@/tools/countries";

export default {
  name: "GuestBookCard",
  props: {
    spot: Number,
    car_number: String,
    nationality: String,
    checkIn: String,
    price: [Number, String],
    checkOut: String,
  },
  computed: {
    country() {
      if (!this.nationality || typeof this.nationality !== "string")
        return null;
      if (countries[this.nationality]) return countries[this.nationality];
      const entry = Object.entries(countries).find(
        ([, data]) =>
          data?.name?.toLowerCase() === this.nationality.toLowerCase()
      );
      return entry ? entry[1] : null;
    },
  },
};
</script>

<style scoped>
.el-card {
  height: auto;
  min-height: 52px;
  --el-card-padding: 10px;
}

.el-row {
  display: flex;
  justify-content: left;
  align-items: center;
  min-height: 35.88px;
}

.el-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100px;
}

.custom-tooltip {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #fff;
}
</style>
