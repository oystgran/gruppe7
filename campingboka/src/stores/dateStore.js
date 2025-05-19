/*
  date.js (Pinia store)
  --------------------------------------------------
  Store for managing globally selected date:
    • selectedDate: Holds the currently selected date as a Date object.
    • setDate(): Updates the selected date.
    • Used across components to keep date selection in sync (e.g. BookScreen, MapScreen).
*/
import { defineStore } from "pinia";

export const useDateStore = defineStore("date", {
  state: () => ({
    selectedDate: new Date(),
  }),
  actions: {
    setDate(date) {
      this.selectedDate = date;
    },
  },
});
