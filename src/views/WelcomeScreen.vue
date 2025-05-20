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
  <div class="main-container">
    <!--    <button class="test-btn" @click="test">test</button>-->
    <div class="home-page">
      <div class="home-page__content">
        <div class="logo">
          <img src="@/assets/img/logo.png" alt="" />
        </div>
        <div class="home-page__content__title">
          Уютные встречи <br />
          за ужином
        </div>
        <div class="home-page__content__description">
          <p>
            Представь: ужинаешь с шестью незнакомцами и вдруг понимаешь — встреча не случайна. Это
            мы нашли «твоих» людей и уютное место
          </p>
        </div>
      </div>
      <div class="home-page__footer">
        <div class="home-page__content__button">
          <router-link :to="{
            params: {
              page: 'onboarding-slides'
            }
          }" class="btn btn-light">Начать</router-link>
        </div>
        <div class="home-page__content__offert">
          <p>
            Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь с
            политикой конфиденциальности
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/scss/pages/WelcomePage';

.test-btn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}
</style>
