import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:page?/:page2?',
      name: 'home',
      component: () => import('@/views/WelcomeScreen.vue'),
    },
    // {
    //   path: '/onboarding',
    //   name: 'onboarding',
    //   component: () => import('@/views/OnboardingScreen.vue'),
    // },
    // {
    //   path: '/onboarding-form',
    //   name: 'onboarding-form',
    //   component: () => import('@/views/OnboardingForm.vue'),
    // },
    // {
    //   path: '/events',
    //   name: 'events',
    //   component: () => import('@/views/EventsPage.vue'),
    // }
  ],
})

export default router
