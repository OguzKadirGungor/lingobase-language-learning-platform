<template>
  <div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <div class="max-w-5xl mx-auto space-y-12">

      <!-- Başlık -->
      <h1 class="text-3xl font-bold text-blue-800 dark:text-blue-400">📘 Dersler</h1>

      <!-- 🟢 Alınabilir Dersler -->
      <section v-if="availableLessons.length">
        <h2 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">🟢 Alınabilir Dersler</h2>
        <div class="grid gap-5 sm:grid-cols-2">
          <div v-for="lesson in availableLessons" :key="lesson.id"
            class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700 relative">
            <h3 class="text-lg font-semibold">{{ lesson.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ lesson.description }}</p>
            <!-- ANA BAŞLIK -->
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Seviye: {{ lesson.level }} |
              Ana Başlık: <strong>{{ lesson.mainTopic || '—' }}</strong> |
              Hedef: {{ lesson.goal || 'Genel' }}
            </p>

            <!-- Kilitli ise kilit simgesi -->
            <div v-if="lesson.locked" class="absolute top-4 right-4 text-red-500">
              <span class="text-2xl">🔒</span>
            </div>

            <div class="mt-3">
              <router-link v-if="isEnrolled(lesson.id) && !lesson.locked"
                :to="{ name: 'lesson-player', params: { lessonId: lesson.id, page: 1 } }"
                class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition">
                Dersi Görüntüle
              </router-link>
              <button v-else-if="!isEnrolled(lesson.id) && !lesson.locked" @click="startLesson(lesson.id)"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition">
                Derse Başla
              </button>
              <!-- KİLİTLİ BUTON - tıklanınca toast gösterir -->
              <button v-else @click="showLockedToast(lesson)"
                class="bg-gray-400 text-white px-4 py-2 rounded text-sm opacity-70 cursor-not-allowed"
                :title="getLockedReason(lesson)">
                Kilitli
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ✅ Tamamlanan Dersler -->
      <section v-if="completedLessons.length">
        <h2 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-4">✅ Tamamlanan Dersler</h2>
        <div class="grid gap-5 sm:grid-cols-2">
          <div v-for="lesson in completedLessons" :key="lesson.id"
            class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-semibold">{{ lesson.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ lesson.description }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Seviye: {{ lesson.level }} |
              Ana Başlık: <strong>{{ lesson.mainTopic || '—' }}</strong> |
              Hedef: {{ lesson.goal || 'Genel' }}
            </p>
            <router-link :to="{ name: 'lesson-player', params: { lessonId: lesson.id, page: 1 } }"
              class="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 mt-3 rounded text-sm transition">
              Yeniden Göz At
            </router-link>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { globalToastRef } from "../composables/useToast"

const router = useRouter()
const token = localStorage.getItem('token')
const API_BASE = 'http://localhost:3000/api'

const lessons = ref([])
const userLessons = ref([])
const completedLessons = ref([])

const lessonMap = ref({})

const completedLessonIds = computed(() => completedLessons.value.map(l => l.id))

const availableLessons = computed(() =>
  lessons.value.filter(l => !completedLessonIds.value.includes(l.id))
)

function isEnrolled(lessonId) {
  return userLessons.value.some(ul => ul.lessonId === lessonId)
}

function getLessonTitleById(id) {
  if (!id) return "Önkoşul ders"
  return lessonMap.value[id]?.title || `Ders #${id}`
}

function getLockedReason(lesson) {
  if (lesson.locked && lesson.prerequisiteLessonId) {
    return `Bu derse erişmek için önce '${getLessonTitleById(lesson.prerequisiteLessonId)}' dersini tamamlamalısın.`
  }
  return "Bu ders şu an için erişime kapalı."
}

// Kilitli butona tıklandığında çalışacak fonksiyon
function showLockedToast(lesson) {
  console.log(globalToastRef.value)
  if (lesson.locked && lesson.prerequisiteLessonId) {
    globalToastRef.value?.showToast({
      icon: "🔒",
      title: "Kilitli Ders",
      description: `Bu derse erişmek için önce '${getLessonTitleById(lesson.prerequisiteLessonId)}' dersini tamamlamalısın.`
    })
  }
}

async function startLesson(lessonId) {
  try {
    const res = await axios.post(
      `${API_BASE}/user-lessons`,
      { lessonId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (res.status === 201 || res.status === 409) {
      router.push({ name: 'lesson-player', params: { lessonId, page: 1 } })
    } else {
      alert('Bir hata oluştu.')
    }
  } catch (err) {
    console.error('Ders başlatılamadı:', err)
  }
}

async function fetchLessons() {
  try {
    const [lessonsRes, userLessonsRes] = await Promise.all([
      axios.get(`${API_BASE}/lessons/recommendations`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${API_BASE}/user-lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    lessons.value = lessonsRes.data
    userLessons.value = userLessonsRes.data

    // Lesson id -> lesson hızlı lookup
    const map = {}
    lessons.value.forEach(l => { map[l.id] = l })
    lessonMap.value = map
  } catch (err) {
    console.error('Dersler yüklenemedi:', err)
  }
}

async function fetchCompletedLessons() {
  try {
    const res = await axios.get(`${API_BASE}/user-lessons/completed`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    completedLessons.value = res.data
  } catch (err) {
    console.error('Tamamlanan dersler alınamadı:', err)
  }
}

onMounted(() => {
  fetchLessons()
  fetchCompletedLessons()
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
</style>
