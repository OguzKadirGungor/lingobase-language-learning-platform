<template>
  <div class="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition text-gray-900 dark:text-gray-100">
    <!-- Başlık -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">💬 Sohbet Botu</h1>
      <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">İngilizce pratiği için hazır mısın?</p>
    </div>

    <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col h-[80vh]">
      <!-- Chat Alanı -->
      <div ref="chatBox" class="flex-1 overflow-y-auto p-6 space-y-4">
        <div v-for="(msg, index) in messages" :key="index"
          :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']">
          <div :class="['max-w-[70%] px-4 py-2 rounded-xl text-sm leading-relaxed',
            msg.sender === 'user'
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
          ]">
            <span>{{ msg.text }}</span>
          </div>
        </div>
      </div>

      <!-- Önerilen Sorular -->
      <div v-if="suggestedMessages.length"
        class="border-t border-gray-200 dark:border-gray-600 px-6 py-3 flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-900">
        <span class="text-sm text-gray-500 dark:text-gray-400">Önerilen Sorular:</span>
        <button v-for="(suggestion, index) in suggestedMessages" :key="index"
          class="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700 transition"
          @click="sendSuggestedMessage(suggestion)">
          {{ suggestion }}
        </button>
      </div>

      <!-- Mesaj Girişi -->
      <form @submit.prevent="sendMessage"
        class="flex items-center border-t border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 rounded-b-2xl">
        <input v-model="userInput" type="text" placeholder="Mesajınızı yazın..."
          class="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 rounded-full px-4 py-2 mr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm transition">
          Gönder
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { globalToastRef } from "../composables/useToast"

import { getCurrentInstance } from 'vue'

let proxy = null

const router = useRouter()
const token = localStorage.getItem('token')
if (!token) router.push('/login')

const chatBox = ref(null)
const userInput = ref('')
const messages = ref([])
const suggestedMessages = ref([])

function appendMessage(sender, text) {
  messages.value.push({ sender, text })
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}

async function loadChatHistory() {
  try {
    const res = await axios.get('http://localhost:3000/api/chatbot/history', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const history = res.data
    history.forEach(entry => {
      appendMessage('user', entry.userMessage)
      appendMessage('bot', entry.botResponse)
    })
  } catch (err) {
    console.error('Geçmiş mesaj hatası:', err)
  }
}

async function sendMessage() {
  const message = userInput.value.trim()
  if (!message) return

  appendMessage('user', message)
  userInput.value = ''

  try {
    const res = await axios.post(
      'http://localhost:3000/api/chatbot',
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (res.data.response) {
      appendMessage('bot', res.data.response)
      console.log("Badge listesi:", res.data.badges);  
        if (res.data.badges?.length) {
           
          globalToastRef.value?.showMultipleToasts(res.data.badges)
        }
    

      if (res.data.suggestions) {
        suggestedMessages.value = res.data.suggestions
      }
    } else {
      appendMessage('bot', '⚠️ Chatbot’tan yanıt alınamadı.')
    }
  } catch (err) {
    console.error('Chatbot hatası:', err)
    appendMessage('bot', '⚠️ Chatbot ile iletişim kurulamadı.')
  }
}

function sendSuggestedMessage(text) {
  userInput.value = text
  sendMessage()
}

onMounted(() => {
  loadChatHistory()
  const instance = getCurrentInstance()
  proxy = instance?.proxy
})
</script>

<style scoped>
/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
</style>
