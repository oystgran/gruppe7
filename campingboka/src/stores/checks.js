// stores/checks.js
import { defineStore } from "pinia";
import { ref } from "vue";
import dayjs from "dayjs";
import { getIdTokenHeader } from "@/tools/firebaseToken";

export const useChecksStore = defineStore("checks", () => {
  const checkedSpots = ref([]);
  const currentDate = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function loadCheckedSpots(selectedDate) {
    if (!selectedDate) return;

    const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");

    if (currentDate.value === dateStr && checkedSpots.value.length > 0) return;

    isLoading.value = true;
    error.value = null;

    try {
      const headers = await getIdTokenHeader();
      const res = await fetch(`/api/checks?date=${dateStr}`, { headers });
      const data = await res.json();
      checkedSpots.value = data.map((row) => row.spot_id);
      currentDate.value = dateStr;
    } catch (err) {
      console.error("❌ Klarte ikke hente checks:", err);
      error.value = "Kunne ikke hente kontrollerte plasser.";
      checkedSpots.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function addCheck(spotId, selectedDate) {
    const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");

    try {
      const headers = await getIdTokenHeader();
      await fetch("/api/checks", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ spot_id: spotId, date: dateStr }),
      });
      if (!checkedSpots.value.includes(spotId)) {
        checkedSpots.value.push(spotId);
      }
    } catch (err) {
      console.error("❌ Klarte ikke legge til sjekk:", err);
    }
  }

  async function removeCheck(spotId, selectedDate) {
    const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");

    try {
      const headers = await getIdTokenHeader();
      await fetch("/api/checks", {
        method: "DELETE",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ spot_id: spotId, date: dateStr }),
      });
      checkedSpots.value = checkedSpots.value.filter((id) => id !== spotId);
    } catch (err) {
      console.error("❌ Klarte ikke fjerne sjekk:", err);
    }
  }

  async function toggleCheck(spotId, selectedDate) {
    if (checkedSpots.value.includes(spotId)) {
      await removeCheck(spotId, selectedDate);
    } else {
      await addCheck(spotId, selectedDate);
    }
  }

  return {
    checkedSpots,
    loadCheckedSpots,
    addCheck,
    removeCheck,
    toggleCheck,
    isLoading,
    error,
  };
});
