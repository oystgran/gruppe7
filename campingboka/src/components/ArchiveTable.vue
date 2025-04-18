<template>
    <div class="archive-table" style="flex: 1 1 auto; width: 100%; height: calc(100vh - 140px);">
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

ModuleRegistry.registerModules([
  AllCommunityModule,
  DateFilterModule,
]);

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
    headerName: "Startdato",
    field: "Startdato",
    valueGetter: params => new Date(params.data.Startdato),
    valueFormatter: params => params.value ? params.value.toLocaleDateString("no-NO") : "",
  },
  {
    headerName: "Sluttdato",
    field: "Sluttdato",
    valueGetter: params => new Date(params.data.Sluttdato),
    valueFormatter: params => params.value ? params.value.toLocaleDateString("no-NO") : "",
  },
  { headerName: "Navn", field: "navn" },
  { headerName: "Bilnummer", field: "bilnummer" },
  { headerName: "Nasjonalitet", field: "nasjonalitet" },
  { headerName: "Plass", field: "Plass" },
  { headerName: "Pris", field: "pris" },
  { headerName: "Elektrisitet", field: "elektrisitet" },
  { headerName: "Voksne", field: "voksne" },
  { headerName: "Barn", field: "barn" },
]);

    return {
      colDefs
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