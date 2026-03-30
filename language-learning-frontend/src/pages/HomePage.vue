<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <div class="flex-1 p-6 grid grid-cols-3 gap-6">
      <!-- Sol Ana İçerik -->
      <div class="col-span-2 space-y-6">
        <!-- Önerilen Dersler -->
        <section>
          <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-4">
            <span class="text-3xl">📘</span> Önerilen Dersler
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="lesson in lessons" :key="lesson.id"
              class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-700">
              <h3 class="font-semibold text-lg">{{ lesson.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ lesson.description }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Seviye: {{ lesson.level }}<span v-if="lesson.goal"> | Hedef: {{ lesson.goal }}</span>
              </p>
              <router-link :to="`/lesson-player/${lesson.id}/1`"
                class="inline-block mt-3 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded">
                Dersi Aç →
              </router-link>
            </div>
          </div>
          <router-link to="/lessons" class="text-blue-500 hover:underline dark:text-blue-300 text-sm mt-3 inline-block">
            Tüm dersleri gör →
          </router-link>
        </section>

        <!-- Önerilen Quizler -->
        <section>
          <h2 class="text-2xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
            <span class="text-3xl">❓</span> Önerilen Quizler
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="quiz in quizzes" :key="quiz.id"
              class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-700">
              <h3 class="font-semibold text-lg">{{ quiz.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Ders: {{ quiz.Lesson?.title || 'Bilinmiyor' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Seviye: {{ quiz.Lesson?.level || '-' }}</p>
              <router-link :to="`/quiz/${quiz.id}`"
                class="inline-block mt-3 text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded">
                Quizi Başlat →
              </router-link>
            </div>
          </div>
          <router-link to="/quiz" class="text-red-500 hover:underline dark:text-red-300 text-sm mt-3 inline-block">
            Tüm quizleri gör →
          </router-link>
        </section>

        <!-- Chatbot -->
        <section>
          <h2 class="text-2xl font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2 mb-4">
            <span class="text-3xl">🤖</span> Chatbot
          </h2>
          <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-300">Chatbot ile günlük pratik yapmak ister misin?</p>
            <router-link to="/chatbot"
              class="inline-block mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
              Chatbota Git
            </router-link>
          </div>
        </section>
      </div>

      <!-- Sağ Panel -->
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 w-full max-w-xs">
        <!-- Seviye & Hedef -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-6">
          <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">📌 Seviye & Hedef</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Seviye: {{ user.level || 'Belirtilmemiş' }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Hedef: {{ user.goal || 'Belirtilmemiş' }}</p>
        </div>

        <!-- Genel İstatistik -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">📊 Genel İlerleme</h3>

          <!-- Ders İlerlemesi -->
          <div class="mb-3">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">Ders İlerlemesi</p>
            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div class="bg-blue-600 h-3 rounded-full"
                :style="{ width: `${(stats.completedLessons / stats.totalLessons) * 100 || 0}%` }"></div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ stats.completedLessons }} / {{ stats.totalLessons }} ders tamamlandı
            </p>
          </div>

          <!-- Quiz Chart -->
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Quiz Başarı Oranı</p>
            <QuizChart :percentage="stats.quizAverage" />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Ortalama başarı: {{ stats.quizAverage }}%</p>
          </div>
        </div>

        <!-- Son Aktivite -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-6">
          <h3 class="text-lg font-semibold mb-2">🕓 Son Aktivite</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Son Tamamlanan Ders: {{ recent.lessonTitle || '-' }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Son Tamamlanan Quiz: {{ recent.quizTitle || '-' }}</p>
        </div>

        <!-- Son Rozet -->
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex items-center gap-4 mb-6">
<div class="w-12 h-12 rounded-full flex items-center justify-center text-3xl bg-gray-100 dark:bg-gray-700">
  <span v-if="recent.badgeImageUrl">{{ recent.badgeImageUrl }}</span>
  <span v-else>🏅</span>
</div>

          <div>
            <h3 class="text-lg font-semibold">Son Kazanılan Rozet</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ recent.badgeTitle || 'Henüz rozet kazanılmadı.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import QuizChart from '../components/QuizChart.vue'

const user = ref({})
const lessons = ref([])
const quizzes = ref([])
const stats = ref({ completedLessons: 0, totalLessons: 0, completedQuizzes: 0, quizAverage: 0, totalPoints: 0 })
const recent = ref({ lessonTitle: '', quizTitle: '', badgeTitle: '', badgeIcon: '' })

onMounted(async () => {
  const token = localStorage.getItem('token')
  const config = { headers: { Authorization: `Bearer ${token}` } }

  try {
    const userRes = await axios.get('/api/profile', config)
    user.value = userRes.data

    const lessonsRes = await axios.get('/api/lessons/recommendations', config)
    lessons.value = lessonsRes.data.slice(0, 3)
    console.log('Önerilen dersler:', lessons.value)

    const quizzesRes = await axios.get('/api/quizzes', config)
    quizzes.value = quizzesRes.data.slice(0, 3)

    const statsRes = await axios.get('/api/user-stats', config)
    stats.value = statsRes.data

    const recentRes = await axios.get('/api/user-stats/recent', config)
    recent.value = recentRes.data
    console.log("Son aktivite:", recent.value)

  } catch (error) {
    console.error('Dashboard verileri alınırken hata oluştu:', error)
  }
})
</script>

<style scoped></style>