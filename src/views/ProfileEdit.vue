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
import FifthStep from '@/components/onboarding/FifthStep.vue'
import SocialsStep from '@/components/onboarding/SocialsStep.vue'

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
  let value = e
  if (key === 'instagram') {
    value = `https://instagram.com/${e}`
  } else if (key === 'telegramm') {
    value = `https://t.me/${e}`
  }
  user.value[key] = e
  editedValues.value[key] = value
}
const imagerUploading = ref(false)
const uploadAvatar = (e) => {
  const file = e.target.files[0]
  const formData = new FormData()
  const tgWebApp = window.Telegram.WebApp
  formData.append('photo', file)
  if (file) {
    imagerUploading.value = true
    createUserService()
      .changeAvatar(formData)
      .then((res) => {
        user.value.photo = res.photo
      })
      .catch((err) => {
        tgWebApp.showAlert('Ошибка загрузки фото')
      })
      .finally(() => {
        imagerUploading.value = false
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
    editComponentBinds.value = {
      modelValue: user.value.opinion_basis,
    }
    editComponent.value = h(FifthStep, {
      'onUpdate:modelValue': (e: string) => {
        editComponentBinds.value.modelValue = e
        editedValues.value.opinion_basis = e
        user.value.opinion_basis = e
      },
    })
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
    about_myself: editedValues.value.about_myself,
    instagram: editedValues.value.instagram,
    telegramm: editedValues.value.telegramm,
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
  const instagramValue = store.getUserAnket.instagram.replace(
    'https://instagram.com/',
    ''
  )
  const telegrammValue = store.getUserAnket.telegramm.replace(
    'https://t.me/',
    ''
  )
  user.value = {
    ...store.getUserAnket,
    instagram: instagramValue,
    telegramm: telegrammValue,
  }
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
          <div v-if="imagerUploading" class="loader">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="0.75s"
                  values="0 12 12;360 12 12"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
          <img :src="user.photo ? 'https://miniapp.forkies.ru/' + user.photo : notProfile" alt="Avatar" />
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
                <p>
                  {{ user.opinion_basis }}
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
            <span>{{ user.about_myself?.length || 0 }}/500</span>
          </div>
          <BaseTextArea
            class="textarea"
            :model-value="user.about_myself"
            @update:model-value="updateAboutSelf"
          />
        </div>
        <div class="profile-edit__content-item">
          <div class="title">
            <p>Социальные сети</p>
          </div>
          <SocialsStep
            :instagram="user.instagram"
            :telegramm="user.telegramm"
            @update:instagram="updateSocials($event, 'instagram')"
            @update:telegramm="updateSocials($event, 'telegramm')"
          />
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
        position: relative;


        .loader {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: #11111190;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;

          svg path {
            fill: var(--primary-accent);
          }
        }

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
