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
import { AllCommunityModule, ModuleRegistry, themeAlpine } from "ag-grid-community";

// Register AG Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Define Custom Styling for Alpine Theme
const myTheme = themeAlpine.withParams({
  headerFontSize:16,
  headerBackgroundColor: "#cac9c9",
  borderColor: "#9696C8", // Custom border color
  wrapperBorder: false,
  headerRowBorder: false,
  rowBorder: { style: "solid", color: "black" },
  /* columnBorder: { style: "solid", }, */ // Disable default column borders
});

export default {
  name: "AgGridTable",
  components: {
    AgGridVue,
  },
  data() {
    const numColumns = 3; // Number of column sets (Bilnummer, Pris, Nasjonalitet)
const numRows = 14; // Number of rows
//const totalPlaces = numColumns * numRows; // Total places (42)

let transformedRowData = Array.from({ length: numRows }, (_, rowIndex) => {
  let row = {};
  for (let col = 0; col < numColumns; col++) {
    let placeNumber = rowIndex + 1 + col * numRows; // Distribute numbers row-first
    row[`plass${col + 1}`] = placeNumber; // Assign the place number
    row[`bilnummer${col + 1}`] = "";
    row[`pris${col + 1}`] = "";
    row[`nasjonalitet${col + 1}`] = "";
  }
  return row;
});

    // Dynamically generate column definitions
    let columnDefs = [];
    for (let col = 0; col < numColumns; col++) {
      columnDefs.push(
        { headerName: "Plass", field: `plass${col + 1}`, cellClass: `column-${col + 1}`, editable: false },
        { headerName: "Bilnummer", field: `bilnummer${col + 1}`, cellClass: `column-${col + 1}`, editable: true },
        { headerName: "Pris", field: `pris${col + 1}`, cellClass: `column-${col + 1}`, editable: true },
        { headerName: "Nasjonalitet", field: `nasjonalitet${col + 1}`, cellClass: "nationality-border", editable: true }
      );
    }

    return {
      columnDefs,
      transformedRowData,
      gridOptions: {
        domLayout: "autoHeight",
        rowHeight: 60,
        theme: myTheme, // Apply Custom Alpine Theme
        pagination: false,
        onGridReady: (params) => {
          params.api.sizeColumnsToFit();
          this.gridReady = true;
        },
        rowClassRules: {
          "row-even": (params) => params.node.rowIndex % 2 === 0, // Even rows
          "row-odd": (params) => params.node.rowIndex % 2 !== 0, // Odd rows
          "highlight-row": (params) => params.node.rowIndex === 3, // Highlight 4th row
        },
        cellClassRules: {
  "nationality-border": (params) => {
    // Get column ID (e.g., "nasjonalitet1", "nasjonalitet2", etc.)
    const colId = params.column.getColId();

    // Only apply the border if it's "nasjonalitet1" or "nasjonalitet2"
    return colId === "nasjonalitet1" || colId === "nasjonalitet2";
  },
},
      },
      gridReady: false,
    };
  },
};
</script>

<style scoped>
/* Page Container */
/* #app {
  font-family: "Arial", sans-serif;
  background-color: #f4f4f9;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
} */

/* .app-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 80%;
  max-width: 1200px;
  overflow: hidden;
  box-sizing: border-box;
}
 */
/* AG Grid Alpine Theme Customization */
.ag-theme-alpine {
  height: 638px;
  width: 100%;
  border-radius: 6px;
}

/* Custom Styling for Rows */
:deep(.ag-theme-alpine .ag-row) {
  /* border-bottom: 1px solid #ccc; */
}

/* Apply Borders to Every Third Column */
/* :deep(.ag-theme-alpine .column-3) {
   border-right: 3px solid #32a1ce !important; 
} */

/* Even Row Styling */
:deep(.ag-theme-alpine .row-even) {
  background-color: #E9E9E9 !important;
}

/* Odd Row Styling */
:deep(.ag-theme-alpine .row-odd) {
  background-color: #cac9c9 !important;
}

/* Highlighted Row */
:deep(.ag-theme-alpine .highlight-row) {
/*   background-color: yellow !important;
  font-weight: bold; */
}
/* Apply Borders to Every Third Column */
:deep(.ag-theme-alpine .third-column-border) {
  border-right: 3px solid #32a1ce !important;
}
/* Apply Borders to Only the First Two 'Nasjonalitet' Columns */
:deep(.ag-theme-alpine .nationality-border:not([col-id="nasjonalitet3"])) {
  border-right: 3px solid #a7a7a7 !important;
}
</style>
