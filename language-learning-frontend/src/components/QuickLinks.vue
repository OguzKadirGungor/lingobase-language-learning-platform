<template>
  <div class="bg-white p-4 rounded-xl shadow">
    <h2 class="text-lg font-bold mb-2">🔗 Hızlı Erişim</h2>
    <ul class="space-y-2 text-sm">
      <li>
        <router-link to="/profile" class="text-blue-600 hover:underline">
          👤 Profilini Görüntüle
        </router-link>
      </li>
      <li>
        <router-link to="/leaderboard" class="text-blue-600 hover:underline">
          🏆 Liderlik Tablosu
        </router-link>
      </li>
      <li>
        <router-link to="/missions" class="text-blue-600 hover:underline">
          🎯 Günlük Görevler
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
