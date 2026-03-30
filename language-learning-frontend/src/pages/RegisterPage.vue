<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 class="text-2xl font-bold text-center mb-6">📝 Kayıt Ol</h2>

      <form @submit.prevent="handleNext" class="space-y-4">
        <input
          v-model="name"
          placeholder="Ad Soyad"
          required
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          v-model="email"
          type="email"
          placeholder="E-posta"
          required
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Şifre"
          required
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Devam Et
        </button>
      </form>

      <p class="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
        Zaten hesabın var mı?
        <router-link to="/login" class="text-blue-600 dark:text-blue-400 hover:underline">Giriş Yap</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const router = useRouter();

function handleNext() {
  const userData = {
    name: name.value,
    email: email.value,
    password: password.value
  };
  localStorage.setItem("tempRegisterData", JSON.stringify(userData));
  router.push("/setup"); // SetupPage'e yönlendirme
}
</script>
