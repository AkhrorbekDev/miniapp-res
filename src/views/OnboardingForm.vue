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
import BaseButtonGroup from '@/components/base/BaseButtonGroup.vue'

type Question = {
  navbarTitle: string
  title: string
  key: FormKeys
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
  children_statuses = 'has_children',
  occupations = 'occupation',
  participation = 'participation',
  decision_basis = 'decision_basis',
  conversation_style = 'conversation_style',
  evening_scenarios = 'evening_scenario',
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
  [FormKeys.children_statuses]: null,
  [FormKeys.occupations]: null,
  [FormKeys.participation]: null,
  [FormKeys.decision_basis]: null,
  [FormKeys.conversation_style]: null,
  [FormKeys.evening_scenarios]: null,
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
const activeSlide = ref(FormKeys.NAME)
const lastSlide = ref(FormKeys.NAME)
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


const questions = ref({
  [FormKeys.NAME]: {
    navbarTitle: 'Личность',
    key: FormKeys.NAME,
    title: 'Твое имя',
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
        questions.value[FormKeys.NAME].valid = formValues.value[FormKeys.NAME].length > 0
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
  [FormKeys.AGE]: {
    navbarTitle: 'Личность',
    title: 'твой возраст',
    key: FormKeys.AGE,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.AGE].valid)
    },
    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.AGE].valid = formValues.value[FormKeys.AGE] !== null
        return questions.value[FormKeys.AGE].valid
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
                nextSlide(FormKeys.gender, FormKeys.AGE, validation)
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
  [FormKeys.gender]: {
    navbarTitle: 'Личность',
    title: 'выбери пол',
    key: FormKeys.gender,
    submit: function () {
      return Promise.resolve(questions.value[FormKeys.gender].valid)
    },
    valid: false,
    showSubmitBtn: false,
    component: function () {
      const validation = function () {
        questions.value[FormKeys.gender].valid = formValues.value[FormKeys.gender] !== null
        return questions.value[FormKeys.gender].valid
      }
      return h(ThirdStep, {
        modelValue: formValues.value[FormKeys.gender],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.gender] = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.gender]: formValues.value[FormKeys.gender],
              })
              .then(() => {
                changePosition(4)
                nextSlide(FormKeys.relationship_status, FormKeys.gender, validation)
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
  [FormKeys.relationship_status]: {
    navbarTitle: 'Личность',
    title: 'семейный статус',
    key: FormKeys.relationship_status,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.relationship_status].valid)
    },
    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.relationship_status].valid =
          formValues.value[FormKeys.relationship_status] !== null
        return questions.value[FormKeys.relationship_status].valid
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
              nextSlide(FormKeys.children_statuses, FormKeys.relationship_status, validation)
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
  [FormKeys.children_statuses]: {
    navbarTitle: 'Личность',
    title: 'Есть ли у тебя дети?',
    key: FormKeys.children_statuses,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.children_statuses].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.children_statuses].valid =
          formValues.value[FormKeys.children_statuses] !== null
        return questions.value[FormKeys.children_statuses].valid
      }
      return h(BaseButtonGroup, {
        options: store.getDictionaries.children_statuses,
        modelValue: formValues.value[FormKeys.children_statuses],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.children_statuses] = e
          console.log(e)
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.children_statuses]: formValues.value[FormKeys.children_statuses],
              })
              .then(() => {
                changePosition(6)
                nextSlide(FormKeys.occupations, FormKeys.children_statuses, validation)
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
  [FormKeys.occupations]: {
    navbarTitle: 'Характер',
    title: 'Сфера деятельности',
    key: FormKeys.occupations,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.occupations].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.occupations].valid =
          formValues.value[FormKeys.occupations] !== null
        return questions.value[FormKeys.occupations].valid
      }
      return h(BaseButtonGroup, {
        options: store.getDictionaries.occupations,
        modelValue: formValues.value[FormKeys.occupations],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.occupations] = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.occupations]: formValues.value[FormKeys.occupations],
              })
              .then(() => {
                changePosition(7)
                nextSlide(FormKeys.participation, FormKeys.occupations, validation)
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
  [FormKeys.participation]: {
    navbarTitle: 'Характер',
    title: 'Основная цель участия',
    key: FormKeys.participation,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.participation].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.participation].valid =
          formValues.value[FormKeys.participation] !== null
        return questions.value[FormKeys.participation].valid
      }
      return h(BaseButtonGroup, {
        options: store.getDictionaries.participation,
        modelValue: formValues.value[FormKeys.participation],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.participation] = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.participation]: formValues.value[FormKeys.participation],
              })
              .then(() => {
                changePosition(8)
                nextSlide(FormKeys.decision_basis, FormKeys.participation, validation)
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
  [FormKeys.decision_basis]: {
    navbarTitle: 'Характер',
    title: 'На чем чаще основано твое решение?',
    key: FormKeys.decision_basis,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.decision_basis].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.decision_basis].valid =
          formValues.value[FormKeys.decision_basis] !== null
        return questions.value[FormKeys.decision_basis].valid
      }
      return h(BaseButtonGroup, {
        options: store.getDictionaries.decision_basis,
        modelValue: formValues.value[FormKeys.decision_basis],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.decision_basis] = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.decision_basis]: formValues.value[FormKeys.decision_basis],
              })
              .then(() => {
                changePosition(9)
                nextSlide(FormKeys.opinion_basis, FormKeys.decision_basis, validation)
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
  [FormKeys.opinion_basis]: {
    navbarTitle: 'Характер',
    title: 'Насколько комфортно ты вливаешься в новую компанию?',
    key: FormKeys.opinion_basis,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.opinion_basis].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.opinion_basis].valid =
          formValues.value[FormKeys.opinion_basis] !== null
        return questions.value[FormKeys.opinion_basis].valid
      }
      return h(FifthStep, {
        modelValue: formValues.value[FormKeys.opinion_basis],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.opinion_basis] = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.opinion_basis]: formValues.value[FormKeys.opinion_basis],
              })
              .then(() => {
                changePosition(10)
                nextSlide(FormKeys.introversion_level, FormKeys.opinion_basis, validation)
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
  [FormKeys.introversion_level]: {
    navbarTitle: 'Характер',
    title: 'Как часто ты знакомишься с новыми людьми?',
    key: FormKeys.introversion_level,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.introversion_level].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.introversion_level].valid =
          formValues.value[FormKeys.introversion_level] !== null
        return questions.value[FormKeys.introversion_level].valid
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
                changePosition(11)
                nextSlide(FormKeys.conversation_style, FormKeys.introversion_level, validation)
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
  [FormKeys.conversation_style]: {
    navbarTitle: 'Характер',
    title: 'Какой формат общения тебе ближе?',
    key: FormKeys.conversation_style,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.conversation_style].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.conversation_style].valid =
          formValues.value[FormKeys.conversation_style] !== null
        return questions.value[FormKeys.conversation_style].valid
      }
      return h(BaseButtonGroup, {
        options: store.getDictionaries.conversation_style,
        modelValue: formValues.value[FormKeys.conversation_style],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.conversation_style] = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.conversation_style]: formValues.value[FormKeys.conversation_style],
              })
              .then(() => {
                changePosition(12)
                nextSlide(FormKeys.evening_scenarios, FormKeys.conversation_style, validation)
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

  [FormKeys.evening_scenarios]: {
    navbarTitle: 'Характер',
    title: 'Какой сценарий вечера тебе больше подходит?',
    key: FormKeys.evening_scenarios,
    submit: async function () {
      return Promise.resolve(questions.value[FormKeys.evening_scenarios].valid)
    },

    valid: false,
    showSubmitBtn: false,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.evening_scenarios].valid =
          formValues.value[FormKeys.evening_scenarios] !== null
        return questions.value[FormKeys.evening_scenarios].valid
      }
      return h(BaseButtonGroup, {
        options: store.getDictionaries.evening_scenarios,
        modelValue: formValues.value[FormKeys.evening_scenarios],
        'onUpdate:modelValue': async (e) => {
          formValues.value[FormKeys.evening_scenarios] = e
          if (validation()) {
            await userService
              .updateUserDetails({
                [FormKeys.evening_scenarios]: formValues.value[FormKeys.evening_scenarios],
              })
              .then(() => {
                changePosition(13)
                nextSlide(FormKeys.socials, FormKeys.evening_scenarios, validation)
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
  [FormKeys.socials]: {
    navbarTitle: 'Знакомство',
    title: 'Твои социальные сети',
    key: FormKeys.socials,
    submit: async function () {
      if (questions.value[FormKeys.socials].valid) {
        await userService
          .updateUserDetails({
            instagram: formValues.value[FormKeys.instagram],
            telegramm: formValues.value[FormKeys.telegram],
          })
          .then(() => {
            changePosition(14)
          })
          .catch((error) => {
            if (tgWebApp) {
              tgWebApp.showAlert(error.message || 'Произошла ошибка')
            }
          })
      }
      return Promise.resolve(questions.value[FormKeys.socials].valid)
    },

    valid: true,
    showSubmitBtn: true,
    component: () => {
      const validation = function () {
        /*const instagramRegex = /^(www\.)?instagram\.com\/([a-zA-Z0-9._]{1,30})\/?$/
        const telegramRegex = /^(t(elegram)?\.me|telegram\.org)\/([a-zA-Z0-9_]{5,32})\/?$/
        if (
          formValues.value[FormKeys.instagram]?.length > 0 &&
          !instagramRegex.test(formValues.value[FormKeys.instagram])
        ) {
          questions.value[6].valid = false

          return
        } else {
          questions.value[6].valid = true
        }
        if (
          formValues.value[FormKeys.telegram]?.length > 0 &&
          !telegramRegex.test(formValues.value[FormKeys.telegram])
        ) {
          questions.value[6].valid = false
          return
        } else {
          questions.value[6].valid = true
        }*/
        questions.value[FormKeys.socials].valid = true
        return questions.value[FormKeys.socials].valid
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

  [FormKeys.photo]: {
    navbarTitle: 'Знакомство',
    title: 'добавь фото',
    key: FormKeys.photo,
    submit: async function () {
      changePosition(15)
      store.setUserAnket({
        [FormKeys.photo]: formValues.value[FormKeys.photo],
      })
      return Promise.resolve(questions.value[FormKeys.photo].valid)
    },

    valid: false,
    showSubmitBtn: true,
    component: () => {
      const validation = function () {
        questions.value[FormKeys.photo].valid =
          formValues.value[FormKeys.photo] !== null || formValues.value[FormKeys.photo].length > 0
        return questions.value[FormKeys.photo].valid
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
  [FormKeys.about_myself]: {
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
          changePosition(16)
          await createUserService()
            .getUserAnket()
            .then((response) => {
              store.setUserAnket(response)
            })
          router.push({
            params: {
              page: 'events-page',
              page2: '',
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
        return questions.value[FormKeys.about_myself].valid
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
})
const nextSlide = async (
  index: FormKeys,
  currentIndex: FormKeys,
  validation: () => boolean | Promise<boolean> = () => false,
) => {
  if (await validation() && index) {
    activeSlide.value = index
    lastSlide.value = currentIndex
  } else {
    showPreferences.value = true
  }
}
const pref = ref()
const prevSlide = () => {
  const q = Object.keys(questions.value)
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
        [activeSlide.value]: formValues.value[activeSlide.value],
      })
    }
    return
  }
  if (activeSlide.value !== FormKeys.NAME) {
    const lastIndex = q.findIndex(item => item === lastSlide.value)
    if (activeSlide.value === FormKeys.socials) {
      formValues.value[FormKeys.instagram] = null
      formValues.value[FormKeys.telegram] = null
      userService.updateUserDetails({
        [FormKeys.instagram]: formValues.value[FormKeys.instagram],
        [FormKeys.telegram]: formValues.value[FormKeys.telegram],
      })
    } else {
      console.log('lastSlide.value', lastSlide.value)
      console.log('activeSlide.value', activeSlide.value)
      if (activeSlide.value !== FormKeys.NAME) {
        formValues.value[lastSlide.value] = null
      }
      formValues.value[activeSlide.value] = null
      console.log('formValues.value', lastSlide.value ,formValues.value[lastSlide.value])
      console.log('formValues.valueasd', activeSlide.value ,formValues.value[activeSlide.value])
      userService.updateUserDetails({
        [activeSlide.value]:
          formValues.value[activeSlide.value],
        [lastSlide.value]: formValues.value[lastSlide.value]
      })
    }

    activeSlide.value = lastSlide.value
    lastSlide.value = q[lastIndex - 1]
    changePosition(store.getPosition - 1)
  }
}

const setValues = (data) => {
  let foudnPosition = false
  const q = Object.values(questions.value)
  for (let i = 0; i < q.length; i++) {
    let value = data[q[i].key]
    if (q[i].key === FormKeys.socials) {
      formValues.value[FormKeys.instagram] = data[FormKeys.instagram] || ''
      formValues.value[FormKeys.telegram] = data[FormKeys.telegram] || ''
      if (
        (!formValues.value.instagram || !formValues.value[FormKeys.telegram]) &&
        store.getPosition === 14
      ) {
        value = false
      } else {
        value = true
      }
    } else {
      formValues.value[q[i].key] = data[q[i].key]
      if (!formValues.value[q[i].key]) {
        value = ''
      }
    }
    // if (i === 0 && !data[questions.value[i + 1].key]) {
    //   foudnPosition = true
    //   activeSlide.value = i
    // }
    questions.value[q[i].key].valid = !!value
    if (q[i].key === FormKeys.about_myself) {
      questions.value[q[i].key].valid = true
      formValues.value[q[i].key] = data[q[i].key] || ''
    }

    if (store.getPosition === 10) {
      showPreferences.value = true
    }
    if (i + 1 === store.getPosition || !value) {
      if (!foudnPosition) {
        foudnPosition = true
        activeSlide.value = q[i].key
        if (i > 0) {
          lastSlide.value =  q[i - 1].key
        }
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
        <p>{{ !showPreferences ? questions[activeSlide]?.navbarTitle : 'Ужин' }}</p>
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
        v-for="(n, i, index) in questions"
        :key="i"
        :class="{
          active: activeSlide === i || index < store.getPosition,
        }"
        class="slide-indicators__item"
      ></div>
    </div>
    <div v-if="!showPreferences" class="slides">
      <template v-for="(question, n, index) in questions" :key="n">
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
              @click="nextSlide(Object.values(questions)[index + 1]?.key, n, question.submit)"
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
