<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  'onUpdate:modelValue': {
    type: Function,
    default: () => {},
  },
  placeholder: {
    type: String,
    default: '',
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
</script>

<template>
  <div class="base-input">
    <template v-if="$slots['icon-left']">
      <div class="left-icon">
        <slot name="icon-left" />
      </div>
    </template>
    <input v-model="value" type="text" id="name" :placeholder="placeholder" />
    <template v-if="$slots['icon-right']">
      <div class="right-icon">
        <slot name="icon-right" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
