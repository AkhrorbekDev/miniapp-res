<script setup lang="ts">
import { computed, onMounted, ref, h } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.ts'
import notProfile from '@/assets/img/notProfile.jpg'
import { useRouter } from 'vue-router'
import BaseBottomSheet from '@/components/base/BaseBottomSheet.vue'
import { createUserService } from '@/services'
import BaseTextArea from '@/components/base/BaseTextArea.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import FirstStep from '@/components/onboarding/FirstStep.vue'
import SecondStep from '@/components/onboarding/SecondStep.vue'
import ThirdStep from '@/components/onboarding/ThirdStep.vue'
import SixStep from '@/components/onboarding/SixStep.vue'
import FourthStep from '@/components/onboarding/FourthStep.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseRadio from '@/components/base/BaseRadio.vue'
import EventBudgets from '@/components/onboarding/EventBudgets.vue'
import EventFoodRestrictions from '@/components/onboarding/EventFoodRestrictions.vue'
import BaseRadioGroup from '@/components/base/BaseRadioGroup.vue'
import BaseCheckboxGroup from '@/components/base/BaseCheckboxGroup.vue'

const user = ref({})
const dictionaries = ref({})
const genders = {
  0: 'Не указан',
  m: 'Мужской',
  f: 'Женский',
}

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
const store = useOnboardingStore()
const router = useRouter()
const _showDeleteModal = ref(false)
const updateAboutSelf = (e) => {
  user.value.about_myself = e
  editedValues.value.about_myself = e
}
const updateSocials = (e, key) => {
  user.value[key] = e
  editedValues.value[key] = e
}

const uploadAvatar = (e) => {
  const file = e.target.files[0]
  const formData = new FormData()
  const tgWebApp = window.Telegram.WebApp
  formData.append('photo', file)
  console.log(file)
  if (file) {
    createUserService()
      .changeAvatar(formData)
      .then((res) => {
        user.value.photo = res.photo
      })
      .catch((err) => {
        tgWebApp.showAlert('Ошибка загрузки фото')
      })
  }
}
const userInfos = computed(() => {
  const relations = store.getDictionaries.relationship_statuses.find((item) => {
    return item.id === user.value.relationship_status
  })

  const foods = store.getDictionaries.food_restrictions.reduce((acc, item) => {
    if (user.value.food_restrictions?.includes(item.id)) {
      acc += item.name + ', '
    }
    return acc
  }, '')

  const languages = store.getDictionaries.languages.reduce((acc, item) => {
    if (user.value.event_languages?.includes(item.id)) {
      acc += item.name + ', '
    }
    return acc
  }, '')

  const userBudget = event_budgets.find((item) => {
    return item.id === user.value.event_budget
  })
  return {
    relations,
    foods,
    languages,
    budget: userBudget,
  }
})
const closeDeleteModal = () => {
  _showDeleteModal.value = false
  store.deleteUser()
  createUserService().changePosition(0)
  router.push({
    params: {
      page: 'wellcome-screen',
      page2: '',
    },
  })
}

