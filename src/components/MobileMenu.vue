<script setup lang="ts"></script>

<template>
  <div class="mobile-menu">
    <router-link to="/events-page" class="mobile-menu__link">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="29"
        height="28"
        viewBox="0 0 29 28"
        fill="#291E1E"
      >
        <path
          d="M7 22.4857H10.75V16.2C10.75 15.8438 10.87 15.5454 11.11 15.3049C11.35 15.0644 11.6467 14.9437 12 14.9429H17C17.3542 14.9429 17.6512 15.0635 17.8912 15.3049C18.1312 15.5463 18.2508 15.8446 18.25 16.2V22.4857H22V11.1714L14.5 5.51429L7 11.1714V22.4857ZM4.5 22.4857V11.1714C4.5 10.7733 4.58875 10.3962 4.76625 10.04C4.94375 9.68381 5.18833 9.39047 5.5 9.16L13 3.50286C13.4375 3.16762 13.9375 3 14.5 3C15.0625 3 15.5625 3.16762 16 3.50286L23.5 9.16C23.8125 9.39047 24.0575 9.68381 24.235 10.04C24.4125 10.3962 24.5008 10.7733 24.5 11.1714V22.4857C24.5 23.1771 24.255 23.7693 23.765 24.2621C23.275 24.7549 22.6867 25.0008 22 25H17C16.6458 25 16.3492 24.8793 16.11 24.6379C15.8708 24.3966 15.7508 24.0982 15.75 23.7429V17.4571H13.25V23.7429C13.25 24.099 13.13 24.3978 12.89 24.6392C12.65 24.8806 12.3533 25.0008 12 25H7C6.3125 25 5.72417 24.754 5.235 24.2621C4.74583 23.7701 4.50083 23.178 4.5 22.4857Z"
        />
      </svg>
      <p class="mobile-menu__link-text">Главная</p>
    </router-link>
    <router-link to="/contacts-page" class="mobile-menu__link">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke="#291E1E"
        fill="none"
      >
        <g opacity="0.4">
          <path
            d="M13.0015 22C15.2203 21.9997 17.3759 21.2614 19.1291 19.9015C20.8823 18.5416 22.1334 16.6372 22.6855 14.4882C23.2376 12.3392 23.0593 10.0676 22.1786 8.03105C21.298 5.9945 19.7651 4.30867 17.8212 3.23895C15.8773 2.16923 13.6328 1.77639 11.4412 2.12226C9.24949 2.46814 7.23509 3.53309 5.7151 5.14946C4.1951 6.76583 3.25584 8.84181 3.04518 11.0506C2.83453 13.2593 3.36444 15.4755 4.55149 17.35L3.00149 22L7.65149 20.45C9.25097 21.4653 11.107 22.003 13.0015 22V22Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
      <p class="mobile-menu__link-text">Контакты</p>
    </router-link>
    <router-link to="/profile" class="mobile-menu__link">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke="#291E1E"
        fill="none"
      >
        <path
          opacity="0.4"
          d="M12.1307 13.3043C15.2523 13.3043 17.7829 10.7738 17.7829 7.65217C17.7829 4.53056 15.2523 2 12.1307 2C9.00908 2 6.47852 4.53056 6.47852 7.65217C6.47852 10.7738 9.00908 13.3043 12.1307 13.3043Z"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          opacity="0.4"
          d="M3 22C3 17.6521 6.47826 13.3043 12.1304 13.3043C17.7826 13.3043 21.2609 17.6521 21.2609 22"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p class="mobile-menu__link-text">Профиль</p>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.mobile-menu {
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 12px;
  background: var(--primary-light);
  border-top: 1px solid #e7e4d6;
  margin-top: auto;

  &__link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    text-decoration: none;
    color: var(--primary-dark, #291e1e);

    &.router-link-active {
      .mobile-menu__link-text {
        color: var(--primary-accent, #fcf9ea);
      }

      svg {
        stroke: var(--primary-accent, #fcf9ea);
      }
    }

    &:first-child.router-link-active {
      svg {
        fill: var(--primary-accent, #fcf9ea);
        stroke: none;
      }
    }

    &-text {
      color: #a7a198;
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
</style>
