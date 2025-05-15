<script setup lang="ts">
import { computed, ref } from 'vue'

const opinionsMinValue = -3
const opinionsMaxValue = 3
const totalCircles = opinionsMaxValue - opinionsMinValue + 1

const minSize = 26
const maxSize = 54
const startValue = 1

const opinions = computed(() => {
  const half = Math.floor(totalCircles / 2)
  const step = (maxSize - minSize) / half

  return Array.from({ length: totalCircles }, (_, index) => {
    const value = opinionsMinValue + index
    const dist = Math.abs(value) // distance from center
    return {
      value: startValue + index,

      text: value.toString(),
      size: minSize + step * dist, // ⬅️ size increases with distance from 0
    }
  })
})
defineProps({
  modelValue: {
    type: String || Number || null,
    default: '',
  },
  'onUpdate:modelValue': {
    type: Function,
    default: () => {},
  },
})

const emit = defineEmits(['update:modelValue'])

const updateModelValue = (newValue: string) => {
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="onboarding-form_second-step">
    <div class="opinion-rate-info">
      <span>Я основываю свое мнение на логике и фактах</span>
    </div>
    <div
      class="buttons"
      :style="{
        '--templates': totalCircles,
      }"
    >
      <button
        v-for="familyStatus in opinions"
        @click="updateModelValue(familyStatus.value)"
        class="btn btn-outline"
        :class="{
          active: familyStatus.value === $props.modelValue,
        }"
        :key="familyStatus.value"
        :style="{
          width: familyStatus.size + 'px',
          height: familyStatus.size + 'px',
        }"
      ></button>
    </div>
    <div class="opinion-rate-info">
      <span>Я основываю свое мнение на эмоциях и чувствах</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.onboarding-form_second-step {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(1, 1fr);
  row-gap: 24px;
}

.opinion-rate-info {
  color: var(--primary-dark, #291e1e);
  text-align: left;

  /* Caption */
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 133.333% */
  letter-spacing: -0.4px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.opinion-rate-info:last-child span {
  grid-column-start: 2;
  grid-column-end: 3;
  text-align: end;
}

.buttons {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(var(--templates), 1fr);
  gap: 8px;
}

.btn-outline {
  width: 100%;
  height: 52px;
  color: var(--primary-dark, #291e1e);
  text-align: center;
  border-radius: 100%;
  /* Text Bold */
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px; /* 137.5% */
  letter-spacing: -0.6px;
  margin-left: auto;
  margin-right: auto;
  border-color: var(--primary-accent);
  padding: 5px;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 100%;
    background-color: var(--primary-accent);
  }

  &.active:before {
    display: block;
  }
}
</style>
