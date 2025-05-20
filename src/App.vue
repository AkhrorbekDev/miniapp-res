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
import ProfileEdit from '@/views/ProfileEdit.vue'
import ProfileEvents from '@/views/ProfileEvents.vue'
import ProfileSettings from '@/views/ProfileSettings.vue'
import ContactsPage from '@/views/ContactsPage.vue'

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
  if (route.params.page === 'wellcome-screen' || route.params.page === 'onboarding-slides') {
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
  const tgWebApp = window.Telegram.WebApp
  tgWebApp.expand()

  if (!isAuthenticated()) {
    const initData = tgWebApp.initData
    const user = tgWebApp.initDataUnsafe.user
    await obtainToken({
      initData:
        'query_id=AAFtdFMsAAAAAG10UyxZvue0&user=%7B%22id%22%3A743666797%2C%22first_name%22%3A%22%D0%90%D1%85%D1%80%D0%BE%D1%80%D0%B1%D0%B5%D0%BA%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Axrorbek_Nisonboyev%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FHLDiKRsokTnWGzxv8U2t8CBmhwPobri_-tGTwZs0SLc.svg%22%7D&auth_date=1747749509&signature=q1ehODMj7bIqb7Q-QO-dA0e7enp-LLf1OIU6D6RE0JEoxyRc36QcnHJc0Be_mpEFlGd6OUcLGjdDBtKG1Y8lDg&hash=b37c18996c4280abafe4e1a97b5edb99e10decd4402ebe5df50a63ee9fee678b',
      user: {
        allows_write_to_pm: true,
        first_name: 'Ахрорбек',
        id: 743666797,
        is_premium: true,
        language_code: 'ru',
        last_name: '',
        photo_url: 'https://t.me/i/userpic/320/HLDiKRsokTnWGzxv8U2t8CBmhwPobri_-tGTwZs0SLc.svg',
        username: 'Axrorbek_Nisonboyev',
      },
    })
      .then((response) => {
        // tgWebApp.showAlert('Вы успешно авторизованы')
      })
      .catch((error) => {
        tgWebApp.showAlert('Ошибка авторизации')
      })
  }

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
      }),
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
        <ContactsPage v-if="$route.params.page === 'contacts-page'" />
        <Transition name="page-drawer">
          <ProfilePage v-if="$route.params.page === 'profile'" />
        </Transition>
        <Transition name="page-drawer">
          <ProfileEdit v-if="$route.params.page2 === 'edit-profile'" />
        </Transition>
        <Transition name="page-drawer">
          <ProfileSettings v-if="$route.params.page2 === 'profile-settings'" />
        </Transition>
        <Transition name="page-drawer">
          <ProfileEvents v-if="$route.params.page2 === 'profile-events'" />
        </Transition>
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

// Transition animations
.page-drawer-enter-active,
.page-drawer-leave-active {
  transition: transform 0.3s ease-out;
}

.page-drawer-enter-from,
.page-drawer-leave-to {
  transform: translateX(100%);
}

.page-drawer-enter-active .page-drawer-overlay,
.page-drawer-leave-active .page-drawer-overlay {
  transition: opacity 0.3s ease-out;
}

.page-drawer-enter-from .page-drawer-overlay,
.page-drawer-leave-to .page-drawer-overlay {
  opacity: 0;
}
</style>
<style lang="scss">
.controls-modal {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .controls-modal__header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 12px;

    svg {
      width: 60px;
      height: 60px;
    }

    .modal-title {
      color: var(--primary-dark, #291e1e);
      text-align: center;

      /* H2 */
      font-family: 'Sofia Sans Extra Condensed';
      font-size: 34px;
      font-style: normal;
      font-weight: 800;
      line-height: 34px; /* 100% */
      text-transform: uppercase;
    }

    .modal-description {
      color: var(--primary-dark, #291e1e);
      text-align: center;

      /* Text Medium */
      font-family: Manrope;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.6px;
    }

    .modal-description1 {
      color: var(--primary-dark, #291e1e);
      text-align: center;

      /* Text Medium */
      font-family: Manrope;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.6px;
    }
  }

  &__footer {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
