<template>
  <div class="bg-white p-4 rounded-xl shadow">
    <h2 class="text-lg font-bold mb-2">📊 İstatistikler</h2>
    <ul class="text-sm text-gray-700 space-y-1">
      <li><strong>İsim:</strong> {{ user.fullName }}</li>
      <li><strong>Seviye:</strong> {{ user.languageLevel }}</li>
      <li><strong>Hedef:</strong> {{ user.learningGoal }}</li>
      <li><strong>Tamamlanan Ders:</strong> {{ user.lessonCount || 0 }}</li>
      <li><strong>Çözülmüş Quiz:</strong> {{ user.quizCount || 0 }}</li>
      <li><strong>Kazanılan Puan:</strong> {{ user.totalPoints || 0 }}</li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
</style>
