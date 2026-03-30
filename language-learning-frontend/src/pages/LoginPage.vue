<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">🔐 Giriş Yap</h2>

      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Şifre</label>
          <input
            type="password"
            v-model="password"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
        >
          Giriş Yap
        </button>

        <p class="text-sm text-center mt-4">
          Hesabınız yok mu?
          <router-link to="/register" class="text-blue-600 hover:underline dark:text-blue-400">Kayıt Olun</router-link>
        </p>

        <p v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();

async function login() {
  error.value = "";
  try {
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      email: email.value,
      password: password.value,
    });

    const token = res.data.token;
    localStorage.setItem("token", token);
    router.push("/home");
  } catch (err) {
    error.value = err.response?.data?.error || "Giriş başarısız.";
  }
}
</script>

<style scoped>
/* İsteğe bağlı scrollbar temizliği */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
</style>
