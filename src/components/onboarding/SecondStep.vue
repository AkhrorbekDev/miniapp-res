<script setup lang="ts">
import { computed } from 'vue'

const maxAge = 59
const minAge = 18

const ages = Array.from({ length: maxAge - minAge + 1 }, (_, i) => ({
  value: i + minAge,
  text: `${i + minAge}`,
}))

const props = defineProps({
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
const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})

const updateModelValue = (newValue: string) => {
  emit('update:modelValue', newValue)
  console.log('Selected age:', newValue)
}
</script>

<template>
  <div class="onboarding-form_second-step">
    <button
      v-for="age in ages"
      @click="updateModelValue(age.value)"
      class="btn btn-outline"
      :class="{
        active: age.value === $props.modelValue,
      }"
      :key="age.value"
    >
      <span class="btn__text">{{ age.text }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.onboarding-form_second-step {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.btn-outline {
  padding: 0;
  width: 52px;
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
