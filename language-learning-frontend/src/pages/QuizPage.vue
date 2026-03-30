<template>
  <div class="max-w-4xl mx-auto px-4 py-8 min-h-screen text-gray-900 dark:text-gray-100 space-y-10">
    <!-- 📝 Uygun Quizler -->
    <section v-if="availableQuizzes.length">
      <h2 class="text-2xl font-bold mb-4">📝 Uygun Quizler</h2>
      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="quiz in availableQuizzes"
          :key="quiz.id"
          class="p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg cursor-pointer transition"
          @click="attemptQuiz(quiz)"
        >
          <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-1">
            {{ quiz.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Seviye: {{ quiz.Lesson?.level || '-' }} <span v-if="quiz.Lesson?.goal">| Hedef: {{ quiz.Lesson.goal }}</span>
          </p>
        </div>
      </div>
    </section>

    <!-- ✅ Tamamlanan Quizler -->
    <section v-if="completedQuizzes.length">
      <h2 class="text-2xl font-bold mb-4">✅ Tamamlanan Quizler</h2>
      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="result in completedQuizzes"
          :key="result.id"
          class="p-4 rounded-xl shadow border border-green-200 dark:border-green-600 bg-white dark:bg-gray-800"
        >
          <h3 class="text-lg font-semibold text-green-700 dark:text-green-400">
            {{ result.title || 'Quiz' }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Başarı: {{ result.percentage }}%
          </p>
          <button
            class="mt-2 inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 text-sm rounded transition"
            @click="goToQuiz(result.quizId, true)"
          >
            Gözden Geçir
          </button>
        </div>
      </div>
    </section>

    <!-- ⛔ Modal: Dersi Bitir Uyarısı -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg text-center">
          <h3 class="text-xl font-bold mb-4 text-red-600 dark:text-red-400">🚫 Önce Dersi Tamamlayın</h3>
          <p class="text-gray-800 dark:text-gray-200 mb-4">
            Bu quize erişebilmek için önce şu dersi tamamlamanız gerekiyor:
          </p>
          <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded text-left mb-4 border border-gray-300 dark:border-gray-700">
            <h4 class="font-semibold text-blue-700 dark:text-blue-300">{{ blockedLesson?.title }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ blockedLesson?.description }}</p>
          </div>
          <div class="flex justify-center gap-4">
            <router-link
              :to="`/lesson-player/${blockedLesson.id}/1`"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Dersi Başlat
            </router-link>
            <button @click="showModal = false" class="px-4 py-2 border rounded">
              Kapat
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const availableQuizzes = ref([])
const completedQuizzes = ref([])
const completedLessonIds = ref([])

const showModal = ref(false)
const blockedLesson = ref(null)

onMounted(async () => {
  const token = localStorage.getItem("token")
  try {
    const [availableRes, completedRes, lessonsRes] = await Promise.all([
      axios.get("http://localhost:3000/api/quizzes", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get("http://localhost:3000/api/quizzes/results/me", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get("http://localhost:3000/api/user-lessons/completed", {
        headers: { Authorization: `Bearer ${token}` }
      }),
    ])
    availableQuizzes.value = availableRes.data
    completedQuizzes.value = completedRes.data
    console.log("Tamamlanan quizler:", completedQuizzes.value)
    completedLessonIds.value = lessonsRes.data.map(l => l.id)
  } catch (err) {
    console.error("Quiz verileri alınamadı:", err)
  }
})

function attemptQuiz(quiz) {
  const lessonId = quiz.lessonId
  if (completedLessonIds.value.includes(lessonId)) {
    goToQuiz(quiz.id, false)
  } else {
    blockedLesson.value = quiz.Lesson
    showModal.value = true
  }
}

function goToQuiz(quizId, reviewMode) {
  router.push({
    name: 'quiz-detail',
    params: { id: quizId },
    query: { review: reviewMode }
  })
}
</script>
