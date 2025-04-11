<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  chartData: Object,
  chartOptions: Object,
  chartType: {
    type: String,
    default: "pie", // fallback til "pie" hvis ikke spesifisert
  },
});

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
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
