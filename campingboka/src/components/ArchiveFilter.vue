<template>
  <div class="filter-container">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      start-placeholder="Start date"
      end-placeholder="End date"
      format="DD.MM.YYYY"
      value-format="YYYY-MM-DD"
      unlink-panels
      @change="fetchData"
    />
  </div>
</template>

<script setup>
/** @type {import('vue').EmitFn} */
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:rowData"]);
import { ref, onMounted } from "vue";
import { useStaysStore } from "@/stores/stays";
import dayjs from "dayjs";

const dateRange = ref([]);
const staysStore = useStaysStore();

const fetchData = async () => {
  if (!dateRange.value || dateRange.value.length < 2) return;

  const [start, end] = dateRange.value.map((d) =>
    dayjs(d).format("YYYY-MM-DD")
  );
  try {
    const stays = await staysStore.fetchStaysInRange(start, end);

    const formattedStays = stays.map((data) => {
      return {
        ...data,
        check_in: new Date(data.start_date),
        check_out: new Date(data.end_date),
        spot: data.spot_id ?? "Unknown",
      };
    });
    console.log("formattedstays: ");
    console.table(formattedStays);
    emit("update:rowData", formattedStays);
  } catch (err) {
    console.error("Error fetching stays in archive:", err);
  }
};

onMounted(() => {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);
  dateRange.value = [
    weekAgo.toISOString().split("T")[0],
    today.toISOString().split("T")[0],
  ];
  fetchData();
});
</script>

<style scoped>
.filter-container {
  display: flex;
  justify-content: flex-start;
  padding: 1rem;
}
</style>
