<script setup lang="ts">
import slide1 from '@/assets/img/slide 1.jpg'
import slide2 from '@/assets/img/slide 2.jpg'
import slide3 from '@/assets/img/slide 3.jpg'
import slide4 from '@/assets/img/slide 4.jpg'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const slides = ref([
  {
    id: 1,
    title: 'Расскажи о себе',
    description: 'Заполни короткую анкету и мы найдем тебе подходящих собеседников. ',
    image: slide1,
  },
  {
    id: 2,
    title: 'Подбираем компанию',
    description: 'Наш алгоритм учитывает возраст, стиль общения, темперамент и другие нюансы.',
    image: slide2,
  },
  {
    id: 3,
    title: 'Мы всё организуем',
    description: 'Бронируем уютный ресторан в центре\n' + 'города и координируем встречу.',
    image: slide3,
  },
  {
    id: 4,
    title: 'Приходи на ужин',
    description:
      'Просто скажи «привет» и начни разговор без ожиданий. Доверься магии случайных встреч с неслучайными людьми!',
    image: slide4,
  },
])
const router = useRouter()
const activeSlide = ref(0)
const indicatorWidth = ref(0)
const nextSlide = () => {
  if (activeSlide.value < slides.value.length - 1) {
    indicatorWidth.value = 0
    activeSlide.value++
    setActiveSlideIndicatortimer()
  } else {
    // Navigate to the next page or perform any action
    console.log('Navigate to the next page')
    router.push({
      params: {
        page: 'onboarding-form',
      }
    })
  }
}
const prevSlide = () => {
  if (activeSlide.value > 0) {
    activeSlide.value--
  }
}

const setActiveSlideIndicatortimer = () => {
  const perInterValWidth = 100 / 2500
  const interval = setInterval(() => {
    indicatorWidth.value += perInterValWidth
    if (indicatorWidth.value >= 100) {
      clearInterval(interval)
      if (activeSlide.value < slides.value.length - 1) {
        nextSlide()
      }
    }
  }, 1)
}
onMounted(() => {
  setActiveSlideIndicatortimer()
})

onUnmounted(() => {
  console.timeEnd('start')
})
</script>

<template>
  <div class="main-container onboarding-screen">
    <div class="slide-indicators">
      <div
        v-for="n in slides.length"
        :key="n"
        :class="{
          active: activeSlide === n - 1,
        }"
        :style="{
          '--indicator-width':
            activeSlide > n - 1 ? '100%' : activeSlide === n - 1 ? indicatorWidth + '%' : '0%',
        }"
        class="slide-indicators__item"
        :data-value="activeSlide > n - 1"
      ></div>
    </div>
    <div class="slides">
      <div
        v-for="(slide, n) in slides"
        :key="slide.id"
        :class="{
          active: activeSlide === n,
        }"
        class="slides-item"
      >
        <div class="slides-item__img">
          <img :src="slide.image" alt="" />
        </div>
        <div class="slides-item__content">
          <div class="slides-item__title">
            {{ slide.title }}
          </div>
          <div class="slides-item__description">
            {{ slide.description }}
          </div>
        </div>
      </div>
    </div>
    <div class="onboarding-screen__footer">
      <button @click="nextSlide" class="btn btn-primary">Далее</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/pages/onboarding-screen';
</style>
