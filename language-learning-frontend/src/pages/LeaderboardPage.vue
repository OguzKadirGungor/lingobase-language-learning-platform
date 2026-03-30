<template>
  <div class="min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-center">🏆 Liderlik Tablosu</h2>

      <!-- Sıralama Seçimi -->
      <div class="flex justify-center gap-4 mb-4">
        <button
          v-for="type in sortTypes"
          :key="type.value"
          @click="currentSort = type.value"
          :class="[
            'px-4 py-2 rounded',
            currentSort === type.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          ]"
        >
          {{ type.label }}
        </button>
      </div>

      <!-- Liderlik Tablosu -->
      <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Kullanıcı</th>
              <th class="px-4 py-3">Seviye</th>
              <th class="px-4 py-3">Puan</th>
              <th class="px-4 py-3">Rozet</th>
              <th class="px-4 py-3">Quiz Başarı</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in sortedUsers"
              :key="user.id"
              class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td class="px-4 py-2 font-semibold">{{ index + 1 }}</td>
              <td class="px-4 py-2">{{ user.name }}</td>
              <td class="px-4 py-2">{{ user.languageLevel }}</td>
              <td class="px-4 py-2">{{ user.totalPoints }}</td>
              <td class="px-4 py-2">{{ user.badgeCount }}</td>
              <td class="px-4 py-2">{{ user.quizAverage }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const currentSort = ref('points')

const sortTypes = [
  { label: 'Puan', value: 'points' },
  { label: 'Quiz Başarı', value: 'quiz' },
  { label: 'Rozet', value: 'badge' }
]

onMounted(async () => {
  const token = localStorage.getItem('token')
  try {
    const res = await axios.get('http://localhost:3000/api/leaderboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
    users.value = res.data
  } catch (err) {
    console.error('Liderlik tablosu alınamadı:', err)
  }
})

const sortedUsers = computed(() => {
  return [...users.value].sort((a, b) => {
    if (currentSort.value === 'points') return b.totalPoints - a.totalPoints
    if (currentSort.value === 'quiz') return b.quizAverage - a.quizAverage
    if (currentSort.value === 'badge') return b.badgeCount - a.badgeCount
    return 0
  })
})
</script>
