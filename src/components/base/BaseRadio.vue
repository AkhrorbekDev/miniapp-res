<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  'onUpdate:modelValue': {
    type: Function,
    default: () => {
    }
  },
  placeholder: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])
const _value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})
</script>

<template>
  <div class="base-radio" @click="() => _value = value">
    <p class="base-radio__label">
      {{ label }}
    </p>
    <span :class="{
      checked: modelValue === value,
    }" class="base-radio__input">
      <span class="base-radio__dot"></span>
    </span>
  </div>
</template>

<style scoped lang="scss"></style>
