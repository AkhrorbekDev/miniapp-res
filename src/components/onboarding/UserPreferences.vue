<script setup lang="ts">
import BaseRadio from '@/components/base/BaseRadio.vue'
import BaseCheckbox from '@/components/base/BaseCheckbox.vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.ts'
import { createUserService } from '@/services'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
  'onUpdate:modelValue': {
    type: Function,
    default: () => {},
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:model-value'])
const _valid = ref(false)
const valid = computed({
  get() {
    return _valid.value
  },
  set(newValue) {
    _valid.value = newValue
  },
})
const validPreferences = computed(() => {
  return (
    props.modelValue['event_languages']?.length > 0 &&
    props.modelValue['food_restrictions']?.length > 0 &&
    props.modelValue['event_budget'] !== undefined
  )
})
const userPreferances = ref([
  {
    title: 'На каком языке тебе удобно говорить во время ужина?',
    multiple: true,
    id: 'event_languages',
    onChange: (e) => {
      let values = props.modelValue['event_languages']
      if (!values) {
        values = []
      }
      if (values.includes(e)) {
        values = values.filter((item) => item !== e)
      } else {
        values.push(e)
      }
      emit('update:model-value', {
        key: 'event_languages',
        value: values,
      })
    },
    options: [],
  },
  {
    title: 'На какой бюджет ты рассчитываешь?',
    multiple: false,
    onChange: (e) => {
      emit('update:model-value', {
        key: 'event_budget',
        value: e,
      })
    },
    id: 'event_budget',
    options: [
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
    ],
  },
  {
    title: 'Каковы твои ограничения в еде?',
    multiple: true,
    onChange: (e) => {
      let values = props.modelValue['food_restrictions']
      if (!values) {
        values = []
      }
      if (values.includes(e)) {
        values = values.filter((item) => item !== e)
      } else {
        values.push(e)
      }
      emit('update:model-value', {
        key: 'food_restrictions',
        value: values,
      })
    },
    id: 'food_restrictions',
    options: [],
  },
])

const router = useRouter()
const changeUserPosition = () => {
  createUserService().changePosition(11)
}
const showConfirm = () => {
  if (valid.value) {
    createUserService().updateUserDetails({
      event_languages: props.modelValue.event_languages,
      food_restrictions: props.modelValue.food_restrictions,
      event_budget: props.modelValue.event_budget,
    }).then(() => {
      changeUserPosition()
      router.push({
        params: {
          page: 'events-page',
        },
      })
    }).catch((err) => {
      const tgWebApp = window.Telegram.WebApp
      tgWebApp.showAlert('Ошибка при обновлении данных')
    })
  } else {
    valid.value = !valid.value
  }
}
const values = computed(() => {
  return {
    event_budget: userPreferances.value[1].options.find((item) => item.id === props.modelValue.event_budget)
      ?.name,
    event_languages: userPreferances.value[0].options
      .reduce((acc, item) => {
        if (props.modelValue.event_languages.includes(item.id)) {
          acc.push(item.name)
        }
        return acc
      }, []).join(', '),
    food_restrictions: userPreferances.value[2].options
      .reduce((acc, item) => {
        if (props.modelValue.food_restrictions.includes(item.id)) {
          acc.push(item.name)
        }
        return acc
      }, []).join(', '),
  }
})
const store = useOnboardingStore()
onMounted(() => {
  const options = store.getDictionaries
  userPreferances.value[0].options = options.languages
  userPreferances.value[2].options = options.food_restrictions
})

defineExpose({
  onConfirmation: () => {
    return valid.value
  },
  onBack: () => {
    valid.value = !valid.value
  },
})
</script>

<template>
  <div class="user-preferences">
    <div class="user-preference__items__title">Предпочтения</div>
    <template v-if="!valid">
      <div class="user-preference__items">
        <div v-for="preferance in userPreferances" :key="preferance.id" class="user-preference">
          <p class="user-preference__title">
            {{ preferance.title }}
          </p>
          <template v-for="option in preferance.options" :key="option.value">
            <BaseCheckbox
              v-if="preferance.multiple"
              :label="option.name"
              :value="option.id"
              :model-value="modelValue[preferance.id]"
              @update:modelValue="preferance.onChange"
            ></BaseCheckbox>
            <BaseRadio
              v-else
              :label="option.name"
              :value="option.id"
              :model-value="modelValue[preferance.id]"
              @update:modelValue="preferance.onChange"
            ></BaseRadio>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="user-preferences__confirm">
        <div class="user-preferences__confirm-item">
          <p class="user-preferences__confirm-item__title">Бюджет</p>
          <p class="user-preferences__confirm-item__values">
            {{ values.event_budget }}
          </p>
        </div>
        <div class="user-preferences__confirm-item">
          <p class="user-preferences__confirm-item__title">
            Язык
          </p>
          <p class="user-preferences__confirm-item__values">
            {{ values.event_languages }}
          </p>
        </div>
        <div class="user-preferences__confirm-item">
          <p class="user-preferences__confirm-item__title">
            Ограничения в еде
          </p>
          <p class="user-preferences__confirm-item__values">
            {{ values.food_restrictions }}
          </p>
        </div>
      </div>
    </template>
    <div class="user-preferences__footer">
      <button v-if="valid" @click="() => (valid = false)" class="btn btn-outline-primary">
        Редактировать предпочтения
      </button>
      <button :disabled="!validPreferences" @click="showConfirm" class="btn btn-primary">
        Продолжить
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-preferences {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;

  &__confirm {
    border-radius: 12px;
    background: var(--primary-accent, #e75010);
    display: flex;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;

    &-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      padding: 16px 0;
      border-bottom: 2px dashed var(--primary-light, #fcf9ea);

      &:last-child {
        border: none;
        padding-bottom: 0;
      }

      &:first-child {
        padding-top: 0;
      }

      &__title {
        color: var(--primary-light, #fcf9ea);

        /* Caption */
        font-family: Manrope;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 133.333% */
        letter-spacing: -0.4px;
      }

      &__values {
        color: var(--primary-light, #fcf9ea);

        /* Text Bold */
        font-family: Manrope;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 137.5% */
        letter-spacing: -0.6px;
      }
    }
  }
}

.user-preference {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  padding-bottom: 12px;

  &__items {
    overflow: auto;
    height: 100%;

    &__title {
      color: var(--primary-dark, #291e1e);
      text-align: center;

      /* H2 */
      font-family: 'Sofia Sans Extra Condensed';
      font-size: 34px;
      font-style: normal;
      font-weight: 800;
      line-height: 34px; /* 100% */
      text-transform: uppercase;
      margin-bottom: 24px;
      margin-top: 24px;
      display: block;
    }
  }

  &__title {
    color: var(--primary-dark, #291e1e);
    text-align: center;

    /* Text Bold */
    font-family: Manrope;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px; /* 137.5% */
    letter-spacing: -0.6px;
  }
}

.user-preferences__footer {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: auto;
}
</style>
