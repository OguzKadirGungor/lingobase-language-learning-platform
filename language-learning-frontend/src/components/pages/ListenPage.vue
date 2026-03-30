<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-5">
    <!-- Soru -->
    <p class="text-lg font-medium text-gray-800 dark:text-gray-100">
      {{ normalizedContent.question }}
    </p>

    <!-- Ses -->
    <audio
      :src="normalizedContent.audioUrl"
      controls
      class="w-full mt-2"
    ></audio>

    <!-- Seçenekler -->
    <div class="grid grid-cols-2 gap-4 mt-4">
      <button
        v-for="(option, index) in normalizedContent.options"
        :key="index"
        @click="selectOption(option)"
        :disabled="answered"
        class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600 transition"
        :class="{
          'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100': answered && option === normalizedContent.correctAnswer,
          'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100': answered && option === selected && option !== normalizedContent.correctAnswer
        }"
      >
        {{ option }}
      </button>
    </div>

    <!-- Geri Bildirim -->
    <p
      v-if="feedback"
      :class="feedback.includes('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
      class="text-sm mt-3"
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
    console.warn("ListenPage: içerik parse edilemedi:", e, props.content);
    return {};
  }
});

const selected = ref("");
const feedback = ref("");
const answered = ref(false);

function selectOption(option) {
  if (answered.value) return;
  selected.value = option;
  answered.value = true;

  const isCorrect = option === normalizedContent.value.correctAnswer;
  feedback.value = isCorrect ? "✅ Doğru!" : `❌ Doğru cevap: ${normalizedContent.value.correctAnswer}`;
  emit("answered", isCorrect);
}
</script>