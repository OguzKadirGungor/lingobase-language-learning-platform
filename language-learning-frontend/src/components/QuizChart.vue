<template>
  <div class="w-full max-w-[160px] aspect-square mx-auto">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  percentage: {
    type: Number,
    required: true
  }
})

const chartData = computed(() => ({
  labels: ['Başarılı', 'Başarısız'],
  datasets: [
    {
      data: [props.percentage, 100 - props.percentage],
      backgroundColor: ['#16a34a', '#d1d5db'],
      borderWidth: 1
    }
  ]
}))

const chartOptions = {
  cutout: '70%',
  plugins: {
    legend: { display: false }
  }
}
</script>