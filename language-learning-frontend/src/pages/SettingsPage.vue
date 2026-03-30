<template>
  <div class="max-w-xl mx-auto px-4 py-8 text-gray-900 dark:text-white">
    <h2 class="text-2xl font-bold mb-6">⚙️ Ayarlar</h2>

    <form @submit.prevent="updateProfile" class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <!-- Email -->
      <div>
        <label class="block mb-1 text-sm font-medium">E-posta</label>
        <input
          v-model="email"
          type="email"
          placeholder="Yeni e-posta"
          class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <!-- Mevcut Şifre -->
      <div>
        <label class="block mb-1 text-sm font-medium">Mevcut Şifre</label>
        <input
          v-model="currentPassword"
          type="password"
          placeholder="Mevcut şifreniz"
          class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <!-- Yeni Şifre -->
      <div>
        <label class="block mb-1 text-sm font-medium">Yeni Şifre</label>
        <input
          v-model="newPassword"
          type="password"
          placeholder="Yeni şifre"
          class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <!-- Kaydet Butonu -->
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
      >
        Kaydet
      </button>

      <!-- Hata veya Başarı Mesajı -->
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <p v-if="success" class="text-green-500 text-sm">{{ success }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const error = ref('')
const success = ref('')

async function updateProfile() {
  error.value = ''
  success.value = ''
  const token = localStorage.getItem('token')
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    await axios.put('http://localhost:3000/api/auth/update-profile', {
      email: email.value || undefined,
      currentPassword: currentPassword.value || undefined,
      newPassword: newPassword.value || undefined
    }, config)

    success.value = 'Profil başarıyla güncellendi!'
    email.value = ''
    currentPassword.value = ''
    newPassword.value = ''
  } catch (err) {
    error.value = err.response?.data?.error || 'Bir hata oluştu.'
  }
}
</script>
