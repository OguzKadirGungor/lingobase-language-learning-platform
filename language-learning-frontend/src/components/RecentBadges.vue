<template>
  <div class="bg-white p-4 rounded-xl shadow">
    <h2 class="text-lg font-bold mb-2">🏅 Son Kazanılan Rozetler</h2>
    <ul class="space-y-2">
      <li v-for="badge in badges" :key="badge.id" class="text-sm text-gray-700">
        <div class="flex items-center gap-2">
          <img :src="badge.icon || '/badge-icon.png'" alt="badge" class="w-6 h-6" />
          <span><strong>{{ badge.name }}</strong>: {{ badge.description }}</span>
        </div>
        <p class="text-xs text-gray-500 ml-8">{{ formatDate(badge.earnedAt) }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const props = defineProps({
  badges: {
    type: Array,
    required: true,
  },
})

function formatDate(dateStr) {
  return format(new Date(dateStr), 'dd.MM.yyyy')
}
</script>

<style scoped>
</style>
