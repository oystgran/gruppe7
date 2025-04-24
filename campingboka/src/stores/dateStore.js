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
