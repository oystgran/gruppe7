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
    <input
      class="quick-search"
      v-model="searchText"
      @input="emit('update:search', searchText)"
      placeholder="Search..."
    />
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import { useStaysStore } from "@/stores/stays";

const emit = defineEmits(["update:rowData", "update:search"]);

const dateRange = ref([]);
const searchText = ref("");
const staysStore = useStaysStore();

const fetchData = async () => {
  if (!dateRange.value || dateRange.value.length < 2) return;

  const [start, end] = dateRange.value.map((d) =>
    dayjs(d).format("YYYY-MM-DD")
  );

  try {
    const stays = await staysStore.fetchStaysInRange(start, end);
    const formatted = stays.map((data) => ({
      ...data,
      check_in: new Date(data.check_in),
      check_out: new Date(data.check_out),
      spot: data.spot_id ?? "Unknown",
    }));

    emit("update:rowData", formatted);
  } catch (err) {
    console.error("Failed to fetch stays for archive:", err);
  }
};

onMounted(() => {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  dateRange.value = [
    lastWeek.toISOString().split("T")[0],
    today.toISOString().split("T")[0],
  ];
  fetchData();
});
</script>

<style scoped>
.filter-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
}

.quick-search {
  flex: 1;
  max-width: 200px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
