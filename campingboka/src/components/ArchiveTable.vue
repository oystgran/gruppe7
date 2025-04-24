<template>
  <div
    class="archive-table"
    style="flex: 1 1 auto; width: 100%; height: calc(100vh - 140px)"
  >
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      class="ag-theme-alpine"
      :quickFilterText="quickFilter"
      :style="{ width, height }"
      :pagination="true"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import {
  ModuleRegistry,
  AllCommunityModule,
  DateFilterModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule, DateFilterModule]);

export default {
  name: "ArchiveTable",
  props: {
    rowData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    AgGridVue,
  },
  emits: ["update:rowData"],
  setup() {
    const colDefs = ref([
      {
        headerName: "Check-in Date",
        field: "Startdato",
        valueFormatter: ({ value }) =>
          value ? new Date(value).toLocaleDateString("no-NO") : "",
      },
      {
        headerName: "Check-out Date",
        field: "Sluttdato",
        valueFormatter: ({ value }) =>
          value ? new Date(value).toLocaleDateString("no-NO") : "",
      },
      { headerName: "Name", field: "name" },
      { headerName: "Car Number", field: "car_number" },
      { headerName: "Nationality", field: "nationality" },
      { headerName: "Spot", field: "spot" },
      { headerName: "Price", field: "price" },
      { headerName: "Electricity", field: "electricity" },
      { headerName: "Adults", field: "adults" },
      { headerName: "Children", field: "children" },
    ]);

    return {
      colDefs,
    };
  },
};
</script>

<style>
.ag-theme-alpine {
  width: 100% !important;
  height: 100% !important;
}
</style>
