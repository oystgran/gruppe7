import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { keyBy } from "lodash";
import dayjs from "dayjs";

export const useStaysStore = defineStore("stays", () => {
  const count = ref(0);
  const bookingsToday = ref({});
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  async function loadGuests(selectedDate) {
    if (!selectedDate) return;

    const dateObj =
      selectedDate.value instanceof Date ? selectedDate.value : selectedDate;
    if (isNaN(dateObj)) {
      console.warn("Invalid date in loadGuests:", selectedDate);
      return;
    }

    const date = dayjs(dateObj).format("YYYY-MM-DD");

    const res = await fetch(`/api/stays?date=${date}`);
    const stays = await res.json();

    bookingsToday.value = { ...keyBy(stays, (stay) => stay.spot_id) };
    console.log("bookingstoday:", bookingsToday.value);
  }
  async function addGuest(guestData, stayData) {
    // Sjekk om gjest finnes først
    const searchRes = await fetch(`/api/guests/search?query=${guestData.name}`);
    const matches = await searchRes.json();

    const existing = matches.find(
      (g) =>
        g.name.toLowerCase() === guestData.name.toLowerCase() &&
        g.car_number.toLowerCase() === guestData.car_number.toLowerCase()
    );

    const payload = {
      guest: guestData,
      stay: stayData,
    };

    if (existing) {
      payload.guestId = existing.id; // legg til guestId hvis den finnes
    }

    const res = await fetch("/api/stays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to add guest and stay");
  }

  async function updateGuest(gjestId, guestData, stayId, stayData) {
    const res = await fetch(`/api/stays/${stayId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestId: gjestId,
        guest: guestData,
        stay: stayData,
      }),
    });

    if (!res.ok) throw new Error("Failed to update guest and stay");

    const updatedStay = {
      id: stayId,
      guest_id: gjestId,
      name: guestData.name,
      car_number: guestData.car_number,
      nationality: guestData.nationality,
      ...stayData,
    };

    bookingsToday.value = {
      ...bookingsToday.value,
      [stayData.spotId]: updatedStay,
    };
  }

  async function deleteGuest(gjestId, stayId) {
    const res = await fetch(`/api/stays/${stayId}?guestId=${gjestId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete guest or stay");
  }

  async function fetchStaysInRange(start, end) {
    const res = await fetch(`/api/stays/archive?start=${start}&end=${end}`);
    if (!res.ok) throw new Error("Failed to fetch stays in archive");
    return await res.json();
  }

  return {
    count,
    doubleCount,
    increment,
    loadGuests,
    addGuest,
    updateGuest,
    deleteGuest,
    bookingsToday,
    fetchStaysInRange,
  };
});
