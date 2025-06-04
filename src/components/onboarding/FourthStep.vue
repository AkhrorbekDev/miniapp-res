<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.ts'


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
const store = useOnboardingStore()
const dictionaries = computed(() =>store.getDictionaries)

const emit = defineEmits(['update:modelValue'])

const updateModelValue = (newValue: string) => {
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div v-if="dictionaries" class="onboarding-form_second-step">
    <button
      type="button"

      v-for="familyStatus in dictionaries.relationship_statuses"
      @click="updateModelValue(familyStatus.id)"
      class="btn btn-outline"
      :class="{
        active: familyStatus.id === $props.modelValue,
      }"
      :key="familyStatus.id"
    >
      <span class="btn__text">{{ familyStatus.name }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.onboarding-form_second-step {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
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
