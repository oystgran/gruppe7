<template>
  <button @click="deselectRows">deselect rows</button>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height:500px"
    :column-defs="columnDefs"
    :row-data="rowData"
    :defaultColDef="defaultColDef"
    rowSelection="rowSelection"
    animateRows="true"
    @cell-clicked="cellWasClicked"
    @grid-ready="onGridReady"
  />
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import { ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { reactive, onMounted, ref } from 'vue';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Registrer alle community-moduler
ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default {
  name: 'AgGridTable2',
  components: {
    AgGridVue
  },
  setup() {
    // Definerer reactive objekter

    const gridApi = ref(null)

    const onGridReady = params => {
      gridApi.value = params.api
    }

    const rowData = reactive([]);
    const columnDefs = [
      { field: "make" },
      { field: "model" },
      { field: "price" }
    ];

    const defaultColDef = {
      sortable: true,
      filter: true,
    };

    // Henter data ved onMounted
    onMounted(() => {
      fetch("https://www.ag-grid.com/example-assets/row-data.json")
        .then((result) => result.json())
        .then((remoteRowData) => {
          rowData.splice(0, rowData.length, ...remoteRowData);
        });
    });

    return { 
      onGridReady,
      columnDefs, 
      rowData, 
      defaultColDef,
      cellWasClicked: event=>{
        console.log('cell was clicked', event)
      },
      deselectRows: () => {
        gridApi.value.deselectAll();
      }
     };
  }
};
</script>

<style>
/* Legg til tilpassede stiler om nødvendig */
</style>
