<template>
  <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
    <div
      v-for="(toast, index) in toasts"
      :key="index"
      class="px-4 py-2 bg-green-600 text-white rounded shadow-lg animate-fade-in-out"
    >
      🏅 {{ toast.icon }} <strong>{{ toast.title }}</strong>: {{ toast.description }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])

function showToast(badge) {
  toasts.value.push(badge)

  setTimeout(() => {
    toasts.value.shift()
  }, 3500)
}

function showMultipleToasts(badgeList) {
    console.log("Toast gösteriliyor:", badgeList);
  badgeList.forEach((badge, i) => {
    setTimeout(() => showToast(badge), i * 600)
  })
}

function showLockedToast(lesson) {
  if (lesson.locked && lesson.prerequisiteLessonId) {
    const { proxy } = getCurrentInstance()
    proxy?.$refs.globalToast?.showToast({
      icon: "🔒",
      title: "Kilitli Ders",
      description: `Bu derse erişmek için önce '${getLessonTitleById(lesson.prerequisiteLessonId)}' dersini tamamlamalısın.`
      // type: "error" // istersen tip de ekle!
    })
  }
}

// Bu fonksiyonları dışarıya aç
defineExpose({ showToast, showMultipleToasts, showLockedToast })
</script>

<style scoped>
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}

.animate-fade-in-out {
  animation: fadeInOut 3.5s ease-in-out forwards;
}
</style>