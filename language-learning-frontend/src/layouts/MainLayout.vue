<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="layout-container">
      <div class="sidebar-wrapper">
        <Sidebar />
      </div>
      <main class="ml-0 sm:ml-64 px-4 py-6 transition-all">
        <router-view :key="$route.fullPath" />
        <GlobalToast ref="globalToast" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, provide, onMounted, getCurrentInstance } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import GlobalToast from '../components/GlobalToast.vue'
import { setGlobalToastRef } from "../composables/useToast"

const isDarkMode = ref(false)
const instance = getCurrentInstance()
onMounted(() => {
  const saved = localStorage.getItem('darkMode')
  if (saved) isDarkMode.value = saved === 'true'
  // Burada global ref'i ayarla:
  setGlobalToastRef(instance?.proxy?.$refs.globalToast)
})

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value)
})

provide('isDarkMode', isDarkMode)
</script>