const showEditDrawer = ref(false)
const editComponent = ref('')
const editComponentBinds = ref({})
const editedValues = ref({})
const closeEditDrawer = () => {
  showEditDrawer.value = false
  editComponent.value = ''
  editComponentBinds.value = {}
}
const showEdit = (type) => {
  if (type === 'age') {
    editComponentBinds.value = {
      modelValue: user.value.age,
    }
    editComponent.value = h(SecondStep, {
      'onUpdate:modelValue': (e: string) => {
        editComponentBinds.value.modelValue = e
        editedValues.value.age = e
        user.value.age = e
      },
    })
  } else if (type === 'gender') {
    editComponentBinds.value = {
      modelValue: user.value.gender,
    }
    editComponent.value = h(ThirdStep, {
      'onUpdate:modelValue': (e: string) => {
        editComponentBinds.value.modelValue = e
        editedValues.value.gender = e
        user.value.gender = e
      },
    })
  } else if (type === 'relationship_status') {
    editComponentBinds.value = {
      modelValue: user.value.relationship_status,
    }
    editComponent.value = h(FourthStep, {
      'onUpdate:modelValue': (e: string) => {
        editComponentBinds.value.modelValue = e
        editedValues.value.relationship_status = e
        user.value.relationship_status = e
      },
    })
  } else if (type === 'introvert_status') {
    editComponentBinds.value = {
      modelValue: user.value.introversion_level,
    }
    editComponent.value = h(SixStep, {
      'onUpdate:modelValue': (e: string) => {
        editComponentBinds.value.modelValue = e
        editedValues.value.introversion_level = e
        user.value.introversion_level = e
      },
    })
  } else if (type === 'logic') {
  } else if (type === 'food_restrictions') {
    editComponentBinds.value = {
      modelValue: user.value.food_restrictions,
      key: user.value.food_restrictions,
    }
    editComponent.value = h(BaseCheckboxGroup, {
      modelValue: user.value.food_restrictions,
      options: dictionaries.value.food_restrictions,
      'onUpdate:modelValue': (e: string) => {
        editComponentBinds.value.modelValue = e
        editedValues.value.food_restrictions = e
        user.value.food_restrictions = e
      },
    })
  } else if (type === 'event_languages') {
    editComponentBinds.value = {
      modelValue: user.value.event_languages,
      key: user.value.event_languages,
    }
    editComponent.value = h(BaseCheckboxGroup, {
      options: dictionaries.value.languages,
      modelValue: user.value.event_languages,
      'onUpdate:modelValue': (e: string) => {
        editComponentBinds.value.modelValue = e
        editedValues.value.event_languages = e
        user.value.event_languages = e
      },
    })
  } else if (type === 'budget') {
    editComponentBinds.value = {
      modelValue: user.value.event_budget,
      key: user.value.event_budget,
    }
    editComponent.value = h(BaseRadioGroup, {
      options: event_budgets,
      class: 'profile-edit__content-item',
      modelValue: user.value.event_budget,
      'onUpdate:modelValue': (e: string) => {
        editComponentBinds.value.modelValue = e
        editedValues.value.event_budget = e
        user.value.event_budget = e
      },
    })
  }
  showEditDrawer.value = true
}

const changePage = (e) => {
  user.value = store.getUserAnket
  editedValues.value = {}
  router.push({
    params: {
      page: 'profile',
      page2: '',
    },
  })
}

const isChanged = computed(() => {
  return Object.keys(editedValues.value).length > 0
})

const saveChanges = () => {
  const values = {
    ...editedValues.value,
    about_myself: user.value.about_myself,
    instagram: user.value.instagram,
    telegramm: user.value.telegramm,
  }
  delete values.photo
  const tgWebApp = window.Telegram.WebApp
  createUserService()
    .updateUserDetails(values)
    .then(() => {
      tgWebApp.showAlert('Данные успешно обновлены')
      editedValues.value = {}
      createUserService()
        .getUserAnket()
        .then((response) => {
          store.setUserAnket(response)
        })
    })
    .catch(() => {
      tgWebApp.showAlert('Ошибка обновления данных')
    })
}
onMounted(() => {
  user.value = store.getUserAnket
  dictionaries.value = store.getDictionaries
})
</script>

