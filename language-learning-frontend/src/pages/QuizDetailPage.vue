<template>
  <div class="max-w-3xl mx-auto p-6 text-gray-900 dark:text-gray-100 min-h-screen">
    <h2 class="text-2xl font-bold mb-6">{{ quiz?.title }}</h2>

    <form v-if="quiz && quiz.QuizQuestions" @submit.prevent="submitQuiz" class="space-y-6">
      <div
        v-for="(q, index) in quiz.QuizQuestions"
        :key="q.id"
        :class="[
          'p-4 rounded-xl border transition',
          result && !isCorrect(q.id) ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        ]"
      >
        <p class="font-semibold mb-2">Soru {{ index + 1 }}: {{ q.questionText }}</p>
        <div class="space-y-2">
          <label
            v-for="option in q.options"
            :key="option"
            class="block px-4 py-2 rounded-md cursor-pointer border transition"
            :class="[
              'border-gray-300 dark:border-gray-600',
              result && userAnswers[q.id] === option && !isCorrect(q.id) ? 'border-red-500 text-red-600' : '',
              result && isCorrectOption(q.id, option) ? 'border-green-500 text-green-600' : '',
              result ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <input
              type="radio"
              class="mr-2"
              :value="option"
              :name="`question-${q.id}`"
              v-model="userAnswers[q.id]"
              :disabled="reviewMode || !!result"
            />
            {{ option }}
          </label>
        </div>
      </div>

      <button
        type="submit"
        v-if="!result && !reviewMode"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Quizi Bitir
      </button>
    </form>

    <!-- Modal -->
    <Teleport to="body">
      <div
        v-if="showResultModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 rounded-xl w-full max-w-md shadow-xl">
          <h3 class="text-xl font-bold mb-4">🎯 Quiz Sonucu</h3>
          <p class="mb-1">✅ Doğru Sayısı: {{ result.correct }} / {{ result.total }}</p>
          <p class="mb-4">📊 Başarı Oranı: {{ result.percentage }}%</p>

          <div v-if="result.awardedBadges && result.awardedBadges.length" class="mb-4">
            <h4 class="font-semibold mb-2">🏅 Kazanılan Rozetler</h4>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li v-for="badge in result.awardedBadges" :key="badge.title">
                {{ badge.title }} ({{ badge.icon }})
              </li>
            </ul>
          </div>

          <div class="flex justify-end gap-4">
            <button @click="showResultModal = false" class="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">Yanlışları İncele</button>
            <button @click="goHome" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ana Sayfa</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const quizId = route.params.id
const reviewMode = route.query.review === 'true'

const token = localStorage.getItem("token")

const quiz = ref(null)
const userAnswers = ref({})
const result = ref(null)
const showResultModal = ref(false)

// Global Toast için proxy
const { proxy } = getCurrentInstance()

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/quizzes/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    quiz.value = res.data

    // Eğer inceleme modundaysa, kullanıcının daha önce verdiği cevapları çek
    if (reviewMode) {
      const answersRes = await axios.get(`http://localhost:3000/api/quizzes/results/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const matched = answersRes.data.find(r => r.quizId === parseInt(quizId))
      if (matched) {
        const response = await axios.get(`http://localhost:3000/api/user-quizzes/result-answers/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        response.data.forEach(ans => {
          userAnswers.value[ans.quizQuestionId] = ans.userAnswer
        })

        result.value = {
          correct: matched.score,
          total: matched.totalQuestions,
          percentage: matched.percentage,
          awardedBadges: []
        }
      }
    }

  } catch (err) {
    console.error("Quiz verileri yüklenemedi:", err)
  }
})

async function submitQuiz() {
  try {
    const answersArray = Object.keys(userAnswers.value).map(questionId => ({
      questionId,
      userAnswer: userAnswers.value[questionId]
    }))

    const res = await axios.post("http://localhost:3000/api/quizzes/results", {
      quizId: quiz.value.id,
      answers: answersArray
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    result.value = res.data
    showResultModal.value = true

    // Eğer rozet kazanıldıysa toast ile göster
    if (res.data.awardedBadges && res.data.awardedBadges.length > 0) {
      proxy?.$refs.globalToast?.showMultipleToasts(res.data.awardedBadges)
    }
  } catch (err) {
    console.error("Quiz sonucu gönderilemedi:", err)
  }
}

function goHome() {
  router.push('/home')
}

function isCorrect(questionId) {
  const question = quiz.value.QuizQuestions.find(q => q.id === parseInt(questionId))
  return question.correctAnswer === userAnswers.value[questionId]
}

function isCorrectOption(questionId, option) {
  const question = quiz.value.QuizQuestions.find(q => q.id === parseInt(questionId))
  return question.correctAnswer === option
}
</script>
