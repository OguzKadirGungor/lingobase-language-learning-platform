<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 text-gray-900 dark:text-gray-100">
    <div class="max-w-3xl mx-auto space-y-8">

      <!-- Başlık -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
        <h2 v-if="pageData" class="text-2xl font-bold text-blue-700 dark:text-blue-300">
           {{ getPageTitle(pageData) || ('Sayfa ' + pageData.pageNumber) }}
        </h2>
        <p v-if="!pageData && !showResult" class="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
      </div>

      <!-- İçerik -->
      <div v-if="pageData" class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <component
          :is="getComponent(pageData.type)"
          :content="pageData.content"
          @answered="handleAnswer"
        />
      </div>

      <!-- Sonuç Kartı -->
      <div v-if="showResult" class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center space-y-4">
        <p class="text-xl font-semibold">🎉 Ders Tamamlandı!</p>
        <p class="text-sm">Doğru: {{ correct }} / {{ total }}</p>
        <p class="text-sm">Başarı: {{ percentage }}%</p>

        <div v-if="percentage >= 50" class="text-green-600 dark:text-green-400 font-medium">
          <p>✅ Quiz kilidiniz açıldı!</p>
          <button @click="goToQuiz"
            class="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Quiz'e Başla
          </button>
        </div>

        <!-- Başarısızsa Alternatifler -->
        <div v-else class="text-red-600 dark:text-red-400 font-medium space-y-4">
          <p>❌ Quiz için başarı oranı yetersiz.</p>
          <div class="flex justify-center gap-4">
            <button
              @click="restartLesson"
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm transition"
            >
              Derse Tekrar Başla
            </button>
            <button
              @click="goHome"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>

      <!-- Buton -->
      <div v-if="!showResult && pageData" class="text-center">
        <button
          @click="nextPage"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm transition"
        >
          {{ isLastPage ? 'Dersi Bitir' : 'Sonraki Sayfa →' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

// Sayfa bileşenleri
import FillPage from "../components/pages/FillPage.vue";
import McqPage from "../components/pages/McqPage.vue";
import ListenPage from "../components/pages/ListenPage.vue";
import ImagePage from "../components/pages/ImagePage.vue";
import MatchPage from "../components/pages/MatchPage.vue";
import ReorderPage from "../components/pages/ReorderPage.vue";
import DragDropPage from "../components/pages/DragDropPage.vue";
import TextPage from "../components/pages/TextPage.vue";

const route = useRoute();
const router = useRouter();

const lessonId = route.params.lessonId;
const pageNumber = ref(parseInt(route.params.page) || 1);

const pageData = ref(null);
const totalPages = ref(0);
const showResult = ref(false);

const correct = ref(parseInt(route.query.correct) || 0)
const total = ref(parseInt(route.query.total) || 0)

const answeredPages = ref(new Set());

const percentage = computed(() =>
  total.value === 0 ? 0 : Math.round((correct.value / total.value) * 100)
);

const isLastPage = computed(() => pageNumber.value === totalPages.value);

// Toast için setup
const { proxy } = getCurrentInstance();

function getComponent(type) {
  switch (type) {
    case "fill": return FillPage;
    case "mcq": return McqPage;
    case "listen": return ListenPage;
    case "image": return ImagePage;
    case "match": return MatchPage;
    case "reorder": return ReorderPage;
    case "drag-drop": return DragDropPage;
    case "text": return TextPage;
    case "info": return TextPage;
    default: return null;
  }
}

async function loadPage() {
  try {
    const token = localStorage.getItem("token");

    const allPagesRes = await axios.get(`http://localhost:3000/api/lesson-pages/${lessonId}/pages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    totalPages.value = allPagesRes.data.length;

    const pageRes = await axios.get(`http://localhost:3000/api/lesson-pages/${lessonId}/page/${pageNumber.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (pageRes.data && pageRes.data.pageNumber) {
      pageData.value = pageRes.data;
      showResult.value = false;
    } else {
      showResult.value = true;
      pageData.value = null;
    }
  } catch (err) {
    console.warn("Son sayfa veya hata:", err.message);
    pageData.value = null;
    showResult.value = true;
  }
}
function handleAnswer(isCorrect) {
  total.value++;
  if (isCorrect) correct.value++;
}

function nextPage() {
  if (isLastPage.value) {
    showResult.value = true;
    pageData.value = null;
    return;
  }

  const next = pageNumber.value + 1;
   router.push({
    name: "lesson-player",
    params: { lessonId, page: next },
    query: {
      correct: correct.value,
      total: total.value
    }
  });
}

function restartLesson() {
  router.push({ name: "lesson-player", params: { lessonId, page: 1 } });
}

function goHome() {
  router.push("/home");
}

async function goToQuiz() {
  try {
    const token = localStorage.getItem("token");

    // Yalnızca başarılıysa ilerlemeyi güncelle
    let badgeList = [];
    if (percentage.value >= 50) {
      const res = await axios.put(
        `http://localhost:3000/api/user-lessons/${lessonId}/progress`,
        { progress: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Rozet varsa toast göster
      if (res.data.awardedBadges && res.data.awardedBadges.length > 0) {
        badgeList = res.data.awardedBadges;
        proxy?.$refs.globalToast?.showMultipleToasts(badgeList);
      }
    }

    // Derse ait quiz’i al
    const quizRes = await axios.get(`http://localhost:3000/api/quizzes/lesson/${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const quizId = quizRes.data.id;

    if (!quizId) {
      alert("Quiz bulunamadı.");
      return;
    }

    // Quiz sayfasına yönlendir
    router.push({ name: "quiz-detail", params: { id: quizId } });

  } catch (err) {
    console.error("Quiz yönlendirme hatası:", err);
    alert("Quiz sayfasına gidilemedi.");
  }
}

function getPageTitle(page) {
  try {
    const content = typeof page.content === "string" ? JSON.parse(page.content) : page.content;
    const inner = typeof content.content === "string" ? JSON.parse(content.content) : content.content;
    return inner?.title || null;
  } catch {
    return null;
  }
}

onMounted(() => {
  if (pageNumber.value === 1) {
    correct.value = 0
    total.value = 0
  }
  loadPage()
})

watch(() => pageNumber.value, () => {
  loadPage();
});

watch(() => route.query, () => {
  correct.value = parseInt(route.query.correct) || 0
  total.value = parseInt(route.query.total) || 0
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
</style>
