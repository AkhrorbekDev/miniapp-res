<script setup lang="ts">
import BaseRadio from '@/components/base/BaseRadio.vue'
import BaseBottomSheet from '@/components/base/BaseBottomSheet.vue'
import { useOnboardingStore } from '@/stores/onboarding.ts'
import { ref } from 'vue'

const store = useOnboardingStore()

const model = defineModel()
const emits = defineEmits(['on:submit'])
const selectedCity = ref<string | undefined>(undefined)
const submitCity = () => {
  if (selectedCity.value) {
    emits('on:submit', selectedCity.value)
  }
}
</script>

<template>
  <BaseBottomSheet :model-value="model" title="" @update:model-value="model = false">
    <div class="controls-modal">
      <div class="controls-modal__header">
        <p class="modal-title">Выбери город</p>
      </div>
    </div>

    <div class="cities-list">
      <div class="cities-list_content">
        <BaseRadio
          v-for="city in store.getDictionaries.cities"
          :key="city.id"
          :label="city.name"
          :value="city.id"
          v-model="selectedCity"
        />
      </div>
    </div>
    <template #footer>
      <button :disabled="!selectedCity" class="btn btn-primary" @click="submitCity">
        Подтвердить
      </button>
    </template>
  </BaseBottomSheet>
</template>

<style scoped lang="scss">
.cities-list {
  &_content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
