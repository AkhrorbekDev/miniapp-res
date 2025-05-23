<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FirstStep from '@/components/onboarding/FirstStep.vue'
import SecondStep from '@/components/onboarding/SecondStep.vue'
import ThirdStep from '@/components/onboarding/ThirdStep.vue'
import FourthStep from '@/components/onboarding/FourthStep.vue'
import FifthStep from '@/components/onboarding/FifthStep.vue'
import SixStep from '@/components/onboarding/SixStep.vue'
import SocialsStep from '@/components/onboarding/SocialsStep.vue'
import UserPhotoStep from '@/components/onboarding/UserPhotoStep.vue'
import AboutUserStep from '@/components/onboarding/AboutUserStep.vue'
import UserPreferences from '@/components/onboarding/UserPreferences.vue'
import { createUserService } from '@/services'
import { useOnboardingStore } from '@/stores/onboarding.ts'

type Question = {
  navbarTitle: string
  title: string
  key: string
  submit: () => void | boolean | any
  valid: boolean
  showSubmitBtn: boolean
  component: any
}

enum FormKeys {
  NAME = 'name',
  AGE = 'age',
  gender = 'gender',
  relationship_status = 'relationship_status',
  opinion_basis = 'opinion_basis',
  introversion_level = 'introversion_level',
  photo = 'photo',
  socials = 'socials',
  instagram = 'instagram',
  telegram = 'telegramm',
  about_myself = 'about_myself',
  food_restrictions = 'food_restrictions',
  event_language = 'event_languages',
  budget = 'event_budget',
}

const formValues = ref({
  [FormKeys.NAME]: '',
  [FormKeys.AGE]: null,
  [FormKeys.gender]: null,
  [FormKeys.relationship_status]: null,
  [FormKeys.opinion_basis]: null,
  [FormKeys.introversion_level]: null,
  [FormKeys.photo]: null,
  [FormKeys.instagram]: '',
  [FormKeys.telegram]: '',
  [FormKeys.about_myself]: '',
  [FormKeys.food_restrictions]: [],
  [FormKeys.event_language]: [],
  [FormKeys.budget]: null,
})
const router = useRouter()
const activeSlide = ref(0)
const showPreferences = ref(false)
const store = useOnboardingStore()
const userService = createUserService()
const tgWebApp = window.Telegram.WebApp
const changePosition = (position: number) => {
  userService.changePosition(position).then(() => {
    store.setPosition(position)
  })
}
const changePreferances = (e) => {
  formValues.value[e.key] = e.value
}

