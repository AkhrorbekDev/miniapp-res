<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.ts'
import notProfile from '@/assets/img/notProfile.jpg'
import { useRouter } from 'vue-router'
import MobileMenu from '@/components/MobileMenu.vue'
import BaseBottomSheet from '@/components/base/BaseBottomSheet.vue'
import { createUserService } from '@/services'

const user = ref({})
const store = useOnboardingStore()
const router = useRouter()
const _showDeleteModal = ref(false)
const showDeleteModal = () => {
  _showDeleteModal.value = true
}

const closeDeleteModal = () => {
  _showDeleteModal.value = false
  store.deleteUser()
  createUserService().changePosition(0)
  router.push({
    params: {
      page: 'wellcome-screen',
      page2: '',
    },
  })
}

const changePage = (e) => {
  router.push({
    params: {
      page: 'profile',
      page2: '',
    },
  })
}
</script>

<template>
  <div class="main-container profile-page drawer">
    <div class="profile-page__navbar">
      <button @click="changePage">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.3595 2.38052C14.9226 2.91045 14.9494 3.79647 14.4195 4.35951L7.32255 11.9L14.4195 19.4405C14.9494 20.0035 14.9226 20.8896 14.3595 21.4195C13.7965 21.9494 12.9104 21.9226 12.3805 21.3595L4.38052 12.8595C3.87316 12.3204 3.87316 11.4796 4.38052 10.9405L12.3805 2.44049C12.9104 1.87745 13.7965 1.8506 14.3595 2.38052Z"
            fill="#291E1E"
          />
        </svg>
      </button>
      <div class="profile-page__navbar-title">
        <p>Мои бронирования</p>
      </div>
      <button style="visibility: hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9.2502 22L8.8502 18.8C8.63353 18.7167 8.42953 18.6167 8.2382 18.5C8.04686 18.3833 7.8592 18.2583 7.6752 18.125L4.7002 19.375L1.9502 14.625L4.5252 12.675C4.50853 12.5583 4.5002 12.446 4.5002 12.338V11.663C4.5002 11.5543 4.50853 11.4417 4.5252 11.325L1.9502 9.375L4.7002 4.625L7.6752 5.875C7.85853 5.74167 8.0502 5.61667 8.2502 5.5C8.4502 5.38333 8.6502 5.28333 8.8502 5.2L9.2502 2H14.7502L15.1502 5.2C15.3669 5.28333 15.5712 5.38333 15.7632 5.5C15.9552 5.61667 16.1425 5.74167 16.3252 5.875L19.3002 4.625L22.0502 9.375L19.4752 11.325C19.4919 11.4417 19.5002 11.5543 19.5002 11.663V12.337C19.5002 12.4457 19.4835 12.5583 19.4502 12.675L22.0252 14.625L19.2752 19.375L16.3252 18.125C16.1419 18.2583 15.9502 18.3833 15.7502 18.5C15.5502 18.6167 15.3502 18.7167 15.1502 18.8L14.7502 22H9.2502ZM12.0502 15.5C13.0169 15.5 13.8419 15.1583 14.5252 14.475C15.2085 13.7917 15.5502 12.9667 15.5502 12C15.5502 11.0333 15.2085 10.2083 14.5252 9.525C13.8419 8.84167 13.0169 8.5 12.0502 8.5C11.0669 8.5 10.2375 8.84167 9.5622 9.525C8.88686 10.2083 8.54953 11.0333 8.5502 12C8.55086 12.9667 8.88853 13.7917 9.5632 14.475C10.2379 15.1583 11.0669 15.5 12.0502 15.5Z"
            fill="#291E1E"
          />
        </svg>
      </button>
    </div>
    <div class="profile-page__content">
      <div class="profile-page__events">
        <div class="event-card">
          <p class="event-title">1</p>
          <p class="event-description">Ужин</p>
        </div>
        <div class="event-card">
          <p class="event-title">5</p>
          <p class="event-description">Знакомств</p>
        </div>
      </div>
      <div class="profile-page__title">
        <p>Прошедшие</p>
      </div>

      <div class="profile-page__last-event">
        <div class="last-event__item">
          <p class="last-event__item-title">Дата</p>
          <p class="last-event__item-description">Среда, 23 апреля 2025, 19:00</p>
        </div>
        <div class="last-event__item">
          <p class="last-event__item-title">Локация</p>
          <p class="last-event__item-description">Россия, г. Москва</p>
        </div>
        <div class="last-event__item">
          <p class="last-event__item-title">Ресторан</p>
          <p class="last-event__item-description">Название ресторана</p>
        </div>
        <div class="last-event__item">
          <p class="last-event__item-title">
            <span class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M0.5 10V8.60001C0.5 8.31668 0.573 8.05635 0.719 7.81901C0.865 7.58168 1.05867 7.40035 1.3 7.27501C1.81667 7.01668 2.34167 6.82301 2.875 6.69401C3.40833 6.56501 3.95 6.50035 4.5 6.50001C5.05 6.49968 5.59167 6.56435 6.125 6.69401C6.65833 6.82368 7.18333 7.01735 7.7 7.27501C7.94167 7.40001 8.1355 7.58135 8.2815 7.81901C8.4275 8.05668 8.50033 8.31701 8.5 8.60001V10H0.5ZM9.5 10V8.50001C9.5 8.13335 9.398 7.78118 9.194 7.44351C8.99 7.10585 8.70033 6.81635 8.325 6.57501C8.75 6.62501 9.15 6.71051 9.525 6.83151C9.9 6.95251 10.25 7.10035 10.575 7.27501C10.875 7.44168 11.1042 7.62701 11.2625 7.83101C11.4208 8.03501 11.5 8.25801 11.5 8.50001V10H9.5ZM4.5 6.00001C3.95 6.00001 3.47917 5.80418 3.0875 5.41251C2.69583 5.02085 2.5 4.55001 2.5 4.00001C2.5 3.45001 2.69583 2.97918 3.0875 2.58751C3.47917 2.19585 3.95 2.00001 4.5 2.00001C5.05 2.00001 5.52083 2.19585 5.9125 2.58751C6.30417 2.97918 6.5 3.45001 6.5 4.00001C6.5 4.55001 6.30417 5.02085 5.9125 5.41251C5.52083 5.80418 5.05 6.00001 4.5 6.00001ZM9.5 4.00001C9.5 4.55001 9.30417 5.02085 8.9125 5.41251C8.52083 5.80418 8.05 6.00001 7.5 6.00001C7.40833 6.00001 7.29167 5.98968 7.15 5.96901C7.00833 5.94835 6.89167 5.92535 6.8 5.90001C7.025 5.63335 7.198 5.33751 7.319 5.01251C7.44 4.68751 7.50033 4.35001 7.5 4.00001C7.49967 3.65001 7.43933 3.31251 7.319 2.98751C7.19867 2.66251 7.02567 2.36668 6.8 2.10001C6.91667 2.05835 7.03333 2.03118 7.15 2.01851C7.26667 2.00585 7.38333 1.99968 7.5 2.00001C8.05 2.00001 8.52083 2.19585 8.9125 2.58751C9.30417 2.97918 9.5 3.45001 9.5 4.00001Z"
                  fill="#FCF9EA"
                />
              </svg>
            </span>
            Твоя группа
          </p>
          <div class="last-event__item-friends">
            <div class="user-avatar">
              <img :src="notProfile" alt="User Avatar" />
            </div>
            <div class="user-avatar">
              <img :src="notProfile" alt="User Avatar" />
            </div>
            <div class="user-avatar">
              <img :src="notProfile" alt="User Avatar" />
            </div>
            <div class="user-avatar">
              <img :src="notProfile" alt="User Avatar" />
            </div>
            <div class="user-avatar">
              <img :src="notProfile" alt="User Avatar" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <BaseBottomSheet
      title=""
      :model-value="_showDeleteModal"
      @update:model-value="_showDeleteModal = false"
    >
      <div class="controls-modal">
        <div class="controls-modal__header">
          <p class="modal-title">ты уверен, что хочешь удалить аккаунт?</p>
          <p class="modal-description">
            Восстановить ваш аккаунт или любую удаленную информацию будет невозможно
          </p>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-primary" @click="closeDeleteModal">Подтвердить</button>
      </template>
    </BaseBottomSheet>
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  background-color: #fcf9ea;
  padding-bottom: 0;

  &.drawer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }

  &__navbar {
    display: flex;
    align-items: center;
    padding-top: 4px;
    padding-bottom: 4px;
    margin-left: -8px;
    margin-right: -8px;
    justify-content: space-between;

    button {
      display: flex;
      padding: 8px;
      align-items: center;
      gap: 2px;
      border: none;
      background-color: transparent;
    }

    &-title {
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
  }

  &__content {
    &-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 0 24px 0;

      .user-avatar {
        width: 96px;
        height: 96px;
        border-radius: 100%;
        overflow: hidden;
        margin-bottom: 8px;
        background: var(--primary-gray);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-name {
        color: var(--primary-dark, #291e1e);
        text-align: center;

        /* H2 */
        font-family: 'Sofia Sans';
        font-size: 34px;
        font-style: normal;
        font-weight: 800;
        line-height: 34px; /* 100% */
        text-transform: uppercase;
        margin-bottom: 12px;
      }

      .user-location {
        color: var(--primary-dark, #291e1e);
        text-align: center;

        /* Caption */
        font-family: Manrope;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 133.333% */
        letter-spacing: -0.4px;
      }

      .btn {
        margin-top: 6px;
        margin-bottom: 6px;
      }
    }
  }

  &__events {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    width: 100%;

    .event-card {
      background-color: var(--primary-light);
      height: 90px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      border: 2px solid var(--primary-dark, #291e1e);

      .event-title {
        color: var(--primary-dark, #291e1e);
        text-align: center;

        /* H2 */
        font-family: 'Sofia Sans';
        font-size: 34px;
        font-style: normal;
        font-weight: 800;
        line-height: 34px; /* 100% */
        text-transform: uppercase;
      }

      .event-description {
        color: var(--primary-dark, #291e1e);
        text-align: center;

        /* Caption */
        font-family: Manrope;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 133.333% */
        letter-spacing: -0.4px;
      }
    }
  }

  &__last-event {
    display: flex;
    flex-direction: column;
    padding: 12px;
    border-radius: 12px;
    border: 2px solid #000;
    .last-event__item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding-top: 16px;
      padding-bottom: 16px;
      border-bottom: 1px dashed var(--primary-dark, #291e1e);

      &:first-child {
        padding-top: 0;
      }
      &:last-child {
        border-bottom: none;
        padding-bottom: 0;

        .last-event__item-title {
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: 22px; /* 137.5% */
        }
      }
      &-title {
        color: var(--primary-dark, #291E1E);

        /* Caption */
        font-family: Manrope;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 133.333% */
        letter-spacing: -0.4px;
        display: flex;
        align-items: center;
        gap: 8px;

        .icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: var(--primary-accent, #E75010);
        }
      }

      &-description {
        color: var(--primary-dark, #291E1E);

        /* Text Bold */
        font-family: Manrope;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 137.5% */
        letter-spacing: -0.6px;
      }

      &-friends {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 8px;
        width: 100%;

        .user-avatar {
          width: 54px;
          height: 55px;
          border: 2px solid var(--primary-accent, #E75010);
          border-radius: 100%;
          overflow: hidden;
          background: var(--primary-gray);

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 0;

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: left;

      svg {
        width: 20px;
        height: 20px;
        fill: var(--primary-dark, #291e1e);

        &:last-child {
          margin-left: auto;
        }
      }
    }
  }

  &__footer {
    padding: 12px 0;
    margin-top: auto;
  }

  &__title {
    padding: 12px 0;

    p {
      color: var(--primary-dark, #291e1e);

      /* Text Bold */
      font-family: Manrope;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.6px;
    }
  }
}
</style>
