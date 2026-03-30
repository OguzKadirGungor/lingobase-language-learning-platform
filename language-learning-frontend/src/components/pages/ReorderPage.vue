<template>
  <div class="space-y-6">
    <!-- Yönerge -->
    <div class="text-center">
      <p class="text-lg font-medium">{{ contentData.instruction }}</p>
    </div>

    <!-- Sıralanabilir Kelimeler -->
    <draggable
      v-if="Array.isArray(contentData.words)"
      v-model="userOrder"
      class="flex flex-wrap justify-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl min-h-[70px]"
      item-key="word"
    >
      <template #item="{ element }">
        <div class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow text-sm">
          {{ element }}
        </div>
      </template>
    </draggable>

    <!-- Cevabı Kontrol Et Butonu -->
    <div class="text-center">
      <button
        @click="checkAnswer"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition"
      >
        Cevabı Kontrol Et
      </button>
    </div>

    <!-- Geri Bildirim -->
    <div v-if="isAnswered" class="text-center mt-4">
      <p v-if="isCorrect" class="text-green-600 dark:text-green-400 font-semibold">✅ Doğru!</p>
      <div v-else class="text-red-600 dark:text-red-400 space-y-2">
        <p class="font-semibold">❌ Yanlış. Doğru Sıralama:</p>
        <p class="text-sm">{{ contentData.correctOrder.join(" ") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import draggable from "vuedraggable";

const props = defineProps(["content"]);
const emit = defineEmits(["answered"]);

const contentData = computed(() => {
  try {
    const raw = typeof props.content === "string" ? JSON.parse(props.content) : props.content;
    const inner = typeof raw.content === "string" ? JSON.parse(raw.content) : raw.content;
    return inner;
  } catch (e) {
    console.warn("ReorderPage: JSON parse hatası:", e, props.content);
    return {};
  }
});

const userOrder = ref([]);
const isAnswered = ref(false);
const isCorrect = ref(false);

onMounted(() => {
  if (Array.isArray(contentData.value.words)) {
    userOrder.value = [...contentData.value.words].sort(() => Math.random() - 0.5);
  } else {
    console.warn("ReorderPage: 'words' dizisi geçersiz veya eksik:", props.content);
  }
});

function checkAnswer() {
  if (!Array.isArray(userOrder.value) || !Array.isArray(contentData.value.correctOrder)) return;

  isAnswered.value = true;
  isCorrect.value = JSON.stringify(userOrder.value) === JSON.stringify(contentData.value.correctOrder);
  emit("answered", isCorrect.value);
}
</script>

<style scoped>
/* Tema uyumlu küçük stiller */
.dark .draggable {
  background-color: #1f2937;
}
</style>