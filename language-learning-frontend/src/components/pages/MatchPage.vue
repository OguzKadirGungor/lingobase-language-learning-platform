<template>
  <!-- Başlık -->
  <div class="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
    Lütfen eşleştirmeleri yapın
  </div>

  <!-- Eşleştirme Alanı -->
  <div class="relative pb-10">
    <!-- Çizgiler (eşleşmeleri gösterir) -->
    <svg class="match-lines" ref="svgRef">
      <line
        v-for="(match, index) in matchedPairs"
        :key="'line-' + index"
        :x1="getLeftCenter(match.leftIndex).x"
        :y1="getLeftCenter(match.leftIndex).y"
        :x2="getRightCenter(match.rightIndex).x"
        :y2="getRightCenter(match.rightIndex).y"
        :stroke="match.isCorrect === true ? 'green' : match.isCorrect === false ? 'red' : 'black'"
        stroke-width="2"
      />
    </svg>

    <!-- Sol ve Sağ Sütun -->
    <div class="match-container" style="display: flex; justify-content: space-between; gap: 80px;">
      <!-- Sol -->
      <div class="column">
        <div
          v-for="(item, index) in normalizedContent.pairs"
          :key="'left-' + index"
          class="match-item"
          :class="{ selected: selectedSide === 'left' && selectedIndex === index }"
          @click="select('left', index)"
          :ref="el => setLeftRef(el, index)"
        >
          {{ item.left }}
        </div>
      </div>

      <!-- Sağ -->
      <div class="column">
        <div
          v-for="(item, index) in shuffledRight"
          :key="'right-' + index"
          class="match-item"
          :class="{ selected: selectedSide === 'right' && selectedIndex === index }"
          @click="select('right', index)"
          :ref="el => setRightRef(el, index)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>

  <!-- Kontrol Butonu -->
  <div class="text-center mt-6">
    <button
      @click="checkAnswers"
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition"
    >
      Cevabı Kontrol Et
    </button>
  </div>

  <!-- Yanlış Geri Bildirim -->
  <div v-if="wrongFeedbacks.length > 0" class="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
    <h4 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">❌ Yanlış Eşleşmelerin Doğruları:</h4>
    <ul class="text-sm text-gray-800 dark:text-gray-100 space-y-1">
      <li v-for="(item, index) in wrongFeedbacks" :key="index">
        <strong>{{ item.left }}</strong>: "{{ item.userAnswer }}" ❌ → ✅ "{{ item.correctAnswer }}"
      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";

const props = defineProps(["content"]);
const emit = defineEmits(["answered"]);

const normalizedContent = computed(() => {
  try {
    const level1 = typeof props.content === "string" ? JSON.parse(props.content) : props.content;
    const level2 = typeof level1.content === "string" ? JSON.parse(level1.content) : level1.content;
    return level2;
  } catch (e) {
    console.warn("MatchPage: içerik parse edilemedi:", e, props.content);
    return {};
  }
});

const leftRefs = ref([]);
const rightRefs = ref([]);

function setLeftRef(el, index) {
  if (el) leftRefs.value[index] = el;
}
function setRightRef(el, index) {
  if (el) rightRefs.value[index] = el;
}

const shuffledRight = ref([]);
const matchedPairs = ref([]);
const wrongFeedbacks = ref([]);
const selectedSide = ref(null);
const selectedIndex = ref(null);

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

onMounted(() => {
  leftRefs.value = [];
  rightRefs.value = [];
  shuffledRight.value = shuffle(normalizedContent.value.pairs.map(p => p.right));
});

function select(side, index) {
  if (selectedSide.value === side && selectedIndex.value === index) {
    selectedSide.value = null;
    selectedIndex.value = null;
    return;
  }

  if (!selectedSide.value) {
    selectedSide.value = side;
    selectedIndex.value = index;
    return;
  }

  if (selectedSide.value !== side) {
    matchedPairs.value.push({
      leftIndex: side === "right" ? selectedIndex.value : index,
      rightIndex: side === "right" ? index : selectedIndex.value,
      isCorrect: null
    });

    selectedSide.value = null;
    selectedIndex.value = null;
  }
}

const svgRef = ref(null);

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  const svgRect = svgRef.value.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - svgRect.left,
    y: rect.top + rect.height / 2 - svgRect.top
  };
}

function getLeftCenter(index) {
  return getOffset(leftRefs.value[index]);
}
function getRightCenter(index) {
  return getOffset(rightRefs.value[index]);
}

function checkAnswers() {
  matchedPairs.value = matchedPairs.value.map(match => {
    const correctRight = normalizedContent.value.pairs[match.leftIndex].right;
    const chosenRight = shuffledRight.value[match.rightIndex];
    return {
      ...match,
      isCorrect: correctRight === chosenRight
    };
  });

  const wrongMatches = matchedPairs.value.filter(m => m.isCorrect === false);
  wrongFeedbacks.value = wrongMatches.map(match => {
    return {
      left: normalizedContent.value.pairs[match.leftIndex].left,
      correctAnswer: normalizedContent.value.pairs[match.leftIndex].right,
      userAnswer: shuffledRight.value[match.rightIndex]
    };
  });

  const correctCount = matchedPairs.value.filter(m => m.isCorrect).length;
  emit("answered", correctCount === matchedPairs.value.length);
}
</script>

<style scoped>
.match-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  margin-top: 24px;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
}

.match-item {
  padding: 14px 20px;
  background-color: #f3f4f6;
  border: 2px solid #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  user-select: none;
  min-width: 160px;
  font-size: 1rem;
  transition: all 0.2s ease;
}
.match-item:hover {
  background-color: #e5e7eb;
}
.match-item.selected {
  border-color: #3b82f6;
  background-color: #dbeafe;
}

.match-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* Dark Mode */
.dark .match-item {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}
.dark .match-item:hover {
  background-color: #4b5563;
}
.dark .match-item.selected {
  background-color: #1d4ed8;
  border-color: #2563eb;
  color: white;
}
</style>