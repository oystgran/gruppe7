<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <input v-model="quickFilter" placeholder="Search..." />
    <div style="flex: 1 1 auto; width: 100%">
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
    <div style="margin-bottom: 5px">
      <button @click="fillLarge">Fill 100%</button>
      <button @click="fillMedium">Fill 60%</button>
      <button @click="fillExact">Exactly 400 x 400 pixels</button>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import {
  ModuleRegistry,
  AllCommunityModule,
  QuickFilterModule, // or AllEnterpriseModule
  DateFilterModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  AllCommunityModule,
  QuickFilterModule, // or AllEnterpriseModule
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
    
    // Column Definitions
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
  { headerName: "Plass", field: "Plass" },         // You already set `Plass` in uppercase in the merge
  { headerName: "Pris", field: "pris" },
  { headerName: "Elektrisitet", field: "elektrisitet" },
  { headerName: "Voksne", field: "voksne" },
  { headerName: "Barn", field: "barn" },
]);

    const width = ref("100%");
    const height = ref("85%");

    const fillLarge = () => {
      width.value = "100%";
      height.value = "85%";
    };

    const fillMedium = () => {
      width.value = "60%";
      height.value = "60%";
    };

    const fillExact = () => {
      width.value = "400px";
      height.value = "400px";
    };
    const quickFilter = ref("");

    return {
      colDefs,
      width,
      height,
      fillLarge,
      fillMedium,
      fillExact,
      quickFilter,
    };
  },
};
</script>

<style>
.ag-theme-alpine {
  width: 100% !important; /* Sikrer at tabellen fyller bredde */
  min-width: 1400px; /* Unngår at den blir for smal */
}
</style>