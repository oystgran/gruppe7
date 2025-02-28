<template>
    <!-- The AG Grid component -->
    <ag-grid-vue
        :rowData="rowData"
        :columnDefs="colDefs"
        style="height: 500px"
    >
    </ag-grid-vue>
</template>
  
  <script>
  /* import { AgGridVue } from "ag-grid-vue3";
  import "ag-grid-community/styles/ag-grid.css";
  import "ag-grid-community/styles/ag-theme-alpine.css";
  import AddNewRenderer from "./AddNewRenderer.vue";
  import { AllCommunityModule, ModuleRegistry, themeAlpine } from "ag-grid-community"; */
  import { AgGridVue } from "ag-grid-vue3";
  import { ref } from 'vue';
  import {
    ModuleRegistry,
    AllCommunityModule, // or AllEnterpriseModule
} from 'ag-grid-community';

  ModuleRegistry.registerModules([
    AllCommunityModule, // or AllEnterpriseModule
]);

  export default 
  {
    name: "App",
    components: 
    {
        AgGridVue, // Add Vue Data Grid component
    },
    setup() 
    {
    // Row Data: The data to be displayed.
        const rowData = ref([
            { make: "Tesla", model: "Model Y", price: 64950, electric: true },
            { make: "Ford", model: "F-Series", price: 33850, electric: false },
            { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        ]);

        // Column Definitions: Defines the columns to be displayed.
        const colDefs = ref([
            { field: "make" },
            { field: "model" },
            { field: "price" },
            { field: "electric" }
        ]);

        return {
            rowData,
            colDefs,
        };
    },
};
  </script>

  <style>

  </style>
  