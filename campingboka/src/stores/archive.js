// stores/archive.js
import { defineStore } from "pinia";
import dayjs from "dayjs";

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
      const [start, end] = this.dateRange;
      try {
        const res = await fetch(`/api/stays/archive?start=${start}&end=${end}`);
        if (!res.ok) throw new Error("Failed to fetch archive stays");

        const data = await res.json();

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
