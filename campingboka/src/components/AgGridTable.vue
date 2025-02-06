<template>
  <div :class="{ 'hidden-table': !gridReady }" class="ag-theme-alpine">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :rowData="transformedRowData"
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
    const numColumns = 3; // Number of sets of columns (Make, Model, Price)
    const numRows = 14; // Number of rows per column set
    const totalEntries = numColumns * numRows;

    // Generate row data dynamically
    const rawData = Array.from({ length: totalEntries }, (_, i) => ({
      make: ["Toyota", "Ford", "Porsche", "BMW", "Honda"][i % 5],
      model: `Model ${i + 1}`,
      price: Math.floor(Math.random() * (100000 - 20000) + 20000)
    }));

    // Transform data to be structured as 3 columns side by side
    let transformedRowData = Array.from({ length: numRows }, (_, rowIndex) => {
      let row = {};
      for (let col = 0; col < numColumns; col++) {
        let entry = rawData[rowIndex + col * numRows] || {};
        row[`make${col + 1}`] = entry.make;
        row[`model${col + 1}`] = entry.model;
        row[`price${col + 1}`] = entry.price;
      }
      return row;
    });

    // Dynamically generate column definitions
    let columnDefs = [];
    for (let col = 0; col < numColumns; col++) {
      columnDefs.push(
        { headerName: `Make ${col + 1}`, field: `make${col + 1}` },
        { headerName: `Model ${col + 1}`, field: `model${col + 1}` },
        { headerName: `Price ${col + 1}`, field: `price${col + 1}` }
      );
    }

    return {
      columnDefs,
      rowData: rawData,
      transformedRowData,
      gridOptions: {
        pagination: false,
        onGridReady: (params) => {
          params.api.sizeColumnsToFit();
          this.gridReady = true;
        }
      },
      gridReady: false 
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
  height: 638px; /* Increased height to fit all rows */
  width: 100%;
  border-radius: 6px; 
  border: #000000;
}
.ag-theme-alpine .ag-row:nth-child(even) {
  background-color: #d9d9d9; 
}
.hidden-table {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
</style>
