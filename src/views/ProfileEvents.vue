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
const haveEventStatus = ref(false)
const showDeleteModal = () => {
  _showDeleteModal.value = true
}

const eventStats = ref({
  dinner_count: 0,
  acquaintance_count: 0,
  events: [],
})
const selectedGroupItem = ref(null)
const showGroupItemModal = ref(false)
const openGroupItemModal = (e) => {
  selectedGroupItem.value = e
  showGroupItemModal.value = true
}

const closeGroupItemModal = () => {
  showGroupItemModal.value = false
  selectedGroupItem.value = null
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

onMounted(() => {
  createUserService()
    .getUserEventsStats()
    .then((res) => {
      eventStats.value = res
    })
})
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
          <p class="event-title">
            {{ eventStats?.dinner_count || '0' }}
          </p>
          <p class="event-description">Ужин</p>
        </div>
        <div class="event-card">
          <p class="event-title">
            {{ eventStats?.acquaintance_count || '0' }}
          </p>
          <p class="event-description">Знакомств</p>
        </div>
      </div>
      <div v-if="eventStats?.events.length" class="profile-page__title">
        <p>Прошедшие</p>
      </div>

      <template v-if="true">
        <div class="profile-page__last-events">
          <div
            v-for="event in eventStats?.events"
            :key="event.date"
            class="profile-page__last-event"
          >
            <div class="last-event__item">
              <p class="last-event__item-title">Дата</p>
              <p class="last-event__item-description">
                {{ event.date }}
              </p>
            </div>
            <div class="last-event__item">
              <p class="last-event__item-title">Локация</p>
              <p class="last-event__item-description">
                {{ event.city }}
              </p>
            </div>
            <div class="last-event__item">
              <p class="last-event__item-title">Ресторан</p>
              <p class="last-event__item-description">
                {{ event.restaurant }}
              </p>
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
                <div
                  v-for="group in event.group"
                  :key="group.username"
                  class="user-avatar"
                  @click="openGroupItemModal(group)"
                >
                  <img
                    :src="
                      group.photo_url ? 'https://miniapp.forkies.ru/' + group.photo_url : notProfile
                    "
                    alt="User Avatar"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <BaseBottomSheet
      title=""
      :model-value="showGroupItemModal"
      @update:model-value="closeGroupItemModal"
    >
      <div class="controls-modal">
        <div class="controls-modal__header">
          <div class="user-avatar">
            <img
              :src="
                selectedGroupItem?.photo_url
                  ? 'https://miniapp.forkies.ru/' + selectedGroupItem?.photo_url
                  : notProfile
              "
              alt=""
            />
          </div>
          <p class="modal-title">
            {{ selectedGroupItem?.name }}
          </p>
          <p v-if="selectedGroupItem?.оccupation" class="modal-description1">
            {{ selectedGroupItem?.оccupation }}
          </p>
          <div class="user-about-self">
            <p class="modal-description">
              {{ selectedGroupItem?.about }}
            </p>
          </div>
        </div>
        <div class="user-socials">
          <a v-if="selectedGroupItem?.instagramm" :href="`https://instagram.com/${selectedGroupItem.instagramm}`" target="_blank" class="btn btn-outline-rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_21_3882)">
                <path
                  d="M11.0286 0C12.1536 0.003 12.7246 0.009 13.2176 0.023L13.4116 0.03C13.6356 0.038 13.8566 0.0479999 14.1236 0.0599999C15.1876 0.11 15.9136 0.278 16.5506 0.525C17.2106 0.779 17.7666 1.123 18.3226 1.678C18.8313 2.17773 19.2248 2.78247 19.4756 3.45C19.7226 4.087 19.8906 4.813 19.9406 5.878C19.9526 6.144 19.9626 6.365 19.9706 6.59L19.9766 6.784C19.9916 7.276 19.9976 7.847 19.9996 8.972L20.0006 9.718V11.028C20.003 11.7574 19.9953 12.4868 19.9776 13.216L19.9716 13.41C19.9636 13.635 19.9536 13.856 19.9416 14.122C19.8916 15.187 19.7216 15.912 19.4756 16.55C19.2248 17.2175 18.8313 17.8223 18.3226 18.322C17.8228 18.8307 17.2181 19.2242 16.5506 19.475C15.9136 19.722 15.1876 19.89 14.1236 19.94L13.4116 19.97L13.2176 19.976C12.7246 19.99 12.1536 19.997 11.0286 19.999L10.2826 20H8.97357C8.24383 20.0026 7.51409 19.9949 6.78457 19.977L6.59057 19.971C6.35318 19.962 6.11584 19.9517 5.87857 19.94C4.81457 19.89 4.08857 19.722 3.45057 19.475C2.7834 19.2241 2.17901 18.8306 1.67957 18.322C1.17051 17.8224 0.776678 17.2176 0.525569 16.55C0.278569 15.913 0.110569 15.187 0.0605687 14.122L0.0305688 13.41L0.0255689 13.216C0.00713493 12.4868 -0.00119929 11.7574 0.000568797 11.028V8.972C-0.0021991 8.2426 0.00513501 7.5132 0.0225689 6.784L0.0295688 6.59C0.0375688 6.365 0.0475688 6.144 0.0595688 5.878C0.109569 4.813 0.277569 4.088 0.524569 3.45C0.776263 2.7822 1.17079 2.17744 1.68057 1.678C2.17972 1.16955 2.78376 0.776074 3.45057 0.525C4.08857 0.278 4.81357 0.11 5.87857 0.0599999C6.14457 0.0479999 6.36657 0.038 6.59057 0.03L6.78457 0.0239999C7.51376 0.00623271 8.24316 -0.0014347 8.97257 0.000999928L11.0286 0ZM10.0006 5C8.67449 5 7.40272 5.52678 6.46503 6.46447C5.52735 7.40215 5.00057 8.67392 5.00057 10C5.00057 11.3261 5.52735 12.5979 6.46503 13.5355C7.40272 14.4732 8.67449 15 10.0006 15C11.3267 15 12.5984 14.4732 13.5361 13.5355C14.4738 12.5979 15.0006 11.3261 15.0006 10C15.0006 8.67392 14.4738 7.40215 13.5361 6.46447C12.5984 5.52678 11.3267 5 10.0006 5ZM10.0006 7C10.3945 6.99993 10.7847 7.07747 11.1487 7.22817C11.5127 7.37887 11.8434 7.5998 12.122 7.87833C12.4007 8.15686 12.6217 8.48754 12.7725 8.85149C12.9233 9.21544 13.001 9.60553 13.0011 9.9995C13.0011 10.3935 12.9236 10.7836 12.7729 11.1476C12.6222 11.5116 12.4013 11.8423 12.1227 12.121C11.8442 12.3996 11.5135 12.6206 11.1496 12.7714C10.7856 12.9223 10.3955 12.9999 10.0016 13C9.20592 13 8.44286 12.6839 7.88025 12.1213C7.31764 11.5587 7.00157 10.7956 7.00157 10C7.00157 9.20435 7.31764 8.44129 7.88025 7.87868C8.44286 7.31607 9.20592 7 10.0016 7M15.2516 3.5C14.92 3.5 14.6021 3.6317 14.3677 3.86612C14.1333 4.10054 14.0016 4.41848 14.0016 4.75C14.0016 5.08152 14.1333 5.39946 14.3677 5.63388C14.6021 5.8683 14.92 6 15.2516 6C15.5831 6 15.901 5.8683 16.1355 5.63388C16.3699 5.39946 16.5016 5.08152 16.5016 4.75C16.5016 4.41848 16.3699 4.10054 16.1355 3.86612C15.901 3.6317 15.5831 3.5 15.2516 3.5Z"
                  fill="#291E1E"
                />
              </g>
              <defs>
                <clipPath id="clip0_21_3882">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {{ selectedGroupItem?.instagramm }}
          </a>
          <a v-if="selectedGroupItem?.telegram" :href="`https://t.me/${selectedGroupItem.telegram}`"  target="_blank" class="btn btn-outline-rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_21_3889)">
                <path
                  d="M19.9362 3.51976L16.9062 17.7048C16.6802 18.7038 16.1002 18.9288 15.2622 18.4778L10.7172 15.1258L8.49216 17.2528C8.26716 17.4788 8.04116 17.7048 7.52516 17.7048L7.88016 13.0298L16.3582 5.32576C16.7122 4.97076 16.2612 4.84176 15.8102 5.13276L5.26916 11.7728L0.723157 10.3868C-0.275843 10.0648 -0.275843 9.38676 0.949157 8.93676L18.6142 2.06976C19.4842 1.81176 20.2262 2.26376 19.9362 3.51976Z"
                  fill="#291E1E"
                />
              </g>
              <defs>
                <clipPath id="clip0_21_3889">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {{ selectedGroupItem?.telegram }}
          </a>
        </div>
      </div>
    </BaseBottomSheet>

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
    overflow: auto;
    padding-bottom: 20px;

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
        font-family: 'Sofia Sans Extra Condensed';
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
        font-family: 'Sofia Sans Extra Condensed';
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

  &__last-events {
    display: flex;
    flex-direction: column;
    gap: 12px;
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
        color: var(--primary-dark, #291e1e);

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
          background: var(--primary-accent, #e75010);
        }
      }

      &-description {
        color: var(--primary-dark, #291e1e);

        /* Text Bold */
        font-family: Manrope;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 137.5% */
        letter-spacing: -0.6px;
      }

      &-friends {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
        margin-top: 8px;
        width: 100%;

        .user-avatar {
          width: 54px;
          height: 55px;
          border: 2px solid var(--primary-accent, #e75010);
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