<template>
  <div class="main-container profile-edit drawer">
    <div class="profile-edit__navbar">
      <button @click="changePage">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.3595 2.38052C14.9226 2.91045 14.9494 3.79647 14.4195 4.35951L7.32255 11.9L14.4195 19.4405C14.9494 20.0035 14.9226 20.8896 14.3595 21.4195C13.7965 21.9494 12.9104 21.9226 12.3805 21.3595L4.38052 12.8595C3.87316 12.3204 3.87316 11.4796 4.38052 10.9405L12.3805 2.44049C12.9104 1.87745 13.7965 1.8506 14.3595 2.38052Z"
            fill="#291E1E"
          />
        </svg>
      </button>
      <div class="profile-edit__navbar-title">
        <p>Редактирование профиля</p>
      </div>
      <button style="visibility: hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9.2502 22L8.8502 18.8C8.63353 18.7167 8.42953 18.6167 8.2382 18.5C8.04686 18.3833 7.8592 18.2583 7.6752 18.125L4.7002 19.375L1.9502 14.625L4.5252 12.675C4.50853 12.5583 4.5002 12.446 4.5002 12.338V11.663C4.5002 11.5543 4.50853 11.4417 4.5252 11.325L1.9502 9.375L4.7002 4.625L7.6752 5.875C7.85853 5.74167 8.0502 5.61667 8.2502 5.5C8.4502 5.38333 8.6502 5.28333 8.8502 5.2L9.2502 2H14.7502L15.1502 5.2C15.3669 5.28333 15.5712 5.38333 15.7632 5.5C15.9552 5.61667 16.1425 5.74167 16.3252 5.875L19.3002 4.625L22.0502 9.375L19.4752 11.325C19.4919 11.4417 19.5002 11.5543 19.5002 11.663V12.337C19.5002 12.4457 19.4835 12.5583 19.4502 12.675L22.0252 14.625L19.2752 19.375L16.3252 18.125C16.1419 18.2583 15.9502 18.3833 15.7502 18.5C15.5502 18.6167 15.3502 18.7167 15.1502 18.8L14.7502 22H9.2502ZM12.0502 15.5C13.0169 15.5 13.8419 15.1583 14.5252 14.475C15.2085 13.7917 15.5502 12.9667 15.5502 12C15.5502 11.0333 15.2085 10.2083 14.5252 9.525C13.8419 8.84167 13.0169 8.5 12.0502 8.5C11.0669 8.5 10.2375 8.84167 9.5622 9.525C8.88686 10.2083 8.54953 11.0333 8.5502 12C8.55086 12.9667 8.88853 13.7917 9.5632 14.475C10.2379 15.1583 11.0669 15.5 12.0502 15.5Z"
            fill="#291E1E"
          />
        </svg>
      </button>
    </div>
    <div class="profile-edit__content">
      <div class="profile-edit__content-header">
        <div class="user-avatar">
          <img :src="'https://miniapp.forkies.ru/' + user.photo || notProfile" alt="Avatar" />
        </div>
        <div class="user-name">
          <p>
            {{ user.name }}
          </p>
        </div>
        <div class="user-location">
          <p>Москва</p>
        </div>
        <label for="file-input" class="btn btn-outline-primary">
          <input type="file" hidden="hidden" @change="uploadAvatar" id="file-input" />
          Изменить фото
        </label>
      </div>
      <div class="profile-edit__content-items">
        <div class="profile-edit__content-item">
          <div class="title">
            <p>Идентификация</p>
          </div>
          <div class="links">
            <div @click="showEdit('age')" class="link">
              <div class="label">Возраст</div>

              <div class="text">
                <p>
                  {{ user.age }}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.03309 1.98376C7.56389 2.42536 7.54151 3.16372 7.98312 3.63292L13.8972 9.91666L7.98312 16.2004C7.54151 16.6696 7.56389 17.408 8.03309 17.8496C8.50229 18.2912 9.24065 18.2688 9.68225 17.7996L16.3489 10.7163C16.7717 10.267 16.7717 9.56629 16.3489 9.11707L9.68225 2.03373C9.24065 1.56453 8.50229 1.54216 8.03309 1.98376Z"
                    fill="#291E1E"
                  />
                </svg>
              </div>
            </div>
            <div @click="showEdit('gender')" class="link">
              <div class="label">Пол</div>

              <div class="text">
                <p>
                  {{ genders[user.gender] }}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.03309 1.98376C7.56389 2.42536 7.54151 3.16372 7.98312 3.63292L13.8972 9.91666L7.98312 16.2004C7.54151 16.6696 7.56389 17.408 8.03309 17.8496C8.50229 18.2912 9.24065 18.2688 9.68225 17.7996L16.3489 10.7163C16.7717 10.267 16.7717 9.56629 16.3489 9.11707L9.68225 2.03373C9.24065 1.56453 8.50229 1.54216 8.03309 1.98376Z"
                    fill="#291E1E"
                  />
                </svg>
              </div>
            </div>
            <div @click="showEdit('relationship_status')" class="link">
              <div class="label">Семейный статус</div>

              <div class="text">
                <p>
                  {{ userInfos.relations?.name || '-' }}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.03309 1.98376C7.56389 2.42536 7.54151 3.16372 7.98312 3.63292L13.8972 9.91666L7.98312 16.2004C7.54151 16.6696 7.56389 17.408 8.03309 17.8496C8.50229 18.2912 9.24065 18.2688 9.68225 17.7996L16.3489 10.7163C16.7717 10.267 16.7717 9.56629 16.3489 9.11707L9.68225 2.03373C9.24065 1.56453 8.50229 1.54216 8.03309 1.98376Z"
                    fill="#291E1E"
                  />
                </svg>
              </div>
            </div>
            <div @click="showEdit('logic')" class="link">
              <div class="label">Основа мнений</div>

              <div class="text">
                <p>На логике и фактах</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.03309 1.98376C7.56389 2.42536 7.54151 3.16372 7.98312 3.63292L13.8972 9.91666L7.98312 16.2004C7.54151 16.6696 7.56389 17.408 8.03309 17.8496C8.50229 18.2912 9.24065 18.2688 9.68225 17.7996L16.3489 10.7163C16.7717 10.267 16.7717 9.56629 16.3489 9.11707L9.68225 2.03373C9.24065 1.56453 8.50229 1.54216 8.03309 1.98376Z"
                    fill="#291E1E"
                  />
                </svg>
              </div>
            </div>
            <div @click="showEdit('introvert_status')" class="link">
              <div class="label">Насколько ты Интроверт?</div>

              <div class="text">
                <p>
                  {{ user.introversion_level }}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.03309 1.98376C7.56389 2.42536 7.54151 3.16372 7.98312 3.63292L13.8972 9.91666L7.98312 16.2004C7.54151 16.6696 7.56389 17.408 8.03309 17.8496C8.50229 18.2912 9.24065 18.2688 9.68225 17.7996L16.3489 10.7163C16.7717 10.267 16.7717 9.56629 16.3489 9.11707L9.68225 2.03373C9.24065 1.56453 8.50229 1.54216 8.03309 1.98376Z"
                    fill="#291E1E"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-edit__content-item">
          <div class="title">
            <p>О себе</p>
            <span>{{ user.about_self?.length || 0 }}/500</span>
          </div>
          <BaseTextArea
            class="textarea"
            :model-value="user.about_self"
            @update:model-value="updateAboutSelf"
          />
        </div>
        <div class="profile-edit__content-item">
          <div class="title">
            <p>Социальные сети</p>
          </div>
          <BaseInput
            style="margin-bottom: 10px"
            placeholder="instagram.com/"
            :model-value="user.instagram"
            @update:model-value="updateSocials($event, 'instagram')"
          >
            <template #icon-left>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="instagram" clip-path="url(#clip0_7_710)">
                  <path
                    id="Vector"
                    d="M11.0281 0C12.1531 0.003 12.7241 0.009 13.2171 0.023L13.4111 0.03C13.6351 0.038 13.8561 0.0479999 14.1231 0.0599999C15.1871 0.11 15.9131 0.278 16.5501 0.525C17.2101 0.779 17.7661 1.123 18.3221 1.678C18.8308 2.17773 19.2243 2.78247 19.4751 3.45C19.7221 4.087 19.8901 4.813 19.9401 5.878C19.9521 6.144 19.9621 6.365 19.9701 6.59L19.9761 6.784C19.9911 7.276 19.9971 7.847 19.9991 8.972L20.0001 9.718V11.028C20.0025 11.7574 19.9948 12.4868 19.9771 13.216L19.9711 13.41C19.9631 13.635 19.9531 13.856 19.9411 14.122C19.8911 15.187 19.7211 15.912 19.4751 16.55C19.2243 17.2175 18.8308 17.8223 18.3221 18.322C17.8223 18.8307 17.2176 19.2242 16.5501 19.475C15.9131 19.722 15.1871 19.89 14.1231 19.94L13.4111 19.97L13.2171 19.976C12.7241 19.99 12.1531 19.997 11.0281 19.999L10.2821 20H8.97308C8.24334 20.0026 7.5136 19.9949 6.78408 19.977L6.59008 19.971C6.35269 19.962 6.11535 19.9517 5.87808 19.94C4.81408 19.89 4.08808 19.722 3.45008 19.475C2.78291 19.2241 2.17852 18.8306 1.67908 18.322C1.17003 17.8224 0.776189 17.2176 0.525081 16.55C0.278081 15.913 0.11008 15.187 0.0600805 14.122L0.0300805 13.41L0.0250806 13.216C0.00664665 12.4868 -0.00168758 11.7574 8.05157e-05 11.028V8.972C-0.00268738 8.2426 0.00464673 7.5132 0.0220806 6.784L0.0290806 6.59C0.0370806 6.365 0.0470805 6.144 0.0590805 5.878C0.109081 4.813 0.27708 4.088 0.52408 3.45C0.775775 2.7822 1.1703 2.17744 1.68008 1.678C2.17923 1.16955 2.78327 0.776074 3.45008 0.525C4.08808 0.278 4.81308 0.11 5.87808 0.0599999C6.14408 0.0479999 6.36608 0.038 6.59008 0.03L6.78408 0.0239999C7.51327 0.00623271 8.24268 -0.0014347 8.97208 0.000999928L11.0281 0ZM10.0001 5C8.674 5 7.40223 5.52678 6.46455 6.46447C5.52687 7.40215 5.00008 8.67392 5.00008 10C5.00008 11.3261 5.52687 12.5979 6.46455 13.5355C7.40223 14.4732 8.674 15 10.0001 15C11.3262 15 12.5979 14.4732 13.5356 13.5355C14.4733 12.5979 15.0001 11.3261 15.0001 10C15.0001 8.67392 14.4733 7.40215 13.5356 6.46447C12.5979 5.52678 11.3262 5 10.0001 5ZM10.0001 7C10.394 6.99993 10.7842 7.07747 11.1482 7.22817C11.5122 7.37887 11.8429 7.5998 12.1215 7.87833C12.4002 8.15686 12.6212 8.48754 12.772 8.85149C12.9229 9.21544 13.0005 9.60553 13.0006 9.9995C13.0006 10.3935 12.9231 10.7836 12.7724 11.1476C12.6217 11.5116 12.4008 11.8423 12.1223 12.121C11.8437 12.3996 11.513 12.6206 11.1491 12.7714C10.7851 12.9223 10.395 12.9999 10.0011 13C9.20543 13 8.44237 12.6839 7.87976 12.1213C7.31715 11.5587 7.00108 10.7956 7.00108 10C7.00108 9.20435 7.31715 8.44129 7.87976 7.87868C8.44237 7.31607 9.20543 7 10.0011 7M15.2511 3.5C14.9196 3.5 14.6016 3.6317 14.3672 3.86612C14.1328 4.10054 14.0011 4.41848 14.0011 4.75C14.0011 5.08152 14.1328 5.39946 14.3672 5.63388C14.6016 5.8683 14.9196 6 15.2511 6C15.5826 6 15.9005 5.8683 16.135 5.63388C16.3694 5.39946 16.5011 5.08152 16.5011 4.75C16.5011 4.41848 16.3694 4.10054 16.135 3.86612C15.9005 3.6317 15.5826 3.5 15.2511 3.5Z"
                    fill="#291E1E"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_7_710">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </template>
          </BaseInput>

          <BaseInput
            placeholder="t.me/"
            :model-value="user.telegramm"
            @update:model-value="updateSocials($event, 'telegramm')"
          >
            <template #icon-left>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="telegram" clip-path="url(#clip0_7_725)">
                  <path
                    id="Vector"
                    d="M19.9362 3.51976L16.9062 17.7048C16.6802 18.7038 16.1002 18.9288 15.2622 18.4778L10.7172 15.1258L8.49216 17.2528C8.26716 17.4788 8.04116 17.7048 7.52516 17.7048L7.88016 13.0298L16.3582 5.32576C16.7122 4.97076 16.2612 4.84176 15.8102 5.13276L5.26916 11.7728L0.723157 10.3868C-0.275843 10.0648 -0.275843 9.38676 0.949157 8.93676L18.6142 2.06976C19.4842 1.81176 20.2262 2.26376 19.9362 3.51976Z"
                    fill="#291E1E"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_7_725">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </template>
          </BaseInput>
        </div>
        <div class="profile-edit__content-item">
          <div class="title">
            <p>Предпочтения</p>
          </div>
          <div class="links">
            <div @click="showEdit('budget')" class="link">
              <div class="label">Бюджет</div>

              <div class="text">
                <p>
                  {{ userInfos.budget?.name || '-' }}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.03309 1.98376C7.56389 2.42536 7.54151 3.16372 7.98312 3.63292L13.8972 9.91666L7.98312 16.2004C7.54151 16.6696 7.56389 17.408 8.03309 17.8496C8.50229 18.2912 9.24065 18.2688 9.68225 17.7996L16.3489 10.7163C16.7717 10.267 16.7717 9.56629 16.3489 9.11707L9.68225 2.03373C9.24065 1.56453 8.50229 1.54216 8.03309 1.98376Z"
                    fill="#291E1E"
                  />
                </svg>
              </div>
            </div>
            <div @click="showEdit('food_restrictions')" class="link">
              <div class="label">Ограничения в еде</div>

              <div class="text">
                <p>
                  {{ userInfos.foods }}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.03309 1.98376C7.56389 2.42536 7.54151 3.16372 7.98312 3.63292L13.8972 9.91666L7.98312 16.2004C7.54151 16.6696 7.56389 17.408 8.03309 17.8496C8.50229 18.2912 9.24065 18.2688 9.68225 17.7996L16.3489 10.7163C16.7717 10.267 16.7717 9.56629 16.3489 9.11707L9.68225 2.03373C9.24065 1.56453 8.50229 1.54216 8.03309 1.98376Z"
                    fill="#291E1E"
                  />
                </svg>
              </div>
            </div>
            <div @click="showEdit('event_languages')" class="link">
              <div class="label">Язык</div>

              <div class="text">
                <p>
                  {{ userInfos.languages || '-' }}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.03309 1.98376C7.56389 2.42536 7.54151 3.16372 7.98312 3.63292L13.8972 9.91666L7.98312 16.2004C7.54151 16.6696 7.56389 17.408 8.03309 17.8496C8.50229 18.2912 9.24065 18.2688 9.68225 17.7996L16.3489 10.7163C16.7717 10.267 16.7717 9.56629 16.3489 9.11707L9.68225 2.03373C9.24065 1.56453 8.50229 1.54216 8.03309 1.98376Z"
                    fill="#291E1E"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-edit__footer">
      <button class="btn btn-primary" @click="saveChanges">Сохранить изменения</button>
    </div>
    <BaseBottomSheet
      title=""
      :model-value="_showDeleteModal"
      @update:model-value="_showDeleteModal = false"
    >
      <div class="controls-modal">
        <div class="controls-modal__header">
          <p class="modal-title">ты уверен, что хочешь удалить аккаунт?</p>
          <p class="modal-description">
            Восстановить ваш аккаунт или любую удаленную информацию будет невозможно
          </p>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-primary" @click="closeDeleteModal">Подтвердить</button>
      </template>
    </BaseBottomSheet>

    <BaseDrawer :model-value="showEditDrawer" @update:model-value="closeEditDrawer">
      <component :is="editComponent" v-bind="editComponentBinds" />
    </BaseDrawer>
  </div>
