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
const mobileMenu = ref(null)
onMounted(async () => {
  const tgWebApp = window.Telegram.WebApp
  tgWebApp.expand()

  if (!isAuthenticated()) {
    const initData = tgWebApp.initData
    const user = tgWebApp.initDataUnsafe.user
    await obtainToken({
      initData,
      user,
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
        <ProfilePage v-if="$route.params.page === 'profile'" />

        <Transition name="page-drawer-top">
          <ProfileEdit v-if="$route.params.page2 === 'edit-profile'" />
        </Transition>
        <Transition name="page-drawer-top">
          <ProfileSettings v-if="$route.params.page2 === 'profile-settings'" />
        </Transition>
        <Transition name="page-drawer-top">
          <ProfileEvents v-if="$route.params.page2 === 'profile-events'" />
        </Transition>
        <MobileMenu ref="mobileMenu" />
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

/* ✅ Обновлённые transition-классы для drawer */
.page-drawer-enter-active,
.page-drawer-leave-active {
  transition: transform 0.3s ease-out;
}

/* 👈 Вход слева (слева направо) */
.page-drawer-enter-from {
  transform: translateX(100%);
}

/* 👉 Выход направо (из центра вправо) */
.page-drawer-leave-to {
  transform: translateX(-100%);
}

/* 🔄 Анимация затемнения оверлея */
.page-drawer-enter-active .page-drawer-overlay,
.page-drawer-leave-active .page-drawer-overlay {
  transition: opacity 0.3s ease-out;
}

.page-drawer-enter-from .page-drawer-overlay,
.page-drawer-leave-to .page-drawer-overlay {
  opacity: 0;
}

// Transition animations top
.page-drawer-top-enter-active,
.page-drawer-top-leave-active {
  transition: transform 0.3s ease-out;
}

.page-drawer-top-enter-from,
.page-drawer-top-leave-to {
  transform: translateX(100%);
}

.page-drawer-top-enter-active .page-drawer-top-overlay,
.page-drawer-top-leave-active .page-drawer-top-overlay {
  transition: opacity 0.3s ease-out;
}

.page-drawer-top-enter-from .page-drawer-top-overlay,
.page-drawer-top-leave-to .page-drawer-top-overlay {
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
