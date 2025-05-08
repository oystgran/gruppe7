<template>
  <el-card shadow="hover">
    <el-row :gutter="30">
      <el-col :span="2">{{ spot }}</el-col>
      <el-col :span="2" class="vip-col">
        <el-tag
          v-if="vip"
          type="warning"
          effect="dark"
          size="small"
          class="vip-badge"
        >
          <span class="vip-icon">🌟</span>
          <span class="vip-text">VIP</span>
        </el-tag>
      </el-col>

      <el-col :span="6" style="font-weight: bold">
        <div class="car-number-wrapper">
          <slot name="car_number" />
        </div>
      </el-col>
      <el-col :span="2" style="display: flex; align-items: center; gap: 6px">
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
      <el-col :span="3">{{ checkIn }}</el-col>
      <el-col :span="3">{{ checkOut }}</el-col>
      <el-col :span="3" class="price-col">
        <div class="price-wrapper">
          <span>{{ price ? Math.round(price) + ",-" : "" }}</span>
        </div>
      </el-col>
      <el-col :span="1" class="check-col">
        <el-checkbox
          class="custom-check"
          :model-value="checked"
          @click.stop
          @change="$emit('toggleCheck')"
          :style="{
            '--el-color-primary': '#394856',
          }"
        />
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
    checked: Boolean,
  },
  methods: {
    handleClick(event) {
      this.$emit("toggleCheck");

      const ripple = this.$refs.ripple;
      if (!ripple) return;

      ripple.classList.remove("show");

      const rect = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = event.clientX - rect.left - size / 2 + "px";
      ripple.style.top = event.clientY - rect.top - size / 2 + "px";

      // Trigger animation
      requestAnimationFrame(() => {
        ripple.classList.add("show");
      });
    },
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
.car-number {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
  flex: 1;
}
.car-number-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  /*  padding-left: 10px; */
  overflow: hidden;
}

.car-number-wrapper span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
}

.vip-badge {
  font-size: 9px;
  padding: 0 4px;
  height: 14px;
  line-height: 14px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 2px;
  width: fit-content;
  max-width: 80px;
  margin-left: 10px;
}

.vip-text {
  display: inline;
}

@media (max-width: 600px) {
  .vip-text {
    display: none;
  }
}
.vip-col {
  padding: 0 !important;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.checkmark-col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.el-checkbox {
  transform: scale(1.6);

  margin-left: 5px;
}
</style>
