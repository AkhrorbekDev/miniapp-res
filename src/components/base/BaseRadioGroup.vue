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
  options: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="base-radio-group">
    <BaseRadio
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    ></BaseRadio>
  </div>
</template>

<style scoped lang="scss">
.base-radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
</style>
