<template>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height:500px"
    :column-defs="columnDefs"
    :row-data="rowData"
  />
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Registrer alle community-moduler
ModuleRegistry.registerModules([AllCommunityModule]);

// Bruk global grid-konfigurasjon med "legacy"-tema
provideGlobalGridOptions({ theme: "legacy" });

export default {
  name: 'AgGridTable2',
  components: {
    AgGridVue
  },
  setup() {
    return {
      columnDefs: [
        { field: 'make' },
        { field: 'model' },
        { field: 'price' },
      ],
      rowData: [
        { make: 'Vauxhall', model: 'Corsa', price: 17300 },
        { make: 'Ford', model: 'Fiesta', price: 18000 },
        { make: 'Volkswagen', model: 'Golf', price: 26000 },
      ],
    };
  }
};
</script>

<style>
/* Legg til tilpassede stiler om nødvendig */
</style>
