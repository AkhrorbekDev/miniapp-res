<script setup lang="ts">
import BaseRadio from '@/components/base/BaseRadio.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Редактирование профиля',
  },
})

const event_budgets = [
  {
    id: 1,
    name: '$',
    value: '1',
  },
  {
    id: 2,
    name: '$$',
    value: '2',
  },
  {
    id: 3,
    name: '$$$',
    value: '3',
  },
]
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <BaseRadio
      v-for="item in event_budgets"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    ></BaseRadio>
  </div>
</template>

<style scoped lang="scss"></style>
