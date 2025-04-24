<template>
  <div class="archive-screen">
    <div class="archive-panel">
      <div class="search">
        <ArchiveFilter
          @update:rowData="filteredData = $event"
          @update:search="searchText = $event"
        />
      </div>
      <div class="table">
        <ArchiveTable :rowData="filteredData" :quickFilterText="searchText" />
      </div>
    </div>
    <div class="stat-panel">
      <div class="panel-upper">
        <h3>Guests by nationality</h3>
        <ArchiveChart
          :chartData="nationalityData"
          :chartOptions="nationalityOptions"
          chartType="pie"
        />
      </div>
      <div class="panel-lower">
        <h3>Electricity usage</h3>
        <ArchiveChart
          :chartData="electricityData"
          :chartOptions="electricityOptions"
          chartType="doughnut"
        />
      </div>
      <el-button
        type="success"
        plain
        size="small"
        icon="Download"
        class="export-btn"
        @click="exportNationalityCSV"
      >
        Export CSV
      </el-button>
    </div>
  </div>
</template>

<script>
import ArchiveFilter from "@/components/ArchiveFilter.vue";
import ArchiveTable from "@/components/ArchiveTable.vue";
import ArchiveChart from "@/components/ArchiveChart.vue";

export default {
  components: {
    ArchiveFilter,
    ArchiveTable,
    ArchiveChart,
  },
  data() {
    return {
      filteredData: [],
      searchText: "",
    };
  },
  methods: {
    exportNationalityCSV() {
      const counts = {};
      this.filteredData.forEach((row) => {
        const country = row.nationality || "Unknown";
        counts[country] = (counts[country] || 0) + 1;
      });

      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Nationality,Count\n" +
        Object.entries(counts)
          .map(([country, count]) => `${country},${count}`)
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "nationalities.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
  computed: {
    nationalityData() {
      const counts = {};
      this.filteredData.forEach((row) => {
        const country = row.nationality || "Unknown";
        counts[country] = (counts[country] || 0) + 1;
      });

      return {
        labels: Object.keys(counts),
        datasets: [
          {
            label: "Guests by nationality",
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

    electricityData() {
      const counts = { Yes: 0, No: 0 };
      this.filteredData.forEach((row) => {
        const used = row.electricity ? "Yes" : "No";
        counts[used]++;
      });

      return {
        labels: ["Used electricity", "No electricity"],
        datasets: [
          {
            label: "Electricity usage",
            data: [counts["Yes"], counts["No"]],
            backgroundColor: ["#4CAF50", "#F44336"],
          },
        ],
      };
    },

    electricityOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      };
    },

    nationalityOptions() {
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
}

.table {
  width: 100%;
}
</style>
