<template>
  <div class="max-w-6xl mx-auto px-4 py-8 min-h-screen text-gray-900 dark:text-gray-100">
    <h1 class="text-3xl font-bold mb-6">🎛️ Admin Paneli</h1>

    <section class="mb-12">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">📚 Dersler</h2>
        <button @click="openNewLessonForm" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          + Yeni Ders
        </button>
      </div>

      <!-- Ders Listesi -->
      <div v-if="lessons.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="lesson in lessons"
          :key="lesson.id"
          class="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800"
        >
          <h3 class="text-lg font-semibold">{{ lesson.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ lesson.description }}</p>
          <p class="text-xs mt-1">Seviye: {{ lesson.level }} |
              Ana Başlık: <strong>{{ lesson.mainTopic || '—' }}</strong> |
              Hedef: {{ lesson.goal || 'Genel' }}</p>

          <div class="flex gap-2 mt-4">
            <button @click="editLesson(lesson)" class="px-3 py-1 text-sm bg-yellow-500 text-white rounded">Düzenle</button>
            <button @click="deleteLesson(lesson.id)" class="px-3 py-1 text-sm bg-red-600 text-white rounded">Sil</button>
            <button @click="openAddPageModal(lesson.id)" class="px-3 py-1 text-sm bg-purple-600 text-white rounded">+ Sayfa</button>
            <button @click="openAddQuizModal(lesson.id)" class="px-3 py-1 text-sm bg-green-600 text-white rounded">+ Quiz</button>
          </div>
        </div>
      </div>

    

      <div v-else class="text-gray-500 dark:text-gray-400">Hiç ders bulunamadı.</div>
    </section>
    <!-- Quizler -->
