<template>
  <div class="grid grid-cols-1 gap-4">
    <div
      v-for="quiz in quizzes"
      :key="quiz.id"
      class="bg-white shadow-md p-5 rounded-xl hover:shadow-lg transition border border-gray-200"
    >
      <h3 class="text-lg font-semibold text-gray-800 mb-1">
        {{ quiz.title }}
      </h3>

      <p class="text-sm text-gray-600 mb-2">
        Ders: {{ quiz.Lesson?.title || 'Bilinmiyor' }}
      </p>

      <p class="text-xs text-gray-500 mb-3">
        Seviye: {{ quiz.Lesson?.level || 'Belirtilmemiş' }}
      </p>

      <router-link
        :to="`/quiz/${quiz.id}`"
        class="inline-block bg-purple-600 text-white text-sm px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Quizi Başlat →
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps(['quizzes'])
</script>