const questions = ref<Question[]>([
  {
    navbarTitle: 'Личность',
    key: [FormKeys.NAME],
    title: 'твое Имя',
    submit: async function () {
      let result = false
      await userService
        .updateUserDetails({
          [FormKeys.NAME]: formValues.value[FormKeys.NAME],
        })
        .then(() => {
          changePosition(2)
          result = true
        })
        .catch((error) => {
          if (tgWebApp) {
            tgWebApp.showAlert(error.message || 'Произошла ошибка')
          }
          result = false
        })
      return Promise.resolve(result)
    },
    valid: false,
    showSubmitBtn: true,
    component: () => {
      const validation = function () {
        questions.value[0].valid = formValues.value[FormKeys.NAME].length > 0
      }
      return h(FirstStep, {
        modelValue: formValues.value[FormKeys.NAME],
        'onUpdate:modelValue': (e: string) => {
          formValues.value[FormKeys.NAME] = e
          validation()
        },
      })
    },
  },
  {
    navbarTitle: 'Личность',
    title: 'твой возраст',
    key: FormKeys.AGE,
    submit: async function () {
      return Promise.resolve(questions.value[1].valid)
    },
    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[1].valid = formValues.value[FormKeys.AGE] !== null
        return questions.value[1].valid
      }
      return h(SecondStep, {
        modelValue: formValues.value[FormKeys.AGE],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.AGE] = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.AGE]: formValues.value[FormKeys.AGE],
              })
              .then(() => {
                changePosition(3)
                nextSlide(1, validation)
              })
              .catch((error) => {
                if (tgWebApp) {
                  tgWebApp.showAlert(error.message || 'Произошла ошибка')
                }
              })
          }
        },
      })
    },
  },
  {
    navbarTitle: 'Личность',
    title: 'выбери пол',
    key: FormKeys.gender,
    submit: function () {
      return Promise.resolve(questions.value[2].valid)
    },
    valid: false,
    showSubmitBtn: false,
    component: function () {
      const validation = function () {
        questions.value[2].valid = formValues.value[FormKeys.gender] !== null

        return questions.value[2].valid
      }
      return h(ThirdStep, {
        modelValue: formValues.value[FormKeys.gender],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.gender] = e
          if (validation()) {
            let result = false
            await userService
              .updateUserDetails({
                [FormKeys.gender]: formValues.value[FormKeys.gender],
              })
              .then(() => {
                changePosition(4)
                result = true
                nextSlide(2, validation)
              })
              .catch((error) => {
                if (tgWebApp) {
                  tgWebApp.showAlert(error.message || 'Произошла ошибка')
                }
                result = false
              })
          }
        },
      })
    },
  },
  {
    navbarTitle: 'Личность',
    title: 'семейный статус',
    key: FormKeys.relationship_status,
    submit: async function () {
      return Promise.resolve(questions.value[3].valid)
    },
    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[3].valid = formValues.value[FormKeys.relationship_status] !== null
        return questions.value[3].valid
      }
      return h(FourthStep, {
        modelValue: formValues.value[FormKeys.relationship_status],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.relationship_status] = e
          await userService
            .updateUserDetails({
              [FormKeys.relationship_status]: formValues.value[FormKeys.relationship_status],
            })
            .then(() => {
              changePosition(5)
              nextSlide(3, validation)
            })
            .catch((error) => {
              if (tgWebApp) {
                tgWebApp.showAlert(error.message || 'Произошла ошибка')
              }
            })
        },
      })
    },
  },
  {
    navbarTitle: 'Характер',
    title: 'Основа мнений',
    key: FormKeys.opinion_basis,
    submit: async function () {
      return Promise.resolve(questions.value[4].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[4].valid = formValues.value[FormKeys.opinion_basis] !== null
        return questions.value[4].valid
      }
      return h(FifthStep, {
        modelValue: formValues.value[FormKeys.opinion_basis],
        'onUpdate:modelValue': async (e) => {
          formValues.value.opinion_basis = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.opinion_basis]: formValues.value[FormKeys.opinion_basis],
              })
              .then(() => {
                changePosition(6)
                nextSlide(4, validation)
              })
              .catch((error) => {
                if (tgWebApp) {
                  tgWebApp.showAlert(error.message || 'Произошла ошибка')
                }
              })
          }
        },
      })
    },
  },
  {
    navbarTitle: 'Характер',
    title: 'насколько ты Интроверт?',
    key: FormKeys.introversion_level,
    submit: async function () {
      return Promise.resolve(questions.value[5].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[5].valid = formValues.value[FormKeys.introversion_level] !== null
        return questions.value[5].valid
      }
      return h(SixStep, {
        modelValue: formValues.value[FormKeys.introversion_level],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.introversion_level] = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.introversion_level]: formValues.value[FormKeys.introversion_level],
              })
              .then(() => {
                changePosition(7)
                nextSlide(5, validation)
              })
              .catch((error) => {
                if (tgWebApp) {
                  tgWebApp.showAlert(error.message || 'Произошла ошибка')
                }
              })
          }
        },
      })
    },
  },
  {
    navbarTitle: 'Знакомство',
    title: 'Твои социальные сети',
    key: FormKeys.socials,
    submit: async function () {
      if (questions.value[6].valid) {
        await userService
          .updateUserDetails({
            instagram: formValues.value[FormKeys.instagram],
            telegramm: formValues.value[FormKeys.telegram],
          })
          .then(() => {
            changePosition(8)
          })
          .catch((error) => {
            if (tgWebApp) {
              tgWebApp.showAlert(error.message || 'Произошла ошибка')
            }
          })
      }
      return Promise.resolve(questions.value[6].valid)
    },

    valid: true,
    showSubmitBtn: true,
    component: () => {
      const validation = function () {
        // const instagramRegex = /^(www\.)?instagram\.com\/([a-zA-Z0-9._]{1,30})\/?$/
        // const telegramRegex = /^(t(elegram)?\.me|telegram\.org)\/([a-zA-Z0-9_]{5,32})\/?$/
        // if (
        //   formValues.value[FormKeys.instagram]?.length > 0 &&
        //   !instagramRegex.test(formValues.value[FormKeys.instagram])
        // ) {
        //   questions.value[6].valid = false
        //
        //   return
        // } else {
        //   questions.value[6].valid = true
        // }
        // if (
        //   formValues.value[FormKeys.telegram]?.length > 0 &&
        //   !telegramRegex.test(formValues.value[FormKeys.telegram])
        // ) {
        //   questions.value[6].valid = false
        //   return
        // } else {
        //   questions.value[6].valid = true
        // }
        questions.value[6].valid = true
        return questions.value[6].valid
      }
      validation()
      return h(SocialsStep, {
        [FormKeys.instagram]: formValues.value[FormKeys.instagram],
        [FormKeys.telegram]: formValues.value[FormKeys.telegram],
        'onUpdate:instagram': (e) => {
          formValues.value[FormKeys.instagram] = e
          validation()
        },
        'onUpdate:telegramm': (e) => {
          formValues.value[FormKeys.telegram] = e
          validation()
        },
      })
    },
  },
  {
    navbarTitle: 'Знакомство',
    title: 'добавь фото',
    key: FormKeys.photo,
    submit: async function () {
      changePosition(9)
      store.setUserAnket({
        [FormKeys.photo]: formValues.value[FormKeys.photo],
      })
      return Promise.resolve(questions.value[7].valid)
    },

    valid: false,
    showSubmitBtn: true,
    component: () => {
      const validation = function () {
        questions.value[7].valid =
          formValues.value[FormKeys.photo] !== null || formValues.value[FormKeys.photo].length > 0
        return questions.value[7].valid
      }
      return h(UserPhotoStep, {
        modelValue: formValues.value[FormKeys.photo],
        'onUpdate:modelValue': (e) => {
          formValues.value[FormKeys.photo] = e
          validation()
        },
      })
    },
  },
  {
    navbarTitle: 'Знакомство',
    title: 'Расскажи о себе',
    key: FormKeys.about_myself,
    submit: async function () {
      let result = false
      await userService
        .updateUserDetails({
          [FormKeys.about_myself]: formValues.value[FormKeys.about_myself],
        })
        .then(async () => {
          changePosition(11)
          await createUserService()
            .getUserAnket()
            .then((response) => {
              store.setUserAnket(response)
            })
          router.push({
            params: {
              page: 'events-page',
            },
          })
        })
        .catch((error) => {
          if (tgWebApp) {
            tgWebApp.showAlert(error.message || 'Произошла ошибка')
          }
        })
      return Promise.resolve(result)
    },

    valid: true,
    showSubmitBtn: true,
    component: () => {
      const validation = function () {
        return questions.value[8].valid
      }
      return h(AboutUserStep, {
        modelValue: formValues.value[FormKeys.about_myself],
        'onUpdate:modelValue': (e) => {
          formValues.value[FormKeys.about_myself] = e
          validation()
        },
      })
    },
  },
])
const nextSlide = async (
  index: number,
  validation: () => boolean | Promise<boolean> = () => false,
) => {
  if ((await validation()) && activeSlide.value < questions.value.length - 1) {
    activeSlide.value++
  } else {
    showPreferences.value = true
  }
}
const pref = ref()
const prevSlide = () => {
  if (showPreferences.value) {
    if (pref.value.onConfirmation()) {
      pref.value.onBack()
    } else {
      formValues.value[FormKeys.food_restrictions] = []
      formValues.value[FormKeys.event_language] = []
      formValues.value[FormKeys.budget] = null
      showPreferences.value = false
      formValues.value[questions.value[activeSlide.value].key] = ''
      userService.updateUserDetails({
        [FormKeys.food_restrictions]: formValues.value[FormKeys.food_restrictions],
        [FormKeys.event_language]: formValues.value[FormKeys.event_language],
        [FormKeys.budget]: formValues.value[FormKeys.budget],
        [questions.value[activeSlide.value].key]:
          formValues.value[questions.value[activeSlide.value].key],
      })
    }
    return
  }
  if (activeSlide.value > 0) {
    if (questions.value[activeSlide.value - 1].key === FormKeys.socials) {
      formValues.value[FormKeys.instagram] = null
      formValues.value[FormKeys.telegram] = null
      userService.updateUserDetails({
        [FormKeys.instagram]: formValues.value[FormKeys.instagram],
        [FormKeys.telegram]: formValues.value[FormKeys.telegram],
      })
    } else {
      if (activeSlide.value - 1 !== 0) {
        formValues.value[questions.value[activeSlide.value - 1].key] = null
      }
      userService.updateUserDetails({
        [questions.value[activeSlide.value - 1].key]:
          formValues.value[questions.value[activeSlide.value - 1].key],
      })
    }

    activeSlide.value--
    changePosition(store.getPosition - 1)
  }
}

