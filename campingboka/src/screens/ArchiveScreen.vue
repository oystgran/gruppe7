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

      <div class="panel-middle">
     <h3>Average persons per visit</h3>
     <ArchiveChart
       :chartData="avgPartyData"
       :chartOptions="avgPartyOptions"
       chartType="bar"
     />
   </div>

      <!--div class="panel-lower">
        <h3>Electricity usage</h3>
        <ArchiveChart
          :chartData="electricityData"
          :chartOptions="electricityOptions"
          chartType="doughnut"
        />
      </div-->
      <div class="panel-lower">
        <h3>Average length of stay</h3>
        <ArchiveChart
          :chartData="lengthData"
          :chartOptions="lengthOptions"
          chartType="bar"
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
        Download CSV
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
      dateRange: {
        start: null,
        end: null,
      },
    };
  },
  methods: {
    exportNationalityCSV() {
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const guestDaysByCountry = {};
      const dates = [];

      this.filteredData.forEach((row) => {
        const country = row.nationality || "Unknown";
        const ci = new Date(row.check_in);
        ci.setHours(0, 0, 0, 0);
        const co = new Date(row.check_out);
        co.setHours(0, 0, 0, 0);
        dates.push(ci, co);
        const nights = (co - ci) / MS_PER_DAY;
        const persons = (row.adults || 0) + (row.children || 0);
        const guestDays = nights * persons;
        guestDaysByCountry[country] = (guestDaysByCountry[country] || 0) + guestDays;

      });

      const sortedCountries = Object.keys(guestDaysByCountry).sort();
      const csvRows = [];
      csvRows.push(["COUNTRIES", "GUEST DAYS"]);
      sortedCountries.forEach((country) => {
        csvRows.push([country, guestDaysByCountry[country]]);
      });

      const bom = "\uFEFF";
      const csvContent = bom + csvRows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\r\n");

      let from = "start", to = "end";
      if (dates.length) {
        dates.sort((a, b) => a - b);
        const formatLocal = (d) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
        };
        from = formatLocal(dates[0]);
        to = formatLocal(dates[dates.length - 1]);
      }
      const filename = `guestdays_${from}_to_${to}.csv`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

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
    avgPartyData() {
     const total = this.filteredData.length;
     const sumAdults = this.filteredData.reduce(
       (sum, row) => sum + (row.adults || 0),
       0
     );
     const sumChildren = this.filteredData.reduce(
       (sum, row) => sum + (row.children || 0),
       0
     );
     const avgAdults = total ? +(sumAdults / total).toFixed(2) : 0;
     const avgChildren = total ? +(sumChildren / total).toFixed(2) : 0;

     return {
       labels: ["Adults", "Children"],
       datasets: [
         {
           label: "Average per stay",
           data: [avgAdults, avgChildren],
           backgroundColor: ["#36A2EB", "#FF6384"],
         },
       ],
     };
   },

   avgPartyOptions() {
     return {
       responsive: true,
       plugins: {
         legend: { display: false },
       },
       scales: {
         y: {
           beginAtZero: true,
           title: { display: true, text: "Average count" },
         },
       },
     };
   },
   lengthData() {
      const total = this.filteredData.length;
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const sumDays = this.filteredData.reduce((sum, row) => {
        const ci = new Date(row.check_in);
        ci.setHours(0, 0, 0, 0);
        const co = new Date(row.check_out);
        co.setHours(0, 0, 0, 0);
        const diffDays = (co - ci) / MS_PER_DAY;
        return sum + diffDays;
      }, 0);
      const avgDays = total ? +(sumDays / total).toFixed(2) : 0;

      return {
        labels: ["Average stay (days)"],
        datasets: [
          {
            label: "Average length",
            data: [avgDays],
            backgroundColor: ["#FFCE56"],
          },
        ],
      };
    },

    lengthOptions() {
      return {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Days" },
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
.panel-middle,
.panel-lower {
  flex: 1 1 50%;
  overflow: auto;
  padding: 10px;
}

.panel-upper {
  border-bottom: 1px solid #ccc;
}

.panel-middle {
  border-bottom: 1px solid #ccc;
}

.search {
}

.table {
  width: 100%;
}
</style>
