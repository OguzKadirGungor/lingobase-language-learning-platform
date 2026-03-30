<template>
  <div class="min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <div class="max-w-4xl mx-auto space-y-8">

      <!-- 👤 Kullanıcı Bilgileri Kartı -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 relative w-full text-center">
        <!-- Profil Fotoğrafı -->
        <div class="relative w-28 h-28 mx-auto mb-4 group cursor-pointer" @click="triggerImageUpload">
          <img
            :src="previewImage || user.profileImageUrl || defaultImage"
            alt="Profil Fotoğrafı"
            class="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
          />
          <div
            v-if="editMode"
            class="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span class="text-white text-xl">📷</span>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref="fileInput"
          class="hidden"
          @change="handleImageUpload"
        />

        <!-- Profil Bilgileri -->
        <div v-if="!editMode">
          <h2 class="text-xl font-bold">{{ user.name || 'Kullanıcı Adı' }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-300">Seviye: {{ user.level || '-' }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Hedef: {{ user.goal|| '-' }}</p>
        </div>

        <!-- Düzenleme Formu -->
        <div v-else class="space-y-3 text-left max-w-sm mx-auto">
          <input v-model="nameInput" type="text" placeholder="Ad Soyad"
            class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white" />

          <select v-model="levelInput" class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white">
            <option disabled value="">Seviye Seçin</option>
            <option v-for="level in ['A1','A2','B1','B2','C1','C2']" :key="level">{{ level }}</option>
          </select>

          <select v-model="goalInput" class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white">
            <option disabled value="">Hedef Seçin</option>
            <option v-for="goal in ['Genel','Seyahat','İş','Akademik']" :key="goal">{{ goal }}</option>
          </select>

          <div class="flex justify-center gap-3 pt-2">
            <button @click="saveProfile" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Kaydet</button>
            <button @click="editMode = false"
              class="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded">İptal</button>
          </div>
        </div>

        <!-- Düzenle Butonu -->
        <button @click="toggleEdit"
          class="absolute bottom-4 right-4 text-gray-400 hover:text-blue-500"
          title="Düzenle">
          ✏️
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
  <h3 class="text-lg font-semibold mb-4">✅ Tamamlanan Dersler ({{ completedLessons.length }})</h3>
  <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-200">
    <li v-for="lesson in completedLessons" :key="lesson.id">
      {{ lesson.title }}
    </li>
  </ul>
</div>

      <!-- Çözülen Quizler -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
  <h3 class="text-lg font-semibold mb-4">🧠 Çözülen Quizler ({{ quizResults.length }})</h3>
  <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-200">
    <li v-for="result in quizResults" :key="result.quizId">
      {{ result.title }} – {{ result.percentage }}% başarı – {{ new Date(result.completedAt).toLocaleDateString() }}
    </li>
  </ul>
</div>

      <!-- Kazanılan Rozetler -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h3 class="text-lg font-semibold mb-4">🏅 Kazanılan Rozetler ({{ badges.length }})</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="badge in badges" :key="badge.id"
            class="bg-yellow-100 dark:bg-yellow-200 border border-yellow-300 dark:border-yellow-400 rounded-lg p-4 flex gap-3 items-start">
            <span class="text-2xl">{{ badge.icon }}</span>
            <div class="text-sm">
              <p class="font-semibold text-gray-800">{{ badge.title }}</p>
              <p class="text-gray-700 text-xs">{{ badge.description }}</p>
            </div>
          </div>
        </div>
      </div>
 
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref({})
const stats = ref({})
const badges = ref([])
const completedLessons = ref([])
const quizResults = ref([])

const token = localStorage.getItem("token")
const defaultImage = "/assets/default-avatar.png"
const fileInput = ref(null)
const editMode = ref(false)

const nameInput = ref("")
const levelInput = ref("")
const goalInput = ref("")
const previewImage = ref(null)

function triggerImageUpload() {
  fileInput.value?.click()
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    previewImage.value = reader.result
  }
  reader.readAsDataURL(file)
}

function toggleEdit() {
  nameInput.value = user.value.name || ""
  levelInput.value = user.value.level|| ""
  goalInput.value = user.value.goal || ""
  previewImage.value = user.value.profileImageUrl || null
  editMode.value = true
}

async function saveProfile() {
  try {
    await axios.put("http://localhost:3000/api/profile", {
      name: nameInput.value,
      level: levelInput.value,
      goal: goalInput.value,
      profileImageUrl: previewImage.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    editMode.value = false
    location.reload()
  } catch (err) {
    console.error("Profil güncellenemedi:", err)
  }
}

async function loadUserData() {
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const [profileRes, lessonRes, quizRes, badgeRes] = await Promise.all([
      axios.get('http://localhost:3000/api/profile', { headers }),
      axios.get('http://localhost:3000/api/user-lessons/progress', { headers }),
      axios.get('http://localhost:3000/api/quizzes/statistics', { headers }),
      axios.get('http://localhost:3000/api/user-badges', { headers })
    ])
    user.value = profileRes.data
    stats.value = quizRes.data
    stats.value.completedLessons = lessonRes.data.completed
    badges.value = badgeRes.data
  } catch (err) {
    console.error('Veriler alınamadı:', err)
  }
}

onMounted(async () => {
  await loadUserData()
  const res1 = await axios.get("http://localhost:3000/api/user-lessons/completed", {
    headers: { Authorization: `Bearer ${token}` }
  })
  completedLessons.value = res1.data

  const res2 = await axios.get("http://localhost:3000/api/quizzes/results/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  quizResults.value = res2.data
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}
</style>
