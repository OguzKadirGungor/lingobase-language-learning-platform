<template>
  <div class="space-y-6">
    <!-- Yönerge -->
    <div class="text-center">
      <p class="text-lg font-medium">{{ contentData.instruction }}</p>
    </div>

    <!-- Eşleştirme Satırları -->
    <div class="space-y-4">
      <div
        v-for="(pair, index) in contentData.pairs"
        :key="index"
        class="flex justify-center items-center gap-4"
      >
        <!-- Sol kelime -->
        <div class="bg-white dark:bg-gray-700 px-4 py-2 rounded shadow border border-gray-300 dark:border-gray-600 min-w-[120px] text-center">
          {{ pair.drag }}
        </div>

        <!-- Drop alanı -->
        <div
          class="dropzone bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded shadow border border-dashed border-gray-400 dark:border-gray-600 min-w-[120px] text-center"
          @dragover.prevent
          @drop="handleDrop(index, $event)"
        >
          {{ userAnswers[index] || 'Bırakınız' }}
        </div>
      </div>
    </div>

    <!-- Sürüklenebilir Sağ Taraf Kelimeleri -->
    <div class="flex justify-center gap-3 flex-wrap mt-6">
      <div
        v-for="(item, idx) in draggableItems"
        :key="idx"
        class="draggable bg-white dark:bg-gray-700 px-4 py-2 rounded shadow border border-gray-300 dark:border-gray-600 cursor-move"
        draggable="true"
        @dragstart="handleDragStart(item)"
      >
        {{ item }}
      </div>
    </div>

    <!-- Cevabı Kontrol Et Butonu -->
    <div class="text-center mt-6">
      <button
        @click="checkAnswers"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition"
      >
        Cevabı Kontrol Et
      </button>
    </div>

    <!-- Geri Bildirim -->
    <div v-if="isAnswered" class="text-center mt-4">
      <p v-if="isCorrect" class="text-green-600 dark:text-green-400 font-semibold">✅ Tüm eşleşmeler doğru!</p>
      <div v-else class="text-red-600 dark:text-red-400">
        <p class="font-semibold">❌ Bazı eşleşmeler yanlış. Doğru eşleşmeler:</p>
        <ul class="text-sm mt-2">
          <li v-for="(pair, i) in contentData.pairs" :key="i">
            {{ pair.drag }} → {{ pair.drop }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const props = defineProps(["content"]);
const emit = defineEmits(["answered"]);

const contentData = computed(() => {
  try {
    const raw = typeof props.content === "string" ? JSON.parse(props.content) : props.content;
    const inner = typeof raw.content === "string" ? JSON.parse(raw.content) : raw.content;
    return inner;
  } catch (e) {
    console.warn("DragDropPage: JSON parse hatası:", e, props.content);
    return { instruction: '', pairs: [] };
  }
});

const draggableItems = ref([]);
const draggedItem = ref(null);
const userAnswers = ref([]);
const isAnswered = ref(false);
const isCorrect = ref(false);

onMounted(() => {
  if (Array.isArray(contentData.value?.pairs)) {
    const rights = contentData.value.pairs.map(p => p.drop);
    draggableItems.value = shuffle(rights);
    userAnswers.value = Array(rights.length).fill("");
  } else {
    console.warn("DragDropPage: 'pairs' dizisi geçersiz:", props.content);
  }
});

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function handleDragStart(item) {
  draggedItem.value = item;
}

function handleDrop(index, event) {
  if (!draggedItem.value) return;
  userAnswers.value[index] = draggedItem.value;
  draggableItems.value = draggableItems.value.filter(i => i !== draggedItem.value);
  draggedItem.value = null;
}

function checkAnswers() {
  isAnswered.value = true;
  const correctAnswers = contentData.value.pairs.map(p => p.drop);
  isCorrect.value = JSON.stringify(userAnswers.value) === JSON.stringify(correctAnswers);
  emit("answered", isCorrect.value);
}
</script>

<style scoped>
.dropzone {
  min-height: 40px;
}
.draggable {
  user-select: none;
}
.dark .draggable {
  background-color: #1f2937;
}
</style>