/*
  stays.js (Pinia store)
  --------------------------------------------------
  Store for managing current and historical guest bookings:
    • loadGuests(): Loads bookings for a given date, with caching unless forceReload is true.
    • addGuest(): Adds a new guest and stay, or reuses existing guest if matched by name and car number.
    • updateGuest(): Updates guest and stay data for a given stay ID.
    • deleteGuest(): Deletes a guest and their associated stay.
    • fetchStaysInRange(): Fetches stays for a specified date range (used in archive).
    • Stores bookingsToday keyed by spot ID, with metadata for current date.
    • Provides helper values like `allSpots`, `count`, and `doubleCount`.
    • Used across BookScreen, MapScreen, GuestModal, Archive, and Dashboard components.
*/
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { keyBy } from "lodash";
import dayjs from "dayjs";
import { getIdTokenHeader } from "@/tools/firebaseToken";

export const useStaysStore = defineStore("stays", () => {
  const count = ref(0);
  const bookingsToday = ref({});
  const doubleCount = computed(() => count.value * 2);

  const allSpots = computed(() => Array.from({ length: 42 }, (_, i) => i + 1));

  function increment() {
    count.value++;
  }

  async function loadGuests(selectedDate, forceReload = false) {
    if (!selectedDate) return;

    const dateObj =
      selectedDate.value instanceof Date ? selectedDate.value : selectedDate;
    if (isNaN(dateObj)) {
      console.warn("Invalid date in loadGuests:", selectedDate);
      return;
    }

    const date = dayjs(dateObj).format("YYYY-MM-DD");
    if (
      !forceReload &&
      bookingsToday.value.__date === date &&
      Object.keys(bookingsToday.value).length > 1 // minst én booking (pluss __date)
    ) {
      console.log("✅ Bruker cache for", date);
      return;
    }

    const headers = await getIdTokenHeader();

    const res = await fetch(`/api/stays?date=${date}`, { headers });
    const stays = await res.json();

    bookingsToday.value = {
      ...keyBy(stays, (stay) => stay.spot_id),
      __date: date, // merk datoen dataen gjelder for
    };

    console.log("📡 Hentet nye bookinger:", bookingsToday.value);
  }
  async function addGuest(guestData, stayData) {
    const headers = await getIdTokenHeader();
    const searchRes = await fetch(
      `/api/guests/search?query=${guestData.name}`,
      { headers }
    );
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
      payload.guestId = existing.id;
    }

    const res = await fetch("/api/stays", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.warn("Feil fra backend:", errorData);
      const message = errorData.error || "Failed to add guest and stay";
      throw new Error(message);
    }
  }

  async function updateGuest(gjestId, guestData, stayId, stayData) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`/api/stays/${stayId}`, {
      method: "PUT",
      headers,
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
    const headers = await getIdTokenHeader();
    const res = await fetch(`/api/stays/${stayId}?guestId=${gjestId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete guest or stay");
  }

  async function fetchStaysInRange(start, end) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`/api/stays/archive?start=${start}&end=${end}`, {
      headers,
    });
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
    allSpots,
  };
});
