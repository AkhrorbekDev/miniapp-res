<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue'
import { isAuthenticated } from '@/services/authService.ts'
import { obtainToken } from '@/services/tokenService.ts'
import { createUserService } from '@/services'
import EventsPage from '@/views/EventsPage.vue'
import OnboardingScreen from '@/views/OnboardingScreen.vue'
import OnboardingForm from '@/views/OnboardingForm.vue'
import WelcomeScreen from '@/views/WelcomeScreen.vue'
import { useOnboardingStore } from '@/stores/onboarding.ts'
import { useRoute, useRouter } from 'vue-router'
import { questionnaireService } from '@/services/publicServices.ts'
import ProfilePage from '@/views/ProfilePage.vue'
import MobileMenu from '@/components/MobileMenu.vue'

const authorize = () => {}
const userPosition = ref(0)
const loading = ref(true)
const store = useOnboardingStore()
const showFormPages = ref(false)
const showOtherPages = ref(false)
const showWelcomeScreen = ref(false)
const router = useRouter()
const route = useRoute()
watchEffect(() => {
  if (route.params.page === 'wellcome-screen') {
    showWelcomeScreen.value = true
  } else if (route.params.page === 'onboarding-form') {
    showWelcomeScreen.value = false
    showFormPages.value = true
    showOtherPages.value = false
  } else {
    showWelcomeScreen.value = false
    showFormPages.value = false
    showOtherPages.value = true
  }
  console.log('Route changed:', route.params.page)
}, {})
onMounted(async () => {
  // const tgWebApp = window.Telegram.WebApp
  // tgWebApp.expand()

  // if (!isAuthenticated()) {
  // const initData = tgWebApp.initData
  // const user = tgWebApp.initDataUnsafe.user
  await obtainToken({
    initData:
      'user=%7B%22id%22%3A7734647288%2C%22first_name%22%3A%22Axrorbek%22%2C%22last_name%22%3A%22Nisonboyev%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Ffzu2xrBJyYZxqW-fgY7723OUbiYG5jOidi0O_tkiZoviC_p6GYwXdw-vz1gn11qw.svg%22%7D&chat_instance=5440438497840504175&chat_type=sender&auth_date=1747029133&signature=GsNjhBiBA6nQtJyUb2jYG4YcIyre7zhGj904LdhfHeEP1mcvPIENpGDkcCn4DpZPShohJ8EK6EZ5IlsRsNHDDw&hash=a3a54e2a98c2de153b145572a067e1f815e2171cfb6bbdf1a3df3fde6ae069a5',
    user: {
      id: 7734647288,
      first_name: 'Axrorbek',
      last_name: 'Nisonboyev',
      language_code: 'ru',
      allows_write_to_pm: true,
      photo_url:
        'https://t.me/i/userpic/320/fzu2xrBJyYZxqW-fgY7723OUbiYG5jOidi0O_tkiZoviC_p6GYwXdw-vz1gn11qw.svg',
    },
  })
    .then((response) => {
      // tgWebApp.showAlert('Вы успешно авторизованы')
    })
    .catch((error) => {
      // tgWebApp.showAlert('Ошибка авторизации')
    })
  // }

  await Promise.all([
    createUserService()
      .getUserPosition()
      .then((response) => {
        userPosition.value = response.position
        store.setPosition(response.position)
      }),
    createUserService()
      .getUserAnket()
      .then((response) => {
        store.setUserAnket(response)
      }),
    questionnaireService()
      .getDictionaries()
      .then((response) => {
        store.setDictionaries(response)
      })

  ])

  if (userPosition.value === 0) {
    router.push({
      params: {
        page: 'wellcome-screen',
      },
    })
  } else if (userPosition.value > 0 && userPosition.value < 11) {
    router.push({
      params: {
        page: 'onboarding-form',
      },
    })
  } else {
    router.push({
      params: {
        page: route.params.page || 'events-page',
      },
    })
  }

  loading.value = false
})
</script>

<template>
  <div v-if="loading" class="loading">loading...</div>
  <template v-else>
    <template v-if="showWelcomeScreen">
      <OnboardingScreen v-if="$route.params.page === 'onboarding-slides'" />
      <WelcomeScreen v-else />
    </template>
    <template v-else-if="showFormPages">
      <OnboardingForm v-if="$route.params.page === 'onboarding-form'" />
    </template>
    <template v-else>
      <div class="main-container without-padding">
        <EventsPage v-if="$route.params.page === 'events-page'" />
        <ProfilePage v-if="$route.params.page === 'profile'" />
        <MobileMenu />
      </div>

    </template>
  </template>
</template>

<style scoped lang="scss">
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
