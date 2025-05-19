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
})
const emit = defineEmits(['update:modelValue'])
const foodRestrictions = ref([
])
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
onMounted(() => {
  foodRestrictions.value = store.getDictionaries.food_restrictions
})
</script>

<template>
  <div>
    <BaseCheckbox
      v-for="item in foodRestrictions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      :model-value="modelValue"
      @update:model-value="returnValue"
    ></BaseCheckbox>
  </div>
</template>

<style scoped lang="scss"></style>
