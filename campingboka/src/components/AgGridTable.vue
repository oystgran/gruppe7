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
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default {
  name: "AgGridTable",
  components: {
    AgGridVue,
  },
  data() {
    const numColumns = 3; // Number of sets of columns (Make, Model, Price)
    const numRows = 14; // Number of rows per column set
    const totalEntries = numColumns * numRows;

    // Generate row data dynamically
    const rawData = Array.from({ length: totalEntries }, (_, i) => ({
      make: ["Toyota", "Ford", "Porsche", "BMW", "Honda"][i % 5],
      model: `Model ${i + 1}`,
      price: Math.floor(Math.random() * (100000 - 20000) + 20000),
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

    // Dynamically generate column definitions with styles
    let columnDefs = [];
    for (let col = 0; col < numColumns; col++) {
      columnDefs.push(
        { headerName: `Make ${col + 1}`, field: `make${col + 1}`, cellClass: `column-${col + 1}` },
        { headerName: `Model ${col + 1}`, field: `model${col + 1}`, cellClass: `column-${col + 1}` },
        { headerName: `Price ${col + 1}`, field: `price${col + 1}`, cellClass: `column-${col + 1}` }
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
        },
        rowClassRules: {
        "row-even": (params) => params.node.rowIndex % 2 === 0,  // Even rows
        "row-odd": (params) => params.node.rowIndex % 2 !== 0,  // Odd rows
        "highlight-row": (params) => params.node.rowIndex === 3  // Example: 4th row highlighted
  }
      },
      gridReady: false,
    };
  },
};
</script>

<style scoped>
#app {
  font-family: "Arial", sans-serif;
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
}

.ag-theme-alpine .ag-row:nth-child(even) {
  background-color: #d9d9d9;
}

.hidden-table {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

:deep(.ag-theme-alpine .column-1) {
  background-color: #E9E9E9 !important; 
  font-weight: bold;
}
:deep(.ag-theme-alpine .column-2) {
  background-color: #E9E9E9 !important;
}
:deep(.ag-theme-alpine .column-3) {
  background-color: #E9E9E9 !important;
  text-align: center;
}
/* Every even row */
:deep(.ag-theme-alpine .row-even) {
  background-color: #E9E9E9 !important; /* Light blue */
}

/* Every odd row */
:deep(.ag-theme-alpine .row-odd) {
  background-color: #E9E9E9 !important; /* Light gray */
}

/* Example: Highlight a specific row */
:deep().ag-theme-alpine .highlight-row {
  background-color: #ffd90000 !important; /* Gold */
  font-weight: bold;
}
</style>
