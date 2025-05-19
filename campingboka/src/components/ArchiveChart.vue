<!--
  ArchiveChart.vue
  --------------------------------------------------
  Reusable chart component using Chart.js:
    • Renders chart of specified type (default is 'pie') with given data and options.
    • Automatically re-renders when `chartData` changes (deep watch).
    • Supports all Chart.js chart types by registering all components globally.
    • Canvas is responsive with `max-width: 100%` for fluid layout integration.
-->
<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { ref, onMounted, watch } from "vue";

Chart.register(...registerables);

export default {
  props: {
    chartData: Object,
    chartOptions: Object,
    chartType: {
      type: String,
      default: "pie",
    },
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(canvas.value, {
        type: props.chartType,
        data: props.chartData,
        options: props.chartOptions,
      });
    };

    onMounted(renderChart);
    watch(() => props.chartData, renderChart, { deep: true });

    return { canvas };
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
