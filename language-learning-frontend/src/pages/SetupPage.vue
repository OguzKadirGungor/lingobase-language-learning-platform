<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 class="text-2xl font-bold text-center mb-4">🎯 Öğrenme Tercihleri</h2>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
        Hedeflerinize uygun dersler sunabilmemiz için birkaç bilgiye ihtiyacımız var.
      </p>

      <form @submit.prevent="completeRegistration" class="space-y-4">
        <select v-model="level" required class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white">
          <option disabled value="">Seviyeniz nedir?</option>
          <option>A1</option>
          <option>A2</option>
          <option>B1</option>
          <option>B2</option>
          <option>C1</option>
          <option>C2</option>
        </select>

        <select v-model="goal" required class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white">
          <option disabled value="">Öğrenme amacınız nedir?</option>
          <option>Genel</option>
          <option>Seyahat</option>
          <option>İş</option>
          <option>Akademik</option>
        </select>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Kaydı Tamamla
        </button>
      </form>

      <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const level = ref("")
const goal = ref("")
const error = ref("")
const userData = ref(null)

onMounted(() => {
  const data = localStorage.getItem("tempRegisterData")
  if (!data) {
    router.push("/register") // veri yoksa tekrar kayda yönlendir
    return
  }
  userData.value = JSON.parse(data)
})

async function completeRegistration() {
  error.value = ""
  try {
    const res = await axios.post("http://localhost:3000/api/auth/register", {
      name: userData.value.name,
      email: userData.value.email,
      password: userData.value.password,
      level: level.value,
      goal: goal.value
    })

    if (res.status === 201) {
      localStorage.removeItem("tempRegisterData")
      alert("✅ Kayıt tamamlandı! Giriş yapabilirsiniz.")
      router.push("/login") 
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Kayıt tamamlanamadı."
  }
}
</script>
