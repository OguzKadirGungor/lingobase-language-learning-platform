<template>
  <div class="space-y-6">


    <!-- Açıklama Metni -->
    <p class="text-base whitespace-pre-line">
      {{ normalizedContent.body }}
    </p>

    <!-- Görsel (Varsa) -->
    <div v-if="normalizedContent.imageUrl" class="text-center">
     <img
  :src="normalizedContent.imageUrl"
  alt="Açıklayıcı görsel"
  :class="`mx-auto rounded-lg border border-gray-300 dark:border-gray-700 shadow ${normalizedContent.imageClass || 'max-h-[300px]'}`"
/>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["content"]);

const normalizedContent = computed(() => {
  try {
    const level1 = typeof props.content === "string" ? JSON.parse(props.content) : props.content;
    const level2 = typeof level1.content === "string" ? JSON.parse(level1.content) : level1.content;
    return level2;
  } catch (e) {
    console.warn("TextPage: içerik parse edilemedi:", e, props.content);
    return {};
  }
});
</script>

<style scoped>
img {
  
  object-fit: contain;
}
</style>