<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.ts'
import notProfile from '@/assets/img/notProfile.jpg'
import { useRouter } from 'vue-router'
import MobileMenu from '@/components/MobileMenu.vue'
const user = ref({})
const store = useOnboardingStore()
const router = useRouter()

const goToEditProfile = () => {
  router.push({
    params: {
      page: 'profile',
      page2: 'edit-profile'
    }
  })
}

const changePage  = (e) => {
  router.push({
    params: {
      page2: e
    }
  })
}
onMounted(() => {
  user.value = store.getUserAnket
})
</script>

<template>
  <div class="main-container profile-page">
    <div class="profile-page__navbar">
      <button style="visibility: hidden">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
        <p>Профиль</p>
      </div>
      <button @click="changePage('profile-settings')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9.2502 22L8.8502 18.8C8.63353 18.7167 8.42953 18.6167 8.2382 18.5C8.04686 18.3833 7.8592 18.2583 7.6752 18.125L4.7002 19.375L1.9502 14.625L4.5252 12.675C4.50853 12.5583 4.5002 12.446 4.5002 12.338V11.663C4.5002 11.5543 4.50853 11.4417 4.5252 11.325L1.9502 9.375L4.7002 4.625L7.6752 5.875C7.85853 5.74167 8.0502 5.61667 8.2502 5.5C8.4502 5.38333 8.6502 5.28333 8.8502 5.2L9.2502 2H14.7502L15.1502 5.2C15.3669 5.28333 15.5712 5.38333 15.7632 5.5C15.9552 5.61667 16.1425 5.74167 16.3252 5.875L19.3002 4.625L22.0502 9.375L19.4752 11.325C19.4919 11.4417 19.5002 11.5543 19.5002 11.663V12.337C19.5002 12.4457 19.4835 12.5583 19.4502 12.675L22.0252 14.625L19.2752 19.375L16.3252 18.125C16.1419 18.2583 15.9502 18.3833 15.7502 18.5C15.5502 18.6167 15.3502 18.7167 15.1502 18.8L14.7502 22H9.2502ZM12.0502 15.5C13.0169 15.5 13.8419 15.1583 14.5252 14.475C15.2085 13.7917 15.5502 12.9667 15.5502 12C15.5502 11.0333 15.2085 10.2083 14.5252 9.525C13.8419 8.84167 13.0169 8.5 12.0502 8.5C11.0669 8.5 10.2375 8.84167 9.5622 9.525C8.88686 10.2083 8.54953 11.0333 8.5502 12C8.55086 12.9667 8.88853 13.7917 9.5632 14.475C10.2379 15.1583 11.0669 15.5 12.0502 15.5Z" fill="#291E1E"/>
        </svg>
      </button>

    </div>
    <div class="profile-page__content">
      <div class="profile-page__content-header">
        <div class="user-avatar">
          <img :src="store.getUserAnket?.photo ? 'https://miniapp.forkies.ru/' + store.getUserAnket.photo : notProfile" alt="Avatar" />
        </div>
        <div class="user-name">
          <p>
            {{ user.name }}
          </p>
        </div>
        <div class="user-location">
          <p>Москва</p>
        </div>
        <button class="btn btn-outline-primary" @click="goToEditProfile">
          Редактировать профиль
        </button>
      </div>
      <div class="profile-page__content-main">
        <div class="profile-page__links">
          <button class="btn btn-outline-rounded" @click="changePage('profile-events')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M1.66699 9.16668H18.3337V16.6667C18.3337 16.8877 18.2459 17.0997 18.0896 17.2559C17.9333 17.4122 17.7213 17.5 17.5003 17.5H2.50033C2.27931 17.5 2.06735 17.4122 1.91107 17.2559C1.75479 17.0997 1.66699 16.8877 1.66699 16.6667V9.16668ZM14.167 2.50001H17.5003C17.7213 2.50001 17.9333 2.58781 18.0896 2.74409C18.2459 2.90037 18.3337 3.11233 18.3337 3.33334V7.50001H1.66699V3.33334C1.66699 3.11233 1.75479 2.90037 1.91107 2.74409C2.06735 2.58781 2.27931 2.50001 2.50033 2.50001H5.83366V0.833344H7.50033V2.50001H12.5003V0.833344H14.167V2.50001Z" fill="#291E1E"/>
            </svg>
            <p>Мои бронирования</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.03407 1.98376C7.56486 2.42536 7.54249 3.16372 7.98409 3.63292L13.8982 9.91666L7.98409 16.2004C7.54249 16.6696 7.56486 17.408 8.03407 17.8496C8.50327 18.2912 9.24162 18.2688 9.68323 17.7996L16.3499 10.7163C16.7727 10.267 16.7727 9.56629 16.3499 9.11707L9.68323 2.03373C9.24162 1.56453 8.50327 1.54216 8.03407 1.98376Z" fill="#291E1E"/>
            </svg>
          </button>
          <button class="btn btn-outline-rounded" @click="changePage('info')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.16699 14.1667H10.8337V9.16666H9.16699V14.1667ZM10.0003 7.49999C10.2364 7.49999 10.4345 7.41999 10.5945 7.25999C10.7545 7.09999 10.8342 6.90221 10.8337 6.66666C10.8331 6.4311 10.7531 6.23332 10.5937 6.07332C10.4342 5.91332 10.2364 5.83332 10.0003 5.83332C9.76422 5.83332 9.56644 5.91332 9.40699 6.07332C9.24755 6.23332 9.16755 6.4311 9.16699 6.66666C9.16644 6.90221 9.24644 7.10027 9.40699 7.26082C9.56755 7.42138 9.76533 7.5011 10.0003 7.49999ZM10.0003 18.3333C8.84755 18.3333 7.76422 18.1144 6.75033 17.6767C5.73644 17.2389 4.85449 16.6453 4.10449 15.8958C3.35449 15.1464 2.76088 14.2644 2.32366 13.25C1.88644 12.2355 1.66755 11.1522 1.66699 9.99999C1.66644 8.84777 1.88533 7.76443 2.32366 6.74999C2.76199 5.73555 3.3556 4.8536 4.10449 4.10416C4.85338 3.35471 5.73533 2.7611 6.75033 2.32332C7.76533 1.88555 8.84866 1.66666 10.0003 1.66666C11.152 1.66666 12.2353 1.88555 13.2503 2.32332C14.2653 2.7611 15.1473 3.35471 15.8962 4.10416C16.6451 4.8536 17.2389 5.73555 17.6778 6.74999C18.1167 7.76443 18.3353 8.84777 18.3337 9.99999C18.332 11.1522 18.1131 12.2355 17.677 13.25C17.2409 14.2644 16.6473 15.1464 15.8962 15.8958C15.1451 16.6453 14.2631 17.2392 13.2503 17.6775C12.2375 18.1158 11.1542 18.3344 10.0003 18.3333Z" fill="#291E1E"/>
            </svg>
            <p>Справочный центр</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.03407 1.98376C7.56486 2.42536 7.54249 3.16372 7.98409 3.63292L13.8982 9.91666L7.98409 16.2004C7.54249 16.6696 7.56486 17.408 8.03407 17.8496C8.50327 18.2912 9.24162 18.2688 9.68323 17.7996L16.3499 10.7163C16.7727 10.267 16.7727 9.56629 16.3499 9.11707L9.68323 2.03373C9.24162 1.56453 8.50327 1.54216 8.03407 1.98376Z" fill="#291E1E"/>
            </svg>
          </button>
        </div>
        <div class="profile-page__guide">
          <p class="guide-title">
            Гайд
          </p>
          <p class="guide-description">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
          </p>
          <button class="btn btn-light">
            Ознакомиться
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  background-color: #FCF9EA;
  padding-bottom: 0;
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
      color: var(--primary-dark, #291E1E);
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
        color: var(--primary-dark, #291E1E);
        text-align: center;

        /* H2 */
        font-family: "Sofia Sans Extra Condensed";
        font-size: 34px;
        font-style: normal;
        font-weight: 800;
        line-height: 34px; /* 100% */
        text-transform: uppercase;
        margin-bottom: 12px;
      }

      .user-location {
        color: var(--primary-dark, #291E1E);
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
        fill: var(--primary-dark, #291E1E);
        &:last-child {
          margin-left: auto;
        }
      }
    }
  }

  &__guide {
    padding: 24px;
    margin-top: 12px;
    margin-bottom: 12px;
    border-radius: 12px;
    background: var(--primary-accent, #E75010);

    .guide-title {
      color: var(--primary-light, #FCF9EA);

      /* Text Bold */
      font-family: Manrope;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.6px;
      margin-bottom: 8px;
    }
    .guide-description {
      color: var(--primary-light, #FCF9EA);

      /* Text Medium */
      font-family: Manrope;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.6px;
    }
    .btn {
      margin-top: 16px;
    }
  }
}
</style>
