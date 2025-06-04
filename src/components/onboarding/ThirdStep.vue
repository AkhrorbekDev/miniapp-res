<script setup lang="ts">
import { computed, ref } from 'vue'

const maxAge = 59
const minAge = 18

const genders = ref([
  {
    value: 'm',
    text: 'Мужской',
  },
  {
    value: 'f',
    text: 'Женский',
  }
])

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
    <button
      type="button"

      v-for="gender in genders"
      @click="updateModelValue(gender.value)"
      class="btn btn-outline"
      :class="{
        active: gender.value === $props.modelValue,
      }"
      :key="gender.value"
    >
      <span class="btn__text">{{ gender.text }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.onboarding-form_second-step {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.btn-outline {
  padding: 0;
  width: 100%;
  height: 52px;
  color: var(--primary-dark, #291e1e);
  text-align: center;

  /* Text Bold */
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px; /* 137.5% */
  letter-spacing: -0.6px;

  &.active {
    background-color: var(--primary-accent);
    border-color: var(--primary-accent);
    color: #fff;
  }
}
</style>
