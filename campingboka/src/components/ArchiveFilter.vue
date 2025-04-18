<template>
  <div class="filter-container">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      start-placeholder="Startdato"
      end-placeholder="Sluttdato"
      format="DD.MM.YYYY"
      value-format="YYYY-MM-DD"
      unlink-panels
      @change="fetchData"
    />
  </div>
</template>

<script setup>
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:rowData"]);
import { ref, onMounted } from "vue";
import { db } from "../main";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { uniqBy } from "lodash";

const dateRange = ref([]);

const fetchData = async () => {
  if (!dateRange.value || dateRange.value.length < 2) return;

  const [start, end] = dateRange.value;
  const startDate = new Date(start);
  const endDate = new Date(end);

  // 1. Hent overnattinger i datointervall
  const startInsideRange = query(
    collection(db, "Overnattinger"),
    where("innsjekk", ">=", startDate),
    where("innsjekk", "<=", endDate)
  );

  const endInsideRange = query(
    collection(db, "Overnattinger"),
    where("utsjekk", ">=", startDate),
    where("utsjekk", "<=", endDate)
  );
  const staySpanningRange = query(
    collection(db, "Overnattinger"),
    where("innsjekk", "<=", startDate),
    where("utsjekk", ">=", endDate),
    orderBy("innsjekk")
  );

  const startInsideRangeSnapshot = await getDocs(startInsideRange);
  const endInsideRangeSnapshot = await getDocs(endInsideRange);
  const staySpanningRangeSnapshot = await getDocs(staySpanningRange);
  const responseStartInside = startInsideRangeSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const responseEndInside = endInsideRangeSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const responseSpanning = staySpanningRangeSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const combinedResponse = uniqBy(
    [...responseStartInside, ...responseEndInside, ...responseSpanning],
    "id"
  );
  console.table(responseStartInside);
  console.table(responseEndInside);
  console.table(responseSpanning);
  // 2. Hent unike gjestId-er
  const gjestIdSet = new Set(combinedResponse.map((o) => o.gjestId));
  const gjestIds = Array.from(gjestIdSet);
  // 3. Hent gjester i batcher (maks 10 per Firestore-query)
  const gjestMap = new Map();
  const batchSize = 10;

  for (let i = 0; i < gjestIds.length; i += batchSize) {
    const batchIds = gjestIds.slice(i, i + batchSize);

    const gjestQuery = query(
      collection(db, "Gjest"),
      where("__name__", "in", batchIds)
    );
    const gjestSnapshot = await getDocs(gjestQuery);
    for (const gjestDoc of gjestSnapshot.docs) {
      gjestMap.set(gjestDoc.id, gjestDoc.data());
    }
  }

  // 4. Kombiner data + gjest
  const overnattinger = combinedResponse.map((data) => {
    const gjest = gjestMap.get(data.gjestId) || {};
    const combined = {
      ...data, // alle feltene fra Overnattinger
      ...gjest, // alle feltene fra Gjest
      Plass: data.plassId?.[0] ?? "Ukjent",
      Startdato: new Date(data.innsjekk.seconds * 1000),
      Sluttdato: new Date(data.utsjekk.seconds * 1000),
    };
    return combined;
  });
  emit("update:rowData", overnattinger);
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
