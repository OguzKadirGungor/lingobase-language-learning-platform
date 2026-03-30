<template>
  <aside
    class="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md p-4 flex flex-col z-40">
   <!-- Logo -->
<router-link
  to="/home"
  exact
  exact-active-class=""
  active-class=""
  class="mb-6 flex  pointer-events-auto"
>
  <img src="../assets/logo.png" alt="Lingobase Logo" class="w-40 h-40 object-contain" />
</router-link>

    <!-- Üst Linkler -->
    <nav class="flex flex-col gap-4 mb-8">
      <router-link to="/home" class="sidebar-link" active-class="active">
        <span class="text-xl">🏠</span>
        <span>Anasayfa</span>
      </router-link>

      <router-link to="/profile" class="sidebar-link" active-class="active">
        <span class="text-xl">👤</span>
        <span>Profil</span>
      </router-link>
      <router-link
  v-if="isAdmin"
  to="/admin"
  class="sidebar-link"
  active-class="active"
>
  <span class="text-xl">🛠️</span>
  <span>Admin Paneli</span>
</router-link>
    </nav>

    <!-- Çizgi -->
    <hr class="my-6 border-gray-300 dark:border-gray-700" />

    <!-- Orta Linkler -->
    <nav class="flex flex-col gap-4 mb-12">
      <router-link to="/lessons" class="sidebar-link" active-class="active">
        <span class="text-xl">📘</span>
        <span>Dersler</span>
      </router-link>

      <router-link to="/quiz" class="sidebar-link" active-class="active">
        <span class="text-xl">📝</span>
        <span>Quizler</span>
      </router-link>

      <router-link to="/chatbot" class="sidebar-link" active-class="active">
        <span class="text-xl">🤖</span>
        <span>Sohbet Botu</span>
      </router-link>

      <router-link to="/leaderboard" class="sidebar-link" active-class="active">
    <span class="text-xl">🏆</span>
    <span>Liderlik</span>
  </router-link>
    </nav>

    <div class="flex-grow"></div>

    <!-- Tema Toggle Butonu -->
    <button @click="toggleTheme"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      <span class="text-xl">🌗</span>
      <span>Tema</span>
    </button>

    <!-- Ayarlar -->
    <router-link to="/settings" class="sidebar-link mt-4" active-class="active">
      <span class="text-xl">⚙️</span>
      <span>Ayarlar</span>
    </router-link>

    <button
  @click="logout"
  class="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition mt-4"
>
  <span class="text-xl">🚪</span>
  <span>Çıkış Yap</span>
</button>
  </aside>
</template>

<script setup>
import { inject } from 'vue'

const isDarkMode = inject('isDarkMode')

function toggleTheme() {
  if (!isDarkMode || typeof isDarkMode.value === 'undefined') {
    console.warn('Dark mode bilgisi bulunamadı!')
    return
  }
  isDarkMode.value = !isDarkMode.value
}

import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}

import { jwtDecode } from 'jwt-decode'

let isAdmin = false;

const token = localStorage.getItem("token");
if (token) {
  try {
    const decoded = jwtDecode(token)
    isAdmin = decoded?.isAdmin === true;
  } catch (e) {
    console.warn("Token çözülemedi:", e);
  }
}
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150;
}

.router-link-active,
.router-link-exact-active,
.active {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold;
}
</style>