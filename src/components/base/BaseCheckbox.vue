<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
  },
  'onUpdate:modelValue': {
    type: Function,
    default: () => {},
  },
  placeholder: {
    type: String,
    default: '',
  },
  value: {
  },
  label: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
const _value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    console.log('newValue', newValue)
    emit('update:modelValue', newValue)
  },
})

const checked = computed(() => {
  if (!props.modelValue) {
    return false
  }
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue === props.value
})
</script>

<template>
  <div class="base-checkbox" @click="() => _value = value">
    <p class="base-checkbox__label">
      {{ label }}
    </p>
    <span
      :class="{
        checked: value && checked
      }"
      class="base-checkbox__input"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="tabler:check">
          <path
            id="Vector"
            d="M3.3335 7.99996L6.66683 11.3333L13.3335 4.66663"
            stroke="#FCF9EA"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </span>
  </div>
</template>

<style scoped lang="scss"></style>