const setValues = (data) => {
  let foudnPosition = false
  for (let i = 0; i < questions.value.length; i++) {
    let value = data[questions.value[i].key]
    if (questions.value[i].key === FormKeys.socials) {
      formValues.value[FormKeys.instagram] = data[FormKeys.instagram] || ''
      formValues.value[FormKeys.telegram] = data[FormKeys.telegram] || ''
      if ((!formValues.value.instagram || !formValues.value[FormKeys.telegram]) && store.getPosition === 7) {
        value = false
      } else {
        value = true
      }
    } else {
      formValues.value[questions.value[i].key] = data[questions.value[i].key]
      if (!formValues.value[questions.value[i].key]) {
        value = ''
      }
    }
    // if (i === 0 && !data[questions.value[i + 1].key]) {
    //   foudnPosition = true
    //   activeSlide.value = i
    // }
    questions.value[i].valid = !!value
    if (questions.value[i].key === FormKeys.about_myself) {
      questions.value[i].valid = true
      formValues.value[questions.value[i].key] = data[questions.value[i].key] || ''
    }

    if (store.getPosition === 10) {
      showPreferences.value = true
    }
    if (i + 1 === store.getPosition || !value) {
      if (!foudnPosition) {
        foudnPosition = true
        activeSlide.value = i
      }
    }
  }

  formValues.value[FormKeys.event_language] = data[FormKeys.event_language] || []
  formValues.value[FormKeys.food_restrictions] = data[FormKeys.food_restrictions] || []
  formValues.value[FormKeys.budget] = data[FormKeys.budget] || []
}

