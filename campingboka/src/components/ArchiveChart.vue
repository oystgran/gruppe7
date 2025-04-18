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