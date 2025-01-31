<template>
  <div class="ag-theme-alpine" style="height: 400px; width: 100%">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
      class="ag-theme-alpine"
    />
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';  // Use ag-grid-vue3 for Vue 3
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Mark all grids as using legacy themes
provideGlobalGridOptions({ theme: "legacy"});

export default {
  name: "AgGridTable",
  components: {
    AgGridVue
  },
  data() {
    return {
      columnDefs: [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" }
      ],
      rowData: [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 }
      ],
      gridOptions: {
        pagination: true
      }
    };
  }
};
</script>

<style scoped>
/* You can add custom styles here */
</style>
