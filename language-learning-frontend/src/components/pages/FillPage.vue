<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
    <!-- Cümle -->
    <p class="text-lg text-gray-800 dark:text-gray-100" v-html="sentenceWithInput"></p>

    <!-- Giriş ve Buton -->
    <div class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="userInput"
        type="text"
        placeholder="Cevabınızı yazın"
        class="flex-1 px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="checkAnswer"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
        :disabled="answered"
      >
        Cevabı Kontrol Et
      </button>
    </div>

    <!-- Geri Bildirim -->
    <p v-if="feedback" :class="feedback.includes('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
      {{ feedback }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps(["content"]);
const emit = defineEmits(["answered"]);

const userInput = ref("");
const feedback = ref("");
const answered = ref(false);

const normalizedContent = computed(() => {
  try {
    const level1 = typeof props.content === 'string' ? JSON.parse(props.content) : props.content;
    const level2 = typeof level1.content === 'string' ? JSON.parse(level1.content) : level1.content;
    return level2;
  } catch (e) {
    console.warn("FillPage: içerik parse edilemedi:", e, props.content);
    return { sentence: "", answer: "" };
  }
});

const sentenceWithInput = computed(() =>
  normalizedContent.value.sentence?.replace("___", "<strong>___</strong>") || ""
);

function checkAnswer() {
  if (answered.value) return;
  answered.value = true;

  const correct = normalizedContent.value.answer?.trim().toLowerCase() || "";
  const given = userInput.value.trim().toLowerCase();
  const isCorrect = correct === given;

  feedback.value = isCorrect ? "✅ Doğru!" : `❌ Doğru cevap: ${normalizedContent.value.answer}`;
  emit("answered", isCorrect);
}
</script>