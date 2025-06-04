<script setup lang="ts">
import BaseRadio from '@/components/base/BaseRadio.vue'
import BaseCheckbox from '@/components/base/BaseCheckbox.vue'
import { onMounted, ref } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.ts'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: 'Редактирование профиля',
  },
  options: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])

const updateModelValue = (newValue: string) => {
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="base-checkbox-group">
    <button
      type="button"

      v-for="item in options"
      @click="updateModelValue(item.id)"
      class="btn btn-outline"
      :class="{
        active: item.id === modelValue,
      }"
      :key="item.id"
    >
      <span class="btn__text">{{ item.name }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.base-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
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
