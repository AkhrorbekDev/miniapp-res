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
const store = useOnboardingStore()
const returnValue = (e) => {
  let values = props.modelValue
  if (!values) {
    values = []
  }
  if (values.includes(e)) {
    values = values.filter((item) => item !== e)
  } else {
    values.push(e)
  }
  emit('update:modelValue', values)
}
</script>

<template>
  <div class="base-checkbox-group">
    <BaseCheckbox
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      :model-value="modelValue"
      @update:model-value="returnValue"
    ></BaseCheckbox>
  </div>
</template>

<style scoped lang="scss">
.base-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
</style>
