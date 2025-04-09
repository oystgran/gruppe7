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
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const emit = defineEmits(["update:rowData"]);
const dateRange = ref([]);

const fetchData = async () => {
  if (!dateRange.value || dateRange.value.length < 2) return;

  const [start, end] = dateRange.value;
  const startDate = new Date(start);
  const endDate = new Date(end);

  const q = query(
    collection(db, "Overnattinger"),
    where("innsjekk", ">=", startDate),
    where("innsjekk", "<=", endDate)
  );

  const snapshot = await getDocs(q);
  const overnattinger = [];

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const gjestRef = doc(db, "Gjest", data.gjestId);
    const gjestSnap = await getDoc(gjestRef);
    const gjest = gjestSnap.exists() ? gjestSnap.data() : {};

    overnattinger.push({
      Plass: data.plassId?.[0] ?? "Ukjent",
      Bilnummer: gjest.bilnummer || "-",
      Nasjonalitet: gjest.nasjonalitet || "-",
      Pris: data.pris,
      Startdato: new Date(data.innsjekk.seconds * 1000),
      Sluttdato: new Date(data.utsjekk.seconds * 1000),
      Betalt: true, // Du kan utvide denne senere
    });
  }

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
