<!--
  ArchiveTable.vue
  --------------------------------------------------
  Component for displaying archived stays in a data grid:
    • Uses AG Grid to show stay data with columns like name, car number, dates, and price.
    • Applies Norwegian date formatting to check-in and check-out columns.
    • Supports pagination and quick filtering via `quickFilterText` prop.
    • Dynamically receives `rowData` from parent and renders full-height responsive table.
    • Styled with AG Grid Alpine theme and adjusts to viewport height.
-->
<template>
  <div class="archive-table-wrapper">
    <div
      class="archive-table"
      style="flex: 1 1 auto; width: 100%; height: calc(100vh - 140px)"
    >
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="colDefs"
        class="ag-theme-alpine"
        :quickFilterText="quickFilterText"
        :pagination="true"
        style="width: 100%; height: 100%"
      />
    </div>
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
const quickFilter = ref("");
export default {
  name: "ArchiveTable",
  props: {
    rowData: {
      type: Array,
      default: () => [],
    },
    quickFilterText: {
      type: String,
      default: "",
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
      quickFilter,
    };
  },
};
</script>

<style>
.ag-theme-alpine {
  width: 100% !important;
  height: 100% !important;
}
.quick-search {
  padding: 10px;
  text-align: right;
}
.quick-search-input {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  max-width: 300px;
}
</style>
