<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
    <!-- Soru -->
    <p class="text-lg font-medium text-gray-800 dark:text-gray-100">
      {{ normalizedContent.question }}
    </p>

    <!-- Seçenekler -->
    <div class="space-y-3">
      <label
        v-for="option in normalizedContent.options"
        :key="option"
        class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer transition hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        <input
          type="radio"
          :value="option"
          v-model="userAnswer"
          class="form-radio text-blue-600 dark:text-blue-400"
        />
        <span class="text-sm text-gray-800 dark:text-gray-100">{{ option }}</span>
      </label>
    </div>

    <!-- Buton -->
    <button
      @click="checkAnswer"
      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition disabled:opacity-50"
      :disabled="answered"
    >
      Cevabı Kontrol Et
    </button>

    <!-- Geri Bildirim -->
    <p
      v-if="feedback"
      :class="feedback.includes('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
      class="text-sm"
    >
      {{ feedback }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps(["content"]);
const emit = defineEmits(["answered"]);

const userAnswer = ref("");
const feedback = ref("");
const answered = ref(false);

const normalizedContent = computed(() => {
  try {
    const parsed1 = typeof props.content === 'string' ? JSON.parse(props.content) : props.content;
    const parsed2 = typeof parsed1.content === 'string' ? JSON.parse(parsed1.content) : parsed1.content;
    return parsed2;
  } catch (err) {
    console.warn("MCQPage: JSON parse hatası:", err);
    return { question: '', options: [], correctAnswer: '' };
  }
});

function checkAnswer() {
  if (answered.value || !userAnswer.value) return;
  answered.value = true;

  const correct = normalizedContent.value.correctAnswer?.trim().toLowerCase();
  const given = userAnswer.value.trim().toLowerCase();
  const isCorrect = correct === given;

  feedback.value = isCorrect
    ? "✅ Doğru!"
    : `❌ Doğru cevap: ${normalizedContent.value.correctAnswer}`;
  emit("answered", isCorrect);
}
</script>