</template>

<style scoped lang="scss">
.profile-edit {
  background-color: #fcf9ea;
  padding-bottom: 0;

  &.drawer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }

  &__navbar {
    display: flex;
    align-items: center;
    padding-top: 4px;
    padding-bottom: 4px;
    margin-left: -8px;
    margin-right: -8px;
    justify-content: space-between;

    button {
      display: flex;
      padding: 8px;
      align-items: center;
      gap: 2px;
      border: none;
      background-color: transparent;
    }

    &-title {
      color: var(--primary-dark, #291e1e);
      text-align: center;

      /* Text Medium */
      font-family: Manrope;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.6px;
    }
  }

  &__content {
    overflow: auto;

    &-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 0 12px 0;

      .user-avatar {
        width: 96px;
        height: 96px;
        border-radius: 100%;
        overflow: hidden;
        margin-bottom: 8px;
        background: var(--primary-gray);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-name {
        color: var(--primary-dark, #291e1e);
        text-align: center;

        /* H2 */
        font-family: 'Sofia Sans Extra Condensed';
        font-size: 34px;
        font-style: normal;
        font-weight: 800;
        line-height: 34px; /* 100% */
        text-transform: uppercase;
        margin-top: 8px;
        margin-bottom: 12px;
      }

      .user-location {
        color: var(--primary-dark, #291e1e);
        text-align: center;

        /* Caption */
        font-family: Manrope;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 133.333% */
        letter-spacing: -0.4px;
        margin-bottom: 12px;
      }

      .btn {
        margin-top: 6px;
        margin-bottom: 6px;
      }
    }

    &-items {
    }

    &-item {
      display: flex;
      padding-bottom: 12px;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 24px;

      &:deep {
        .textarea {
          .caption {
            display: none;
          }
        }
      }

      .title {
        display: inline-flex;
        padding: 12px;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        width: 100%;

        p {
          color: var(--primary-dark, #291e1e);

          /* Text Bold */
          font-family: Manrope;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: 22px; /* 137.5% */
          letter-spacing: -0.6px;
        }
      }

      .links {
        display: flex;
        width: 100%;
        padding: 12px;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        border-radius: 12px;
        border: 2px solid #000;
      }

      .link {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        width: 100%;
        border-bottom: 1px dashed var(--dark-color);

        &:last-child {
          border-bottom: none;
        }

        .text {
          p {
            color: var(--primary-dark, #291e1e);

            /* Text Bold */
            font-family: Manrope;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px; /* 137.5% */
            letter-spacing: -0.6px;
          }

          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding-bottom: 12px;
        }

        .label {
          color: var(--primary-dark, #291e1e);

          /* Caption */
          font-family: Manrope;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
          line-height: 16px; /* 133.333% */
          letter-spacing: -0.4px;
        }
      }
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 0;

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: left;

      svg {
        width: 20px;
        height: 20px;
        fill: var(--primary-dark, #291e1e);

        &:last-child {
          margin-left: auto;
        }
      }
    }
  }

  &__footer {
    padding: 12px 0;
    margin-top: auto;
  }

  &__title {
    padding: 12px 0;

    p {
      color: var(--primary-dark, #291e1e);

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
</style>
