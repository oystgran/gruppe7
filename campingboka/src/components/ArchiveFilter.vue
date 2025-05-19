<!--
  ArchiveFilter.vue
  --------------------------------------------------
  Filter component for archive view:
    • Allows selecting a date range to filter archived stays using Element Plus date picker.
    • Provides a search input to filter guests by name, car number, etc.
    • Syncs date range and search text with Pinia store (`archiveStore`) using watchers.
    • Automatically fetches archive data on first mount if not already loaded.
    • Styled with simple responsive layout and spacing.
-->
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
    <input class="quick-search" v-model="searchText" placeholder="Search..." />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import dayjs from "dayjs";
import { useArchiveStore } from "@/stores/archive";

const archiveStore = useArchiveStore();

const dateRange = ref([...archiveStore.dateRange]);
const searchText = ref(archiveStore.searchText);

// Only fetch first time if no data is present
onMounted(async () => {
  if (!dateRange.value.length) {
    const today = dayjs();
    const lastWeek = today.subtract(7, "day");
    dateRange.value = [
      lastWeek.format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    ];
  }

  archiveStore.setDateRange(dateRange.value);

  if (archiveStore.stays.length === 0) {
    await archiveStore.fetchArchiveStays();
  }
});

watch(dateRange, async (val, oldVal) => {
  if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
    archiveStore.setDateRange(val);
    await archiveStore.fetchArchiveStays();
  }
});

watch(searchText, (val) => {
  archiveStore.setSearchText(val);
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
