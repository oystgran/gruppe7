/*
  archive.js (Pinia store)
  --------------------------------------------------
  Central store for historical booking data:
    • Stores selected date range and search query for filtering archived stays.
    • fetchArchiveStays(): Loads stays from backend and parses check-in/out as Date.
    • setDateRange(): Updates the date filter range in state.
    • setSearchText(): Updates the search filter string.
    • filteredStays: Getter that returns filtered stay data by name, car number, or nationality.
    • Used by ArchiveScreen.vue, ArchiveFilter.vue, ArchiveTable.vue, and ArchiveChart.vue.
*/
import { defineStore } from "pinia";
import dayjs from "dayjs";
import { getIdTokenHeader } from "@/tools/firebaseToken";

export const useArchiveStore = defineStore("archive", {
  state: () => ({
    dateRange: [
      dayjs().subtract(7, "day").format("YYYY-MM-DD"),
      dayjs().format("YYYY-MM-DD"),
    ],
    searchText: "",
    stays: [],
  }),

  actions: {
    async fetchArchiveStays() {
      if (!Array.isArray(this.dateRange) || this.dateRange.length < 2) {
        console.warn("Ugyldig dateRange i fetchArchiveStays:", this.dateRange);
        return;
      }

      const [start, end] = this.dateRange;

      try {
        const headers = await getIdTokenHeader();
        const response = await fetch(
          `/api/stays/archive?start=${start}&end=${end}`,
          { headers }
        );
        const data = await response.json();

        this.stays = data.map((stay) => ({
          ...stay,
          check_in: new Date(stay.check_in),
          check_out: new Date(stay.check_out),
          spot: stay.spot_id ?? "Unknown",
        }));
      } catch (error) {
        console.error("❌ Failed to fetch archive stays:", error);
      }
    },

    setDateRange(range) {
      this.dateRange = range;
    },

    setSearchText(text) {
      this.searchText = text;
    },
  },

  getters: {
    filteredStays: (state) => {
      const term = state.searchText.trim().toLowerCase();
      return state.stays.filter(
        (stay) =>
          stay.name?.toLowerCase().includes(term) ||
          stay.car_number?.toLowerCase().includes(term) ||
          stay.nationality?.toLowerCase().includes(term)
      );
    },
  },
});
