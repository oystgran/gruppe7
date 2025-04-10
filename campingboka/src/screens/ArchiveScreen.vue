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
        <h2>Statistikk 1</h2>
        <!-- innhold -->
      </div>
      <div class="panel-lower">
        <h2>Statistikk 2</h2>
        <!-- innhold -->
      </div>
    </div>
  </div>
</template>

<script>
import ArchiveFilter from "@/components/ArchiveFilter.vue";
import ArchiveTable from "@/components/ArchiveTable.vue";

export default {
  name: "ArchiveScreen",
  components: {
    ArchiveFilter,
    ArchiveTable,
  },
  data() {
    return {
      filteredData: [],
    };
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