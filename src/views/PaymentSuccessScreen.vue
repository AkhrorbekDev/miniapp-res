<script setup lang="ts">
const test = () => {
  const w = document.body.clientWidth
  const h = document.body.clientHeight
  alert(`
    ${w} ${h}
  `)
}
</script>

<template>
  <div class="payment-success">
    <div class="home-page">
      <div class="home-page__content">
        <div class="logo">
          <img src="@/assets/img/logo.png" alt="" />
        </div>
        <div class="home-page__content__title">твое место забронировано</div>
      </div>
      <div class="home-page__footer">
        <div class="home-page__content__offert">
          <p>
            При поздней отмене бронирования (менее чем за 2 дня до мероприятия) и неявке на
            мероприятие деньги не возвращаются.
          </p>
        </div>
        <div class="home-page__content__button">
          <button @click="$emit('on:click')" class="btn btn-light">
            Понятно
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payment-success {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: var(--primary-accent, #e75010);
  padding: 0 12px 20px;
}

.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .logo {
    width: 169px;
    height: 61px;
    flex-shrink: 0;
    margin-bottom: 32px;
    margin-left: auto;
    margin-right: auto;
  }

  &__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__content__title {
    color: var(--primary-light, #fcf9ea);
    text-align: center;

    /* H1 */
    font-family: 'Sofia Sans', var(--default-font-family);
    font-size: 60px;
    font-style: normal;
    font-weight: 700;
    line-height: 54px; /* 90% */
    letter-spacing: -0.6px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  &__content__description,
  &__content__offert {
    color: var(--primary-light, #fcf9ea);
    text-align: center;

    /* Text Medium */
    font-family: Manrope;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px; /* 137.5% */
    letter-spacing: -0.6px;
  }

  &__content__button {
    margin-top: 24px;
  }
}
</style>
