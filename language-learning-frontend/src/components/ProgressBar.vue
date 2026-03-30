<template>
  <div class="w-full bg-gray-200 rounded-full h-4">
    <div
      class="bg-blue-600 h-4 rounded-full"
      :style="{ width: percentage + '%' }"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  percentage: {
    type: Number,
    required: true
  }
})
</script>