<section class="mb-12">
  <h2 class="text-xl font-semibold mb-4">🧠 Quizler</h2>

  <div v-if="quizzes.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div
      v-for="quiz in quizzes"
      :key="quiz.id"
      class="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800"
    >
      <h3 class="text-lg font-semibold">{{ quiz.title }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Seviye: {{ quiz.Lesson?.level || '-' }} | Hedef: {{ quiz.Lesson?.goal || '-' }}
      </p>

      <div class="flex gap-2 mt-4">
        <button @click="editQuiz(quiz)" class="px-3 py-1 text-sm bg-yellow-500 text-white rounded">Düzenle</button>
        <button @click="openQuestionModal(quiz.id)" class="px-3 py-1 text-sm bg-indigo-600 text-white rounded">
  ❓ Sorular
</button>
        <button @click="openAddQuestionModal(quiz.id)" class="px-3 py-1 text-sm bg-purple-600 text-white rounded">+ Soru</button>
        <button @click="deleteQuiz(quiz.id)" class="px-3 py-1 text-sm bg-red-600 text-white rounded">Sil</button>
      </div>
    </div>
  </div>

  <div v-else class="text-gray-500 dark:text-gray-400">Hiç quiz bulunamadı.</div>
</section>

    

   <!-- Yeni Ders Ekleme Modalı -->
<div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl">
    <h3 class="text-xl font-bold mb-4">+ Yeni Ders Ekle</h3>

    <div class="space-y-3">
      <input v-model="newLesson.title" type="text" placeholder="Başlık" class="w-full px-4 py-2 rounded border" />
      <input v-model="newLesson.description" type="text" placeholder="Açıklama" class="w-full px-4 py-2 rounded border" />
      <textarea v-model="newLesson.content" placeholder="İçerik (isteğe bağlı)" class="w-full px-4 py-2 rounded border"></textarea>
      
      <!-- Ana Başlık -->
      <input v-model="newLesson.mainTopic" type="text" placeholder="Ana Başlık (ör. Vocabulary)" class="w-full px-4 py-2 rounded border" />

      <!-- Önkoşul Ders -->
      <select v-model="newLesson.prerequisiteLessonId" class="w-full px-4 py-2 rounded border">
        <option value="">Önkoşul ders yok</option>
        <option v-for="lesson in lessons" :key="lesson.id" :value="lesson.id">
          {{ lesson.title }}
        </option>
      </select>

      <select v-model="newLesson.level" class="w-full px-4 py-2 rounded border">
        <option disabled value="">Seviye Seçin</option>
        <option v-for="level in ['A1','A2','B1','B2','C1','C2']" :key="level">{{ level }}</option>
      </select>

      <select v-model="newLesson.goal" class="w-full px-4 py-2 rounded border">
        <option disabled value="">Hedef Seçin</option>
        <option v-for="goal in ['Genel','İş','Seyahat','Akademik']" :key="goal">{{ goal }}</option>
      </select>

      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="newLesson.isPublished" />
        Yayınla
      </label>
    </div>

    <div class="flex justify-end gap-4 mt-6">
      <button @click="showAddModal = false" class="px-4 py-2 border rounded">İptal</button>
      <button @click="submitNewLesson" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ekle</button>
    </div>
  </div>
</div>

<!-- Ders Güncelleme Modalı -->
<div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl">
    <h3 class="text-xl font-bold mb-4">📝 Dersi Güncelle</h3>

    <div class="space-y-3">
      <input v-model="editLessonData.title" type="text" placeholder="Başlık" class="w-full px-4 py-2 rounded border" />
      <input v-model="editLessonData.description" type="text" placeholder="Açıklama" class="w-full px-4 py-2 rounded border" />
      <textarea v-model="editLessonData.content" placeholder="İçerik" class="w-full px-4 py-2 rounded border"></textarea>
      
      <!-- Ana Başlık -->
      <input v-model="editLessonData.mainTopic" type="text" placeholder="Ana Başlık (ör. Vocabulary)" class="w-full px-4 py-2 rounded border" />

      <!-- Önkoşul Ders -->
      <select v-model="editLessonData.prerequisiteLessonId" class="w-full px-4 py-2 rounded border">
        <option value="">Önkoşul ders yok</option>
        <option v-for="lesson in lessons" :key="lesson.id" :value="lesson.id">
          {{ lesson.title }}
        </option>
      </select>

      <select v-model="editLessonData.level" class="w-full px-4 py-2 rounded border">
        <option disabled value="">Seviye Seçin</option>
        <option v-for="level in ['A1','A2','B1','B2','C1','C2']" :key="level">{{ level }}</option>
      </select>

      <select v-model="editLessonData.goal" class="w-full px-4 py-2 rounded border">
        <option disabled value="">Hedef Seçin</option>
        <option v-for="goal in ['Genel','İş','Seyahat','Akademik']" :key="goal">{{ goal }}</option>
      </select>

      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="editLessonData.isPublished" />
        Yayınla
      </label>
    </div>

    <div class="flex justify-end gap-4 mt-6">
      <button @click="showEditModal = false" class="px-4 py-2 border rounded">İptal</button>
      <button @click="submitLessonUpdate" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Güncelle</button>
    </div>
  </div>
</div>

<!-- 📄 Sayfa Ekleme Modalı -->
<div v-if="showAddPageModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl">
    <h3 class="text-xl font-bold mb-4">📄 Derse Sayfa Ekle</h3>

    <div class="space-y-3">
      <input v-model="newPage.pageNumber" type="number" placeholder="Sayfa Numarası" class="w-full px-4 py-2 rounded border" />

      <select v-model="newPage.type" class="w-full px-4 py-2 rounded border">
        <option disabled value="">Sayfa Tipi Seçin</option>
        <option value="fill">Boşluk Doldurma (fill)</option>
        <option value="mcq">Çoktan Seçmeli (mcq)</option>
        <option value="listen">Dinleme (listen)</option>
        <option value="image">Görsel (image)</option>
        <option value="match">Eşleştirme (match)</option>
        <option value="info">Bilgilendirme (info)</option>
        <option value="reorder">Reorder (Sıralama)</option>
        <option value="drag-drop">Drag Drop (Eşleştirme)</option>
      </select>

      <textarea v-model="newPage.content" placeholder="İçerik (JSON veya yazı olarak)" class="w-full px-4 py-2 rounded border" rows="6"></textarea>
    </div>

    <div class="flex justify-end gap-4 mt-6">
      <button @click="showAddPageModal = false" class="px-4 py-2 border rounded">İptal</button>
      <button @click="submitLessonPage" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Sayfa Ekle</button>
    </div>
  </div>
</div>

<!-- 🧠 Quiz Ekleme Modalı -->
<div v-if="showAddQuizModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl">
    <h3 class="text-xl font-bold mb-4">🧠 Derse Quiz Ekle</h3>

    <div class="space-y-4">
      <input
        v-model="newQuiz.title"
        type="text"
        placeholder="Quiz Başlığı"
        class="w-full px-4 py-2 rounded border"
      />
    </div>

    <div class="flex justify-end gap-4 mt-6">
      <button @click="showAddQuizModal = false" class="px-4 py-2 border rounded">İptal</button>
      <button @click="submitQuiz" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Quiz Ekle</button>
    </div>
  </div>
</div>

  <!-- ❓ Quiz Sorusu Ekleme Modalı -->
<div v-if="showAddQuestionModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg shadow-xl">
    <h3 class="text-xl font-bold mb-4">❓ Quiz Sorusu Ekle</h3>

    <div class="space-y-4">
      <input
        v-model="newQuestion.questionText"
        type="text"
        placeholder="Soru metni"
        class="w-full px-4 py-2 rounded border"
      />

      <div v-for="(option, index) in newQuestion.options" :key="index" class="flex gap-2 items-center">
        <input
          v-model="newQuestion.options[index]"
          type="text"
          placeholder="Şık"
          class="flex-1 px-4 py-2 rounded border"
        />
        <button @click="removeOption(index)" class="text-red-500">❌</button>
      </div>
      <button @click="addOption" class="text-sm text-blue-600">+ Şık Ekle</button>

      <input
        v-model="newQuestion.correctAnswer"
        type="text"
        placeholder="Doğru cevap"
        class="w-full px-4 py-2 rounded border"
      />
    </div>

    <div class="flex justify-end gap-4 mt-6">
      <button @click="showAddQuestionModal = false" class="px-4 py-2 border rounded">İptal</button>
      <button @click="submitQuestion" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Ekle</button>
    </div>
  </div>
</div>

<!-- Quiz Soruları Modalı -->
<div v-if="showQuestionModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl shadow-xl">
    <h3 class="text-lg font-bold mb-4">🧠 Quiz Soruları</h3>

    <ul class="space-y-3 mb-4">
      <li v-for="q in quizQuestions" :key="q.id" class="bg-gray-100 dark:bg-gray-800 p-3 rounded flex justify-between items-center">
        <span class="text-sm">{{ q.questionText }}</span>
        <button @click="deleteQuestion(q.id)" class="text-red-500 text-sm">🗑️ Sil</button>
      </li>
    </ul>

    <div class="text-right">
      <button @click="showQuestionModal = false" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded">Kapat</button>
    </div>
  </div>
</div>

<!-- 📝 Quiz Düzenleme Modalı -->
<div v-if="showEditQuizModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl">
    <h3 class="text-xl font-bold mb-4">📝 Quiz Güncelle</h3>

    <div class="space-y-4">
      <input
        v-model="editQuizData.title"
        type="text"
        placeholder="Quiz Başlığı"
        class="w-full px-4 py-2 rounded border"
      />

      <select v-model="editQuizData.lessonId" class="w-full px-4 py-2 rounded border">
        <option disabled value="">Ders Seçin</option>
        <option v-for="lesson in lessons" :key="lesson.id" :value="lesson.id">
          {{ lesson.title }}
        </option>
      </select>
    </div>

    <div class="flex justify-end gap-4 mt-6">
      <button @click="showEditQuizModal = false" class="px-4 py-2 border rounded">İptal</button>
      <button @click="submitQuizUpdate" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Güncelle
      </button>
    </div>
  </div>
</div>
    

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const lessons = ref([])
const token = localStorage.getItem("token")

async function fetchLessons() {
  try {
    const res = await axios.get("http://localhost:3000/api/lessons/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
    lessons.value = res.data
  } catch (err) {
    console.error("Dersler alınamadı:", err)
  }
}

const showAddModal = ref(false)
const newLesson = ref({
  title: '',
  description: '',
  content: '',
  level: '',
  goal: '',
  isPublished: false,
  mainTopic: '',              
  prerequisiteLessonId: ''    
})

function openNewLessonForm() {
  newLesson.value = {
    title: '',
    description: '',
    content: '',
    level: '',
    goal: '',
    isPublished: false,
    mainTopic: '',              
  prerequisiteLessonId: ''    
  }
  showAddModal.value = true
}

async function submitNewLesson() {
   if (!newLesson.value.prerequisiteLessonId) {
    newLesson.value.prerequisiteLessonId = null
  }
  try {
    await axios.post("http://localhost:3000/api/admin/lessons", newLesson.value, {
      headers: { Authorization: `Bearer ${token}` }
    })
    showAddModal.value = false
    fetchLessons()
  } catch (err) {
    console.error("Ders eklenemedi:", err)
    alert("Ders eklenemedi.")
  }
}

const showEditModal = ref(false)
const editLessonData = ref({})

// “Düzenle” butonuna tıklanınca çağrılacak
function editLesson(lesson) {
  editLessonData.value = {
    ...lesson,
    mainTopic: lesson.mainTopic || '',
    prerequisiteLessonId: lesson.prerequisiteLessonId || ''
  }
  showEditModal.value = true
}

async function submitLessonUpdate() {
   if (!newLesson.value.prerequisiteLessonId) {
    newLesson.value.prerequisiteLessonId = null
  }

  try {
    await axios.put(`http://localhost:3000/api/admin/lessons/${editLessonData.value.id}`, editLessonData.value, {
      headers: { Authorization: `Bearer ${token}` }
    })
    showEditModal.value = false
    fetchLessons()
  } catch (err) {
    console.error("Ders güncellenemedi:", err)
    alert("Ders güncellenemedi.")
  }
}

async function deleteLesson(id) {
  if (!confirm("Bu dersi silmek istediğinizden emin misiniz?")) return

  try {
    await axios.delete(`http://localhost:3000/api/admin/lessons/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchLessons()
  } catch (err) {
    console.error("Ders silinemedi:", err)
    alert("Ders silinemedi.")
  }
}

const showAddPageModal = ref(false)
const currentLessonId = ref(null)
const newPage = ref({
  pageNumber: 1,
  type: "",
  content: ""
})

function openAddPageModal(lessonId) {
  currentLessonId.value = lessonId
  newPage.value = {
    pageNumber: 1,
    type: "",
    content: ""
  }
  showAddPageModal.value = true
} 

async function submitLessonPage() {
  try {
    await axios.post(`http://localhost:3000/api/admin/${currentLessonId.value}/pages`, newPage.value, {
      headers: { Authorization: `Bearer ${token}` }
    })
    showAddPageModal.value = false
    alert("Sayfa başarıyla eklendi.")
  } catch (err) {
    console.error("Sayfa eklenemedi:", err)
    alert("Sayfa eklenemedi.")
  }
}

const showAddQuizModal = ref(false)
const currentQuizLessonId = ref(null)
const newQuiz = ref({
  title: ""
})

function openAddQuizModal(lessonId) {
  currentQuizLessonId.value = lessonId
  newQuiz.value = { title: "" }
  showAddQuizModal.value = true
}

async function submitQuiz() {
  try {
    await axios.post(`http://localhost:3000/api/admin/quizzes/lesson/${currentQuizLessonId.value}`, newQuiz.value, {
      headers: { Authorization: `Bearer ${token}` }
    })
    showAddQuizModal.value = false
    alert("Quiz başarıyla eklendi.")
  } catch (err) {
    console.error("Quiz eklenemedi:", err)
    alert("Quiz eklenemedi.")
  }
}

const showAddQuestionModal = ref(false)
const targetQuizId = ref(null)
const newQuestion = ref({
  questionText: "",
  options: ["", ""],
  correctAnswer: ""
})

function openAddQuestionModal(quizId) {
  targetQuizId.value = quizId
  newQuestion.value = {
    questionText: "",
    options: ["", ""],
    correctAnswer: ""
  }
  showAddQuestionModal.value = true
}

function addOption() {
  newQuestion.value.options.push("")
}

function removeOption(index) {
  newQuestion.value.options.splice(index, 1)
}

async function submitQuestion() {
  try {
    await axios.post("http://localhost:3000/api/admin/quizzes/questions", {
      quizId: targetQuizId.value,
      questionText: newQuestion.value.questionText,
      options: newQuestion.value.options,
      correctAnswer: newQuestion.value.correctAnswer
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    alert("Soru başarıyla eklendi.")
    showAddQuestionModal.value = false
  } catch (err) {
    console.error("Soru eklenemedi:", err)
    alert("Soru eklenemedi.")
  }
}

const quizzes = ref([])

async function fetchQuizzes() {
  try {
    const res = await axios.get("http://localhost:3000/api/admin/quizzes", {
      headers: { Authorization: `Bearer ${token}` }
    })
    quizzes.value = res.data
  } catch (err) {
    console.error("Quizler alınamadı:", err)
  }
}

const showEditQuizModal = ref(false)
const editQuizData = ref({
  id: null,
  title: '',
  lessonId: null
})

function editQuiz(quiz) {
  editQuizData.value = {
    id: quiz.id,
    title: quiz.title,
    lessonId: quiz.lessonId
  }
  showEditQuizModal.value = true
}

async function submitQuizUpdate() {
  try {
    await axios.put(`http://localhost:3000/api/admin/quizzes/${editQuizData.value.id}`, {
      title: editQuizData.value.title,
      lessonId: editQuizData.value.lessonId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    showEditQuizModal.value = false
    fetchQuizzes()
  } catch (err) {
    console.error("Quiz güncellenemedi:", err)
    alert("Quiz güncellenemedi.")
  }
}


async function deleteQuiz(id) {
  if (!confirm("Bu quiz silinecek. Emin misiniz?")) return

  try {
    await axios.delete(`http://localhost:3000/api/admin/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchQuizzes()
  } catch (err) {
    console.error("Quiz silinemedi:", err)
    alert("Quiz silinemedi.")
  }
}

const showQuestionModal = ref(false)
const selectedQuizId = ref(null)
const quizQuestions = ref([])

function openQuestionModal(quizId) {
  selectedQuizId.value = quizId
  fetchQuestions(quizId)
  showQuestionModal.value = true
}

async function fetchQuestions(quizId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/admin/quizzes/${quizId}/questions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    quizQuestions.value = res.data
  } catch (err) {
    console.error("Sorular alınamadı:", err)
  }
}

async function deleteQuestion(questionId) {
  if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return
  try {
    await axios.delete(`http://localhost:3000/api/admin/quizzes/questions/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchQuestions(selectedQuizId.value)
  } catch (err) {
    console.error("Soru silinemedi:", err)
  }
}

onMounted(() => {
  fetchLessons()
  fetchQuizzes()
})
</script>
