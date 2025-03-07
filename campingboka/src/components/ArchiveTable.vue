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
  name: "App",
  components: {
    AgGridVue, // Add Vue Data Grid component
  },
  setup() {
    // Row Data: The data to be displayed.
    const rowData = ref([
      {
        Plass: 1,
        Bilnummer: "AB12345",
        Nasjonalitet: "Norge",
        Pris: 490,
        Startdato: "03.01.2025",
        Sluttdato: "03.02.2025",
        Betalt: true,
      },
      {
        Plass: 2,
        Bilnummer: "CD67890",
        Nasjonalitet: "Sverige",
        Pris: 980,
        Startdato: "03.02.2025",
        Sluttdato: "03.04.2025",
        Betalt: false,
      },
      {
        Plass: 3,
        Bilnummer: "EF11223",
        Nasjonalitet: "Danmark",
        Pris: 1470,
        Startdato: "03.03.2025",
        Sluttdato: "06.03.2025",
        Betalt: true,
      },
      {
        Plass: 4,
        Bilnummer: "GH44556",
        Nasjonalitet: "Tyskland",
        Pris: 490,
        Startdato: "03.04.2025",
        Sluttdato: "03.05.2025",
        Betalt: false,
      },
      {
        Plass: 5,
        Bilnummer: "IJ77889",
        Nasjonalitet: "Frankrike",
        Pris: 1960,
        Startdato: "03.05.2025",
        Sluttdato: "03.09.2025",
        Betalt: true,
      },
      {
        Plass: 6,
        Bilnummer: "KL99001",
        Nasjonalitet: "Nederland",
        Pris: 980,
        Startdato: "03.06.2025",
        Sluttdato: "03.08.2025",
        Betalt: true,
      },
      {
        Plass: 7,
        Bilnummer: "MN22334",
        Nasjonalitet: "Finland",
        Pris: 490,
        Startdato: "03.07.2025",
        Sluttdato: "03.08.2025",
        Betalt: false,
      },
      {
        Plass: 8,
        Bilnummer: "OP55677",
        Nasjonalitet: "Italia",
        Pris: 1470,
        Startdato: "03.08.2025",
        Sluttdato: "03.11.2025",
        Betalt: true,
      },
      {
        Plass: 9,
        Bilnummer: "QR88990",
        Nasjonalitet: "Spania",
        Pris: 490,
        Startdato: "03.09.2025",
        Sluttdato: "03.10.2025",
        Betalt: false,
      },
      {
        Plass: 10,
        Bilnummer: "ST11245",
        Nasjonalitet: "Polen",
        Pris: 980,
        Startdato: "03.10.2025",
        Sluttdato: "03.12.2025",
        Betalt: true,
      },
      {
        Plass: 11,
        Bilnummer: "UV33456",
        Nasjonalitet: "Sveits",
        Pris: 1470,
        Startdato: "03.11.2025",
        Sluttdato: "03.14.2025",
        Betalt: false,
      },
      {
        Plass: 12,
        Bilnummer: "WX55678",
        Nasjonalitet: "Østerrike",
        Pris: 490,
        Startdato: "03.12.2025",
        Sluttdato: "03.13.2025",
        Betalt: true,
      },
      {
        Plass: 13,
        Bilnummer: "YZ88901",
        Nasjonalitet: "Storbritannia",
        Pris: 1960,
        Startdato: "03.13.2025",
        Sluttdato: "03.16.2025",
        Betalt: false,
      },
      {
        Plass: 14,
        Bilnummer: "AA12367",
        Nasjonalitet: "Irland",
        Pris: 490,
        Startdato: "03.14.2025",
        Sluttdato: "03.15.2025",
        Betalt: true,
      },
      {
        Plass: 15,
        Bilnummer: "BB45678",
        Nasjonalitet: "Belgia",
        Pris: 980,
        Startdato: "03.15.2025",
        Sluttdato: "03.17.2025",
        Betalt: false,
      },
      {
        Plass: 16,
        Bilnummer: "CC78990",
        Nasjonalitet: "Tsjekkia",
        Pris: 1470,
        Startdato: "03.16.2025",
        Sluttdato: "03.19.2025",
        Betalt: true,
      },
      {
        Plass: 17,
        Bilnummer: "DD11234",
        Nasjonalitet: "Ungarn",
        Pris: 980,
        Startdato: "03.17.2025",
        Sluttdato: "03.19.2025",
        Betalt: true,
      },
      {
        Plass: 18,
        Bilnummer: "EE33456",
        Nasjonalitet: "Russland",
        Pris: 490,
        Startdato: "03.18.2025",
        Sluttdato: "03.19.2025",
        Betalt: false,
      },
      {
        Plass: 19,
        Bilnummer: "FF55678",
        Nasjonalitet: "USA",
        Pris: 1960,
        Startdato: "03.19.2025",
        Sluttdato: "03.22.2025",
        Betalt: true,
      },
      {
        Plass: 20,
        Bilnummer: "GG88901",
        Nasjonalitet: "Canada",
        Pris: 490,
        Startdato: "03.20.2025",
        Sluttdato: "03.24.2025",
        Betalt: false,
      },
    ]);

    // Column Definitions: Defines the columns to be displayed.
    const colDefs = ref([
      { field: "Plass" },
      { field: "Bilnummer" },
      { field: "Nasjonalitet" },
      { field: "Pris" },
      {
        field: "Startdato",
        filter: "agDateColumnFilter",
        valueGetter: (params) => new Date(params.data.Startdato), // Konverter til Date
        valueFormatter: (params) =>
          params.value ? params.value.toLocaleDateString("no-NO") : "",
      },
      {
        field: "Sluttdato",
        filter: "agDateColumnFilter",
        valueGetter: (params) => new Date(params.data.Sluttdato),
        valueFormatter: (params) =>
          params.value ? params.value.toLocaleDateString("no-NO") : "",
      },
      { field: "Betalt" },
    ]);

    const width = ref("100%");
    const height = ref("100%");

    /*         const setWidthAndHeight = (w, h) => {
        width.value = w;
        height.value = h;
        }; */
    // Funksjoner for å endre størrelsen
    const fillLarge = () => {
      width.value = "100%";
      height.value = "100%";
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
      rowData,
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