onMounted(() => {
  if (store.getPosition === 0) {
    createUserService().changePosition(1)
  }
  setValues({
    ...store.getUserAnket,
  })
})
</script>

<template>
  <div class="main-container onboarding-form">
    <div class="onboarding-form__navbar">
      <button @click="prevSlide">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.3595 2.38052C14.9226 2.91045 14.9494 3.79647 14.4195 4.35951L7.32255 11.9L14.4195 19.4405C14.9494 20.0035 14.9226 20.8896 14.3595 21.4195C13.7965 21.9494 12.9104 21.9226 12.3805 21.3595L4.38052 12.8595C3.87316 12.3204 3.87316 11.4796 4.38052 10.9405L12.3805 2.44049C12.9104 1.87745 13.7965 1.8506 14.3595 2.38052Z"
            fill="#291E1E"
          />
        </svg>
      </button>
      <div class="onboarding-form__navbar-title">
        <p>{{ !showPreferences ? questions[activeSlide].navbarTitle : 'Ужин' }}</p>
      </div>
      <button style="visibility: hidden">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.3595 2.38052C14.9226 2.91045 14.9494 3.79647 14.4195 4.35951L7.32255 11.9L14.4195 19.4405C14.9494 20.0035 14.9226 20.8896 14.3595 21.4195C13.7965 21.9494 12.9104 21.9226 12.3805 21.3595L4.38052 12.8595C3.87316 12.3204 3.87316 11.4796 4.38052 10.9405L12.3805 2.44049C12.9104 1.87745 13.7965 1.8506 14.3595 2.38052Z"
            fill="#291E1E"
          />
        </svg>
      </button>
    </div>
    <div v-if="!showPreferences" class="slide-indicators">
      <div
        v-for="(n, i) in questions"
        :key="i"
        :class="{
          active: activeSlide === i || activeSlide > i,
        }"
        class="slide-indicators__item"
      ></div>
    </div>
    <div v-if="!showPreferences" class="slides">
      <template v-for="(question, n) in questions" :key="n">
        <div
          :class="{
            active: activeSlide === n,
          }"
          class="slides-item"
        >
          <div style="height: 100%">
            <div class="slides-item__title">
              {{ question.title }}
            </div>
            <component :is="question.component"></component>
          </div>
          <div v-if="question.showSubmitBtn" class="onboarding-form__footer">
            <button
              @click="nextSlide(n, question.submit)"
              :disabled="!question.valid"
              class="btn"
              :class="{
                'btn-primary': question.valid,
              }"
            >
              Далее
            </button>
          </div>
        </div>
      </template>
    </div>
    <template v-else>
      <UserPreferences
        ref="pref"
        :model-value="formValues"
        @update:model-value="changePreferances"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/pages/onboarding-form';
</style>
