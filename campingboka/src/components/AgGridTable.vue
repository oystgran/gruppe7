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
import { AllCommunityModule, ModuleRegistry} from 'ag-grid-community';

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Mark all grids as using legacy themes
//provideGlobalGridOptions({ theme: "legacy"});

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
#app {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f9; /* Light background color for contrast */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.app-container {
  background-color: white;
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  padding: 20px;
  width: 80%;
  max-width: 1200px; /* Max width for large screens */
  overflow: hidden; /* Hide any overflowing content */
  box-sizing: border-box; /* Ensure padding doesn't affect width */
}

.ag-theme-alpine {
  height: 400px;
  width: 100%;
  border-radius: 6px; /* Rounded corners for the grid */
}
</style>
