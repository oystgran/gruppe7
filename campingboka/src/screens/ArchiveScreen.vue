<template>
  <div class="archive-screen">
    <div class="archive-panel">
      <div class="search">
        <ArchiveFilter @update:rowData="filteredData = $event" />
      </div>
      <div class="table">
        <ArchiveTable :rowData="filteredData" />
      </div>
    </div>
    <div class="stat-panel">
      <div class="panel-upper">
        <h3>Gjester per nasjonalitet</h3>
        <ArchiveChart
          :chartData="nasjonalitetsData"
          :chartOptions="nasjonalitetsOptions"
          chartType="pie"
        />
      </div>
      <div class="panel-lower">
        <h3>Statistikk 2</h3>
        <ArchiveChart
          :chartData="elektrisitetData"
          :chartOptions="elektrisitetOptions"
          chartType="doughnut"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ArchiveFilter from "@/components/ArchiveFilter.vue";
import ArchiveTable from "@/components/ArchiveTable.vue";
import ArchiveChart from "@/components/ArchiveChart.vue"; // 👈 Legg til denne

export default {
  components: {
    ArchiveFilter,
    ArchiveTable,
    ArchiveChart,
  },
  data() {
    return {
      filteredData: [],
    };
  },
  computed: {
    nasjonalitetsData() {
      const counts = {};
      this.filteredData.forEach((row) => {
        const land = row.nasjonalitet || "Ukjent";
        counts[land] = (counts[land] || 0) + 1;
      });

      return {
        labels: Object.keys(counts),
        datasets: [
          {
            label: "Antall gjester per nasjonalitet",
            data: Object.values(counts),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#8E44AD",
              "#2ECC71",
              "#F39C12",
              "#3498DB",
              "#E74C3C",
              "#1ABC9C",
              "#95A5A6",
            ],
          },
        ],
      };
    },

    elektrisitetData() {
      const counts = { Ja: 0, Nei: 0 };
      this.filteredData.forEach((row) => {
        const brukt = row.elektrisitet ? "Ja" : "Nei";
        counts[brukt]++;
      });

      return {
        labels: ["Brukt strøm", "Ikke brukt strøm"],
        datasets: [
          {
            label: "Elektrisitetsbruk",
            data: [counts["Ja"], counts["Nei"]],
            backgroundColor: ["#4CAF50", "#F44336"],
          },
        ],
      };
    },

    elektrisitetOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      };
    },

    nasjonalitetsOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      };
    },
  },
};
</script>

<style scoped>
.archive-screen {
  display: flex;
  gap: 20px;
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  max-height: 100%;

  padding-top: 10px;
  overflow-y: auto;
}

.archive-panel {
  flex: 1;
  overflow: auto;
}

.stat-panel {
  width: 250px;
  flex-shrink: 0;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-upper,
.panel-lower {
  flex: 1 1 50%;
  overflow: auto;
  padding: 10px;
}
.panel-upper {
  border-bottom: 1px solid #ccc;
}

.search {
  margin-bottom: 15px;
}

.table {
  width: 100%;
}
</style>
