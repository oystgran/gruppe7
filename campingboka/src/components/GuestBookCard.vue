<template>
  <el-card shadow="hover">
    <el-row :gutter="30">
      <el-col :span="2">{{ spot }}</el-col>
      <el-col :span="6" style="font-weight: bold">
        <div class="car-number-wrapper">
          <slot name="car_number" />
          <el-tag
            v-if="vip"
            type="warning"
            effect="dark"
            size="small"
            class="vip-badge"
          >
            🌟 VIP
          </el-tag>
        </div>
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
      <el-col :span="2" class="price-col">
        <div class="price-wrapper">
          <span>{{ price ? Math.round(price) : "" }}</span>
        </div>
      </el-col>
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
    vip: Boolean,
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
.car-number-wrapper {
  position: relative;
  display: flex;
  display: inline-block;
  padding-left: 18px;
  width: 100%;
}

.vip-badge {
  position: absolute;
  top: 0px;
  left: -25px;
  font-size: 10px;
  padding: 0 6px;
  line-height: 1;
  white-space: nowrap;
}
</style>
