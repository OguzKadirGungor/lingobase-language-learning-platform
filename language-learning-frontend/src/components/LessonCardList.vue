<template>
  <div class="grid grid-cols-1 gap-4">
    <div
      v-for="lesson in lessons"
      :key="lesson.lessonId"
      class="bg-white shadow-md p-5 rounded-xl hover:shadow-lg transition border border-gray-200"
    >
      <h3 class="text-lg font-semibold text-gray-800 mb-2">
        {{ lesson.Lesson.title }}
      </h3>

      <p class="text-sm text-gray-600 mb-2 line-clamp-3">
        {{ lesson.Lesson.description || 'Açıklama bulunmuyor.' }}
      </p>

      <div class="flex items-center justify-between mt-3">
        <span class="text-xs text-gray-500">
          Seviye: {{ lesson.Lesson.level }} <span v-if="lesson.Lesson.goal">| Hedef: {{ lesson.Lesson.goal }}</span>
        </span>

        <router-link
          :to="{
            path: '/lesson-player',
            query: { lessonId: lesson.lessonId, page: 1 }
          }"
          class="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Dersi Aç →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['lessons'])
</script>