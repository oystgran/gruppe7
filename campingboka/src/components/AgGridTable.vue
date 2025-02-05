<template>
  <div :class="{ 'hidden-table': !gridReady }" class="ag-theme-alpine">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
      class="ag-theme-alpine"
    />
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';  
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

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
      rowData: Array.from({ length: 42 }, (_, i) => ({
        make: ["Toyota", "Ford", "Porsche", "BMW", "Audi"][i % 5],
        model: `Model ${i + 1}`,
        price: Math.floor(Math.random() * (100000 - 20000) + 20000)
      })),
      gridOptions: {
        pagination: true,
        onGridReady: (params) => {
          params.api.sizeColumnsToFit();
          this.gridReady = true; // Tabellen vises når innholdet er klart
        }
      },
      gridReady: false // Start med at tabellen er skjult
    };
  }
};
</script>

<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f9; 
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.app-container {
  background-color: white;
  border-radius: 8px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
  padding: 20px;
  width: 80%;
  max-width: 1200px; 
  overflow: hidden; 
  box-sizing: border-box; 
}

.ag-theme-alpine {
  height: 400px;
  width: 100%;
  border-radius: 6px; 
}
.ag-theme-alpine .ag-row:nth-child(even) {
  background-color: #d9d9d9; 
}
.hidden-table {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
</style>
