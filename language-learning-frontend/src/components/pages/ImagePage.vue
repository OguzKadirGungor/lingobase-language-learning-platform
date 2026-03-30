<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-5">
    <!-- Görsel -->
    <div class="flex justify-center">
      <img
        :src="normalizedContent.imageUrl"
        alt="İçerik Görseli"
        class="max-w-xs rounded-lg shadow"
      />
    </div>

    <!-- Soru -->
    <p class="text-lg font-medium text-gray-800 dark:text-gray-100 text-center">
      {{ normalizedContent.question }}
    </p>

    <!-- Cevap Girişi -->
    <input
      v-model="userInput"
      placeholder="Cevabınızı yazın"
      class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <!-- Kontrol Butonu -->
    <button
      @click="checkAnswer"
      class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
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

const normalizedContent = computed(() => {
  try {
    const level1 = typeof props.content === "string" ? JSON.parse(props.content) : props.content;
    const level2 = typeof level1.content === "string" ? JSON.parse(level1.content) : level1.content;
    return level2;
  } catch (e) {
    console.warn("ImagePage: içerik parse edilemedi:", e, props.content);
    return {};
  }
});

const userInput = ref("");
const feedback = ref("");
const answered = ref(false);

function checkAnswer() {
  if (answered.value) return;
  answered.value = true;

  const correct = normalizedContent.value.correctAnswer?.trim().toLowerCase() || "";
  const given = userInput.value.trim().toLowerCase();
  const isCorrect = correct === given;

  feedback.value = isCorrect ? "✅ Doğru!" : `❌ Doğru cevap: ${normalizedContent.value.correctAnswer}`;
  emit("answered", isCorrect);
}
</script>
