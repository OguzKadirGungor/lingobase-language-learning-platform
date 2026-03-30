import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import LessonsPage from "../pages/LessonsPage.vue";
import LessonPlayerPage from "../pages/LessonPlayerPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import ChatBotPage from "../pages/ChatBotPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import QuizPage from "../pages/QuizPage.vue";
import QuizDetailPage from "../pages/QuizDetailPage.vue";
import MainLayout from '../layouts/MainLayout.vue'
import SettingsPage from "../pages/SettingsPage.vue";
import LeaderboardPage from "../pages/LeaderboardPage.vue";
import SetupPage from "../pages/SetupPage.vue";
import AdminDashboardPage from "../pages/AdminDashboardPage.vue";

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '/home', component: HomePage },
      { path: '/lessons', component: LessonsPage },
      { path: '/chatbot', component: ChatBotPage },
      { path: '/quiz', component: QuizPage },
      { path: '/quiz/:id', name: 'quiz-detail', component: QuizDetailPage },
      { path: '/profile', component: ProfilePage },
      { path: '/settings', component: SettingsPage },
      { path: '/leaderboard', component: LeaderboardPage },
{
  path: '/lesson-player/:lessonId/:page',
  name: 'lesson-player',
  component: LessonPlayerPage
},
{ path: '/admin', name: 'admin-dashboard', component: AdminDashboardPage, meta: { requiresAuth: true, isAdmin: true } }
    ]
  },

  // Giriş ve kayıt sayfaları layout'suz çalışacak
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/setup', component: SetupPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Giriş kontrolü (optional)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router;