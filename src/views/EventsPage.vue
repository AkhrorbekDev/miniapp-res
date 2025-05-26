<script setup lang="ts">
import BaseRadio from '@/components/base/BaseRadio.vue'
import { computed, onMounted, ref } from 'vue'
import MobileMenu from '@/components/MobileMenu.vue'
import BaseBottomSheet from '@/components/base/BaseBottomSheet.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseCheckbox from '@/components/base/BaseCheckbox.vue'

import { eventsService, promocodeService } from '@/services/publicServices'
import paymentService from '@/services/paymentService.ts'
import PaymentSuccessScreen from '@/views/PaymentSuccessScreen.vue'
import { createUserService } from '@/services'
import { useOnboardingStore } from '@/stores/onboarding.ts'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// import required modules
import { Pagination, Navigation } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import notProfile from '@/assets/img/notProfile.jpg'

const events = ref([])

const swiperModules = [Pagination, Navigation]

const userEvent = ref(null)
const eventGames = ref(null)
const userEventStats = ref({
  restaurant: {
    status: false,
    date_modif: '-',
    date: '2025-05-22T10:00:00Z',
  },
  group: {
    status: false,
    date_modif: '-',
    date: '2025-05-22T15:45:00Z',
  },
  game: {
    status: false,
    date_modif: '-',
    date: '2025-05-22T16:30:00Z',
  },
  bar: {
    status: false,
    date_modif: '-',
    date: '2025-05-22T17:30:00Z',
  },
})
const isoToDate = (isoString: string, type: string = 'long') => {
  const date = new Date(isoString)

  if (type === 'short') {
    return date.toLocaleDateString('ru-RU', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Europe/Moscow', // добавлено
    })
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow', // добавлено
  }

  const formatted = new Intl.DateTimeFormat('ru-RU', options).format(date)

  // Заменим "в" на запятую и сделаем первую букву заглавной
  const final = formatted.replace(' в ', ', ')
  return final.charAt(0).toUpperCase() + final.slice(1)
}

const selectedEvent = ref(null)
const _showBottomSheet = ref(false)
const showPaymentForm = ref(false)
const showCardForm = ref(false)
const event = ref(null)
const selectedReason = ref(null)
const selectedDate = ref(null)
const promocode = ref('')
const promocodeMessage = ref('')
const offertaChecked = ref(false)
const offertaCheckedDef = ref(true)
const showSuccessFrame = ref(false)
const showEventControls = ref(false)
const showEventChangeDate = ref(false)
const showSuccessModal = ref(false)
const showConfirmModal = ref(false)
const showEventCancel = ref(false)
const showInfoModal = ref(false)
const showGameDrawer = ref(false)
const showDiscountModal = ref(false)
const emergancyPromo = ref('')
const showGameBottomSheet = ref(false)
const showGroupItemModal = ref(false)
const selectedGroupItem = ref(null)
const selectedGameItem = ref(null)
const card = ref({
  pan: '',
  date: '',
  cvv: '',
})
const paymentType = ref('subscription')

const closePaymentForm = () => {
  showPaymentForm.value = false
  offertaChecked.value = false
  promocode.value = ''
  paymentType.value = 'subscription'
}

const openGameDrawer = (item) => {
  selectedGameItem.value = item
  showGameDrawer.value = true
}
const showGameModal = () => {
  showGameBottomSheet.value = true
}

const showGroupItem = (item) => {
  selectedGroupItem.value = item
  showGroupItemModal.value = true
}

const closeGroupItemModal = () => {
  showGroupItemModal.value = false
  selectedGroupItem.value = null
}

const getUserEvent = () => {
  return Promise.all([
    createUserService()
      .getUserEvents()
      .then((res) => {
        if (res[0]?.event_id) {
          userEvent.value = res[0]
          selectedDate.value = userEvent.value.event_id
          userEvent.value.locationName =
            store.getDictionaries?.cities?.find((city) => city.id === userEvent.value.city)?.name ||
            '-'
        } else {
          userEvent.value = null
        }
        return Promise.resolve()
      })
      .catch((err) => {
        const tgWebApp = window.Telegram.WebApp
        tgWebApp.showAlert('Ошибка получения ваших событий')
        return Promise.resolve()
      }),
    createUserService()
      .getEventGame()
      .then((res) => {
        eventGames.value = res
        return Promise.resolve()
      })
      .catch(() => {
        const tgWebApp = window.Telegram.WebApp
        tgWebApp.showAlert('Ошибка получения статус вашей игры')
        return Promise.resolve()
      }),
    createUserService()
      .getUserEventStats()
      .then((res) => {
        userEventStats.value = res
        return Promise.resolve()
      })
      .catch(() => {
        const tgWebApp = window.Telegram.WebApp
        tgWebApp.showAlert('Ошибка получения статус ваших событий')
        return Promise.resolve()
      }),
  ])
}
const pay = () => {
  showCardForm.value = false
  if (validateCard.value) {
    paymentService()
      .pay({
        card: {
          pan: card.value.pan,
          date: card.value.date,
          cvv: card.value.cvv,
        },
        amount: prices.value.price,
        event_id: selectedEvent.value,
        payment_type: paymentType.value,
      })
      .then((res) => {
        console.log('Payment successful:', res)
        // Handle successful payment here
      })
      .catch((err) => {
        console.error('Payment error:', err)
        // Handle payment error here
      })
  } else {
    console.log('Invalid card details')
  }
}
const confirmPayment = () => {
  if (offertaChecked.value) {
    const tgWebApp = window.Telegram.WebApp

    createUserService()
      .registerToEvent({
        event_id: selectedEvent.value,
      })
      .then((res) => {
        if (prices.value.price - prices.value.promocodePrice === 0 || res.event_price === 0) {
          showSuccessFrame.value = true
          showPaymentForm.value = false
          _promocodeValue.value = {
            code: '',
            promo_event_price: 0,
          }
          getUserEvent().then(() => {
            selectedEvent.value = null
          })
          return
        }
        const language = 'ru-RU'
        const widget = new cp.CloudPayments({ language: language })
        widget.pay(
          'auth', // или 'charge'
          {
            //options
            publicId: 'pk_dbb7431f80a9ac46f07793ef02de8',
            description: 'Оплата ужина Forkies.ru',
            amount: res.event_price,
            currency: 'RUB',
            accountId: res.account_id,
            invoiceId: res.payment_id,
            skin: 'mini',
            autoClose: 3,
          },
          {
            onSuccess: function (options) {
              showSuccessFrame.value = true
              showPaymentForm.value = false
              _promocodeValue.value = {
                code: '',
                promo_event_price: 0,
              }
              getUserEvent().then(() => {
                selectedEvent.value = null
              })
            },
            onFail: function (reason, options) {
              tgWebApp.showAlert('Ошибка оплаты: ' + JSON.stringify(reason))
            },
            onComplete: function (paymentResult, options) {
              console.log('Завершение:', paymentResult)
            },
          },
        )
      })
      .catch((err) => {
        tgWebApp.showAlert('Ошибка бронирования')
      })
  } else {
    console.log('Please accept the terms and conditions')
  }
}

const formValues = ref({
  promocode: '',
  event_id: selectedEvent,
  payment_type: paymentType,
})
const _promocodeValue = ref({
  code: '',
  promo_event_price: 0,
})
const checkPromocode = () => {
  // Handle promocode logic here
  if (!promocode.value) {
    return
  }
  promocodeService()
    .getPromocode({
      promo_code: promocode.value,
      event_id: selectedEvent.value,
    })
    .then((res) => {
      promocodeMessage.value = `Промокод ${promocode.value} активирован`
      formValues.value.promocode = promocode.value
      _promocodeValue.value = {
        ...res,
        code: promocode.value,
      }
      const timer = setTimeout(() => {
        promocodeMessage.value = ''
        clearTimeout(timer)
      }, 2000)
    })
    .catch((err) => {
      promocodeMessage.value = err.data.detail || 'Произошла ошибка'

      const timer = setTimeout(() => {
        promocodeMessage.value = ''
        clearTimeout(timer)
      }, 2000)
    })
}

const showBottomSheet = () => {
  const e = events.value.find((event) => event.id === selectedEvent.value)
  if (e) {
    event.value = e
    showPaymentForm.value = true
  }
}

function isUnder24Hours(isoDateStr) {
  const MSK_OFFSET = 3 * 60 // в минутах
  const nowUTC = new Date(new Date().toISOString()) // текущее время в UTC
  const nowMSK = new Date(nowUTC.getTime() + MSK_OFFSET * 60 * 1000)

  const target = new Date(isoDateStr)
  const diffInMs = target.getTime() - nowMSK.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)

  return diffInHours < 24
}

const showControls = () => {
  showEventControls.value = true
}

const closeCardForm = () => {
  showCardForm.value = false
  card.value = {
    pan: '',
    date: '',
    cvv: '',
  }

  _showBottomSheet.value = true
}

const checkOfferta = () => {
  offertaChecked.value = !offertaChecked.value
}

const paymentAmount = computed(() => {
  const selectedEventData = events.value.find((event) => event.id === selectedEvent.value)
  if (!selectedEventData) {
    return 0
  }
  return _promocodeValue.value.promo_event_price
    ? _promocodeValue.value.promo_event_price
    : selectedEventData.price
})

const prices = computed(() => {
  const selectedEventData = events.value.find((event) => event.id === selectedEvent.value)
  return {
    price: selectedEventData?.price || 0,
    promocodePrice: _promocodeValue.value.promo_event_price,
  }
})

const validateCard = computed(() => {
  const { pan, date, cvv } = card.value
  if (!pan || !date || !cvv) {
    return true
  }
  // Add more validation logic if needed
  return true
})

const eventStatus = computed(() => {
  if (userEvent.value) {
    return userEvent.value.is_paid
  }
  return false
})

const selectedEventLocation = computed(() => {
  if (userEvent.value) {
    const location = store.getDictionaries.cities.find((city) => city.id === userEvent.value.city)
    return location.name
  } else {
    const selectedEventData = events.value.find((event) => event.id === selectedEvent.value)
    if (selectedEventData) {
      const location = store.getDictionaries.cities.find(
        (city) => city.id === selectedEventData.city,
      )
      return location.name
    }
  }
  return ''
})

const cancelReasons = ref([])

const showChangeDate = () => {
  if (isUnder24Hours(userEvent.value.event_date)) {
    showInfoModal.value = true
    showEventControls.value = false
  } else {
    showEventChangeDate.value = true
    showEventControls.value = false
  }
}

const cancelEvent = () => {
  if (isUnder24Hours(userEvent.value.event_date)) {
    showInfoModal.value = true
    showEventControls.value = false
  } else {
    showConfirmModal.value = true
    showEventControls.value = false
  }
}

const closeInfoModal = () => {
  showInfoModal.value = false
}

const submitCancelation = () => {
  if (selectedReason.value) {
    const tgWebApp = window.Telegram.WebApp

    createUserService()
      .cancelEvent({
        registration_id: userEvent.value.reg_id,
        cancellation_reason_id: selectedReason.value,
      })
      .then(() => {
        showEventCancel.value = false
        showEventControls.value = false
        showSuccessModal.value = true
        submitEventTitle.value = 'Бронь отменена'
        submitEventDesc.value = 'Спасибо за ответы!'
        getUserEvent()
      })
      .catch((err) => {
        tgWebApp.showAlert('Ошибка отмены бронирования')
        console.error('Error canceling event:', err)
      })
  }
}
const submitChangeDate = () => {
  if (selectedDate.value) {
    const tgWebApp = window.Telegram.WebApp

    createUserService()
      .updateEvent({
        event_id: selectedDate.value,
      })
      .then((res) => {
        showEventChangeDate.value = false
        showEventControls.value = false
        showSuccessModal.value = true
        submitEventTitle.value = 'Бронь перенесена'
        submitEventDesc.value = `Новая дата ужина - ${isoToDate(res.new_event_date)}`
        getUserEvent()
      })
      .catch(() => {
        tgWebApp.showAlert('Ошибка переноса бронирования')
      })
  }
}

const submitEmergencyReason = (value) => {
  if (value) {
    const tgWebApp = window.Telegram.WebApp
    createUserService()
      .cancelEvent({
        registration_id: userEvent.value.reg_id,
      })
      .then((res) => {
        emergancyPromo.value = res.promo_code
        showDiscountModal.value = true
        showInfoModal.value = false

        getUserEvent()
      })
      .catch((err) => {
        tgWebApp.showAlert(`Ошибка отмены бронирования: ${err.data.detail}`)
      })
  } else {
    showInfoModal.value = false
  }
}

const submitEventTitle = ref('')
const submitEventDesc = ref('')

const closeSuccessModal = () => {
  showSuccessModal.value = false
  submitEventTitle.value = ''
  submitEventDesc.value = ''
}

const closeDiscountModal = () => {
  showDiscountModal.value = false
  emergancyPromo.value = false
}
const closeConfirmModal = () => {
  showConfirmModal.value = false
  showEventControls.value = true
}
const closeReasonsModal = () => {
  showEventCancel.value = false
  showEventControls.value = true
}
const closeDateModal = () => {
  showEventChangeDate.value = false
  showEventControls.value = true
}
const showCancelResions = () => {
  showConfirmModal.value = false
  showEventCancel.value = true
}
const store = useOnboardingStore()

onMounted(async () => {
  await Promise.all([
    eventsService()
      .getEvents()
      .then((response) => {
        events.value = response
        if (events.value.length > 0) {
          event.value = events.value[0]
        }
      })
      .catch((error) => {
        console.error('Error fetching events:', error)
      }),
    getUserEvent(),
  ])
  cancelReasons.value = store.dictionaries.cancellation_reason
})
</script>

<template>
  <div class="events-page drawer">
    <div class="events-page__header">
      <img src="@/assets/img/photo.jpg" alt="" />
      <div class="location-btn">
        <button class="">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="mdi:location">
              <path
                id="Vector"
                d="M8.00016 7.66668C7.55814 7.66668 7.13421 7.49108 6.82165 7.17852C6.50909 6.86596 6.3335 6.44204 6.3335 6.00001C6.3335 5.55798 6.50909 5.13406 6.82165 4.8215C7.13421 4.50894 7.55814 4.33334 8.00016 4.33334C8.44219 4.33334 8.86611 4.50894 9.17867 4.8215C9.49123 5.13406 9.66683 5.55798 9.66683 6.00001C9.66683 6.21888 9.62372 6.43561 9.53996 6.63782C9.4562 6.84002 9.33344 7.02376 9.17867 7.17852C9.02391 7.33329 8.84018 7.45605 8.63797 7.53981C8.43576 7.62357 8.21903 7.66668 8.00016 7.66668ZM8.00016 1.33334C6.76249 1.33334 5.5755 1.82501 4.70033 2.70018C3.82516 3.57535 3.3335 4.76233 3.3335 6.00001C3.3335 9.50001 8.00016 14.6667 8.00016 14.6667C8.00016 14.6667 12.6668 9.50001 12.6668 6.00001C12.6668 4.76233 12.1752 3.57535 11.3 2.70018C10.4248 1.82501 9.23784 1.33334 8.00016 1.33334Z"
                fill="#FCF9EA"
              />
            </g>
          </svg>
          <span> Москва </span>
        </button>
      </div>
    </div>
    <template v-if="!userEvent">
      <div class="events-page__events">
        <div class="events-page__title">
          <h1 class="">Бронирование ужина</h1>
        </div>
        <div v-if="events.length > 0">
          <div class="event-items">
            <BaseRadio
              v-for="event in events"
              :key="event.id"
              :label="isoToDate(event.date)"
              :value="event.id"
              :model-value="selectedEvent"
              @update:modelValue="selectedEvent = $event"
            ></BaseRadio>
          </div>
          <div class="events-page__footer">
            <button :disabled="!selectedEvent" @click="showBottomSheet" class="btn btn-primary">
              <span>Забронировать</span>
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="user-event">
        <div class="user-event__info">
          <div class="user-event__title">
            <p v-if="eventStatus">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <rect width="20" height="20" rx="10" fill="#E75010" />
                <path
                  d="M5 10.3333L8.33333 13.6667L15 7"
                  stroke="#FCF9EA"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span> Ваше место подтверждено </span>
            </p>
            <p v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <rect width="20" height="20" rx="10" fill="#E75010" />
                <path
                  d="M5 10.3333L8.33333 13.6667L15 7"
                  stroke="#FCF9EA"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span> Ваш бронирование ждет оплаты </span>
            </p>
          </div>
          <div class="user-event__items">
            <div class="user-event__item">
              <span class="label">Дата</span>
              <span class="info"> {{ isoToDate(userEvent.event_date) }}</span>
            </div>
            <div class="user-event__item">
              <span class="label">Локация</span>
              <span class="info">
                {{
                  userEventStats?.restaurant?.status
                    ? userEventStats?.restaurant?.restaurant_name
                    : 'Будет известна за 24 часа до ужина'
                }}</span
              >
            </div>
          </div>
        </div>
        <div class="user-event__controls">
          <button class="btn btn-primary" @click="showControls">Управлять бронью</button>
        </div>
        <div class="user-event__contents">
          <div v-if="userEventStats.restaurant" class="user-event__content">
            <div class="user-event__content-info">
              <template v-if="userEventStats.restaurant?.status">
                <div>
                  <p class="user-event__content-title" style="margin-bottom: 4px">
                    <span class="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M3.5 11V6.425C3.075 6.30833 2.71883 6.075 2.4315 5.725C2.14417 5.375 2.00033 4.96667 2 4.5V1H3V4.5H3.5V1H4.5V4.5H5V1H6V4.5C6 4.96667 5.85633 5.375 5.569 5.725C5.28167 6.075 4.92533 6.30833 4.5 6.425V11H3.5ZM8.5 11V7H7V3.5C7 2.80833 7.24383 2.21883 7.7315 1.7315C8.21917 1.24417 8.80867 1.00033 9.5 1V11H8.5Z"
                          fill="#FCF9EA"
                        />
                      </svg>
                    </span>
                    <span> Твой ресторан </span>
                  </p>
                  <p class="user-event__content-title">
                    <span> «{{ userEventStats?.restaurant.restaurant_name }}» </span>
                  </p>
                </div>
                <p class="label">«{{ userEventStats?.restaurant.table_name }}»</p>
                <a
                  :href="userEventStats?.restaurant.restaurant_map_url"
                  target="_blank"
                  class="btn btn-outline-primary"
                >
                  Перейти в Яндекс Карты
                </a>
              </template>
              <template v-else>
                <p class="user-event__content-title">
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M3.5 11V6.425C3.075 6.30833 2.71883 6.075 2.4315 5.725C2.14417 5.375 2.00033 4.96667 2 4.5V1H3V4.5H3.5V1H4.5V4.5H5V1H6V4.5C6 4.96667 5.85633 5.375 5.569 5.725C5.28167 6.075 4.92533 6.30833 4.5 6.425V11H3.5ZM8.5 11V7H7V3.5C7 2.80833 7.24383 2.21883 7.7315 1.7315C8.21917 1.24417 8.80867 1.00033 9.5 1V11H8.5Z"
                        fill="#FCF9EA"
                      />
                    </svg>
                  </span>
                  <span> Твой ресторан </span>
                </p>
                <div>
                  <p class="label" style="margin-bottom: 4px">Место твоего ужина будет известно:</p>
                  <p class="info">
                    {{ userEventStats.restaurant?.date_modif }}
                  </p>
                </div>
              </template>
            </div>
          </div>
          <div v-if="userEventStats.group" class="user-event__content">
            <div class="user-event__content-info">
              <template v-if="userEventStats?.group.status">
                <p class="user-event__content-title" style="margin-bottom: 4px">
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M0.5 10V8.60001C0.5 8.31668 0.573 8.05635 0.719 7.81901C0.865 7.58168 1.05867 7.40035 1.3 7.27501C1.81667 7.01668 2.34167 6.82301 2.875 6.69401C3.40833 6.56501 3.95 6.50035 4.5 6.50001C5.05 6.49968 5.59167 6.56435 6.125 6.69401C6.65833 6.82368 7.18333 7.01735 7.7 7.27501C7.94167 7.40001 8.1355 7.58135 8.2815 7.81901C8.4275 8.05668 8.50033 8.31701 8.5 8.60001V10H0.5ZM9.5 10V8.50001C9.5 8.13335 9.398 7.78118 9.194 7.44351C8.99 7.10585 8.70033 6.81635 8.325 6.57501C8.75 6.62501 9.15 6.71051 9.525 6.83151C9.9 6.95251 10.25 7.10035 10.575 7.27501C10.875 7.44168 11.1042 7.62701 11.2625 7.83101C11.4208 8.03501 11.5 8.25801 11.5 8.50001V10H9.5ZM4.5 6.00001C3.95 6.00001 3.47917 5.80418 3.0875 5.41251C2.69583 5.02085 2.5 4.55001 2.5 4.00001C2.5 3.45001 2.69583 2.97918 3.0875 2.58751C3.47917 2.19585 3.95 2.00001 4.5 2.00001C5.05 2.00001 5.52083 2.19585 5.9125 2.58751C6.30417 2.97918 6.5 3.45001 6.5 4.00001C6.5 4.55001 6.30417 5.02085 5.9125 5.41251C5.52083 5.80418 5.05 6.00001 4.5 6.00001ZM9.5 4.00001C9.5 4.55001 9.30417 5.02085 8.9125 5.41251C8.52083 5.80418 8.05 6.00001 7.5 6.00001C7.40833 6.00001 7.29167 5.98968 7.15 5.96901C7.00833 5.94835 6.89167 5.92535 6.8 5.90001C7.025 5.63335 7.198 5.33751 7.319 5.01251C7.44 4.68751 7.50033 4.35001 7.5 4.00001C7.49967 3.65001 7.43933 3.31251 7.319 2.98751C7.19867 2.66251 7.02567 2.36668 6.8 2.10001C6.91667 2.05835 7.03333 2.03118 7.15 2.01851C7.26667 2.00585 7.38333 1.99968 7.5 2.00001C8.05 2.00001 8.52083 2.19585 8.9125 2.58751C9.30417 2.97918 9.5 3.45001 9.5 4.00001Z"
                        fill="#FCF9EA"
                      />
                    </svg>
                  </span>
                  <span>Твоя группа</span>
                </p>
                <div class="event-group__items">
                  <div
                    v-for="item in userEventStats?.group.photo_users"
                    :key="item.username"
                    class="event-group__item"
                    @click="showGroupItem(item)"
                  >
                    <img :src="'https://miniapp.forkies.ru/' + item.photo || notProfile" alt="" />
                  </div>
                </div>
              </template>
              <template v-else>
                <p class="user-event__content-title">
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M0.5 10V8.60001C0.5 8.31668 0.573 8.05635 0.719 7.81901C0.865 7.58168 1.05867 7.40035 1.3 7.27501C1.81667 7.01668 2.34167 6.82301 2.875 6.69401C3.40833 6.56501 3.95 6.50035 4.5 6.50001C5.05 6.49968 5.59167 6.56435 6.125 6.69401C6.65833 6.82368 7.18333 7.01735 7.7 7.27501C7.94167 7.40001 8.1355 7.58135 8.2815 7.81901C8.4275 8.05668 8.50033 8.31701 8.5 8.60001V10H0.5ZM9.5 10V8.50001C9.5 8.13335 9.398 7.78118 9.194 7.44351C8.99 7.10585 8.70033 6.81635 8.325 6.57501C8.75 6.62501 9.15 6.71051 9.525 6.83151C9.9 6.95251 10.25 7.10035 10.575 7.27501C10.875 7.44168 11.1042 7.62701 11.2625 7.83101C11.4208 8.03501 11.5 8.25801 11.5 8.50001V10H9.5ZM4.5 6.00001C3.95 6.00001 3.47917 5.80418 3.0875 5.41251C2.69583 5.02085 2.5 4.55001 2.5 4.00001C2.5 3.45001 2.69583 2.97918 3.0875 2.58751C3.47917 2.19585 3.95 2.00001 4.5 2.00001C5.05 2.00001 5.52083 2.19585 5.9125 2.58751C6.30417 2.97918 6.5 3.45001 6.5 4.00001C6.5 4.55001 6.30417 5.02085 5.9125 5.41251C5.52083 5.80418 5.05 6.00001 4.5 6.00001ZM9.5 4.00001C9.5 4.55001 9.30417 5.02085 8.9125 5.41251C8.52083 5.80418 8.05 6.00001 7.5 6.00001C7.40833 6.00001 7.29167 5.98968 7.15 5.96901C7.00833 5.94835 6.89167 5.92535 6.8 5.90001C7.025 5.63335 7.198 5.33751 7.319 5.01251C7.44 4.68751 7.50033 4.35001 7.5 4.00001C7.49967 3.65001 7.43933 3.31251 7.319 2.98751C7.19867 2.66251 7.02567 2.36668 6.8 2.10001C6.91667 2.05835 7.03333 2.03118 7.15 2.01851C7.26667 2.00585 7.38333 1.99968 7.5 2.00001C8.05 2.00001 8.52083 2.19585 8.9125 2.58751C9.30417 2.97918 9.5 3.45001 9.5 4.00001Z"
                        fill="#FCF9EA"
                      />
                    </svg>
                  </span>
                  <span>Твоя группа</span>
                </p>
                <div>
                  <p class="label" style="margin-bottom: 4px">Узнай больше о своей группе:</p>
                  <p class="info">
                    {{ userEventStats?.group.date_modif }}
                  </p>
                </div>
              </template>
            </div>
          </div>
          <div v-if="userEventStats.game" class="user-event__content">
            <div class="user-event__content-info">
              <template v-if="userEventStats?.game.status">
                <p class="user-event__content-title" style="margin-bottom: 4px">
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M9.1665 1C10.1465 1 10.9465 1.7685 10.9975 2.736L11 2.8335V9.1665C11 10.1465 10.2315 10.9465 9.264 10.9975L9.1665 11H2.8335C2.36409 11 1.91255 10.82 1.5719 10.497C1.23126 10.1741 1.02746 9.73275 1.0025 9.264L1 9.1665V2.8335C1 1.8535 1.7685 1.0535 2.736 1.0025L2.8335 1H9.1665ZM7.75 7C7.55109 7 7.36032 7.07902 7.21967 7.21967C7.07902 7.36032 7 7.55109 7 7.75C7 7.94891 7.07902 8.13968 7.21967 8.28033C7.36032 8.42098 7.55109 8.5 7.75 8.5C7.94891 8.5 8.13968 8.42098 8.28033 8.28033C8.42098 8.13968 8.5 7.94891 8.5 7.75C8.5 7.55109 8.42098 7.36032 8.28033 7.21967C8.13968 7.07902 7.94891 7 7.75 7ZM4.25 7C4.05109 7 3.86032 7.07902 3.71967 7.21967C3.57902 7.36032 3.5 7.55109 3.5 7.75C3.5 7.94891 3.57902 8.13968 3.71967 8.28033C3.86032 8.42098 4.05109 8.5 4.25 8.5C4.44891 8.5 4.63968 8.42098 4.78033 8.28033C4.92098 8.13968 5 7.94891 5 7.75C5 7.55109 4.92098 7.36032 4.78033 7.21967C4.63968 7.07902 4.44891 7 4.25 7ZM4.25 3.5C4.05109 3.5 3.86032 3.57902 3.71967 3.71967C3.57902 3.86032 3.5 4.05109 3.5 4.25C3.5 4.44891 3.57902 4.63968 3.71967 4.78033C3.86032 4.92098 4.05109 5 4.25 5C4.44891 5 4.63968 4.92098 4.78033 4.78033C4.92098 4.63968 5 4.44891 5 4.25C5 4.05109 4.92098 3.86032 4.78033 3.71967C4.63968 3.57902 4.44891 3.5 4.25 3.5ZM7.75 3.5C7.55109 3.5 7.36032 3.57902 7.21967 3.71967C7.07902 3.86032 7 4.05109 7 4.25C7 4.44891 7.07902 4.63968 7.21967 4.78033C7.36032 4.92098 7.55109 5 7.75 5C7.94891 5 8.13968 4.92098 8.28033 4.78033C8.42098 4.63968 8.5 4.44891 8.5 4.25C8.5 4.05109 8.42098 3.86032 8.28033 3.71967C8.13968 3.57902 7.94891 3.5 7.75 3.5Z"
                        fill="#FCF9EA"
                      />
                    </svg>
                  </span>
                  <span>Игра разблокирована</span>
                </p>
                <button @click="showGameModal" class="btn btn-outline-primary">Начать игру</button>
              </template>
              <template v-else>
                <p class="user-event__content-title">
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M9.1665 1C10.1465 1 10.9465 1.7685 10.9975 2.736L11 2.8335V9.1665C11 10.1465 10.2315 10.9465 9.264 10.9975L9.1665 11H2.8335C2.36409 11 1.91255 10.82 1.5719 10.497C1.23126 10.1741 1.02746 9.73275 1.0025 9.264L1 9.1665V2.8335C1 1.8535 1.7685 1.0535 2.736 1.0025L2.8335 1H9.1665ZM7.75 7C7.55109 7 7.36032 7.07902 7.21967 7.21967C7.07902 7.36032 7 7.55109 7 7.75C7 7.94891 7.07902 8.13968 7.21967 8.28033C7.36032 8.42098 7.55109 8.5 7.75 8.5C7.94891 8.5 8.13968 8.42098 8.28033 8.28033C8.42098 8.13968 8.5 7.94891 8.5 7.75C8.5 7.55109 8.42098 7.36032 8.28033 7.21967C8.13968 7.07902 7.94891 7 7.75 7ZM4.25 7C4.05109 7 3.86032 7.07902 3.71967 7.21967C3.57902 7.36032 3.5 7.55109 3.5 7.75C3.5 7.94891 3.57902 8.13968 3.71967 8.28033C3.86032 8.42098 4.05109 8.5 4.25 8.5C4.44891 8.5 4.63968 8.42098 4.78033 8.28033C4.92098 8.13968 5 7.94891 5 7.75C5 7.55109 4.92098 7.36032 4.78033 7.21967C4.63968 7.07902 4.44891 7 4.25 7ZM4.25 3.5C4.05109 3.5 3.86032 3.57902 3.71967 3.71967C3.57902 3.86032 3.5 4.05109 3.5 4.25C3.5 4.44891 3.57902 4.63968 3.71967 4.78033C3.86032 4.92098 4.05109 5 4.25 5C4.44891 5 4.63968 4.92098 4.78033 4.78033C4.92098 4.63968 5 4.44891 5 4.25C5 4.05109 4.92098 3.86032 4.78033 3.71967C4.63968 3.57902 4.44891 3.5 4.25 3.5ZM7.75 3.5C7.55109 3.5 7.36032 3.57902 7.21967 3.71967C7.07902 3.86032 7 4.05109 7 4.25C7 4.44891 7.07902 4.63968 7.21967 4.78033C7.36032 4.92098 7.55109 5 7.75 5C7.94891 5 8.13968 4.92098 8.28033 4.78033C8.42098 4.63968 8.5 4.44891 8.5 4.25C8.5 4.05109 8.42098 3.86032 8.28033 3.71967C8.13968 3.57902 7.94891 3.5 7.75 3.5Z"
                        fill="#FCF9EA"
                      />
                    </svg>
                  </span>
                  <span>Игра</span>
                </p>
                <div>
                  <p class="label" style="margin-bottom: 4px">Разблокируй игру во время ужина</p>
                  <p class="info">
                    {{ userEventStats?.game.date_modif }}
                  </p>
                </div>
              </template>
            </div>
          </div>
          <div v-if="userEventStats.bar" class="user-event__content">
            <div class="user-event__content-info">
              <template v-if="userEventStats?.bar.status">
                <div>
                  <p class="user-event__content-title" style="margin-bottom: 4px">
                    <span class="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <g clip-path="url(#clip0_92_2479)">
                          <path
                            d="M6.00041 0.800049C4.40041 0.800049 0.400409 1.00005 0.800409 1.40005L5.60041 6.40005V9.60005C5.60041 10.4 3.20041 10 3.20041 11.2H8.80041C8.80041 10 6.40041 10.4 6.40041 9.60005V6.40005L11.2004 1.40005C11.6004 1.00005 7.60041 0.800049 6.00041 0.800049ZM6.00041 1.60005C8.00041 1.60005 9.80041 1.80005 9.80041 1.80005L9.20041 2.40005H2.80041L2.20041 1.80005C2.20041 1.80005 4.00041 1.60005 6.00041 1.60005Z"
                            fill="#FCF9EA"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_92_2479">
                            <rect width="12" height="12" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    <span>Твой бар</span>
                  </p>
                  <p class="user-event__content-title">
                    <span> «{{ userEventStats?.bar.bar_name }}» </span>
                  </p>
                </div>
                <a
                  :href="userEventStats?.bar.bar_map_url"
                  target="_blank"
                  class="btn btn-outline-primary"
                >
                  Перейти в Яндекс Карты
                </a>
              </template>
              <template v-else>
                <p class="user-event__content-title">
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_92_2479)">
                        <path
                          d="M6.00041 0.800049C4.40041 0.800049 0.400409 1.00005 0.800409 1.40005L5.60041 6.40005V9.60005C5.60041 10.4 3.20041 10 3.20041 11.2H8.80041C8.80041 10 6.40041 10.4 6.40041 9.60005V6.40005L11.2004 1.40005C11.6004 1.00005 7.60041 0.800049 6.00041 0.800049ZM6.00041 1.60005C8.00041 1.60005 9.80041 1.80005 9.80041 1.80005L9.20041 2.40005H2.80041L2.20041 1.80005C2.20041 1.80005 4.00041 1.60005 6.00041 1.60005Z"
                          fill="#FCF9EA"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_92_2479">
                          <rect width="12" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span>Твой бар</span>
                </p>
                <div>
                  <p class="label" style="margin-bottom: 4px">Название бара будет известно:</p>
                  <p class="info">
                    {{ userEventStats?.bar.date_modif }}
                  </p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>

    <BaseBottomSheet :model-value="showPaymentForm" title="" @update:model-value="closePaymentForm">
      <div class="payment-form">
        <!--        <div class="payment-form__header">-->
        <!--          <button-->
        <!--            :class="paymentType === 'subscription' ? 'btn-dark' : 'btn-outline-rounded'"-->
        <!--            class="btn"-->
        <!--            @click="paymentType = 'subscription'"-->
        <!--          >-->
        <!--            Подписка-->
        <!--          </button>-->
        <!--          <button-->
        <!--            :class="paymentType === 'one' ? 'btn-dark' : 'btn-outline-rounded'"-->
        <!--            class="btn"-->
        <!--            @click="paymentType = 'one'"-->
        <!--          >-->
        <!--            1 встреча-->
        <!--          </button>-->
        <!--        </div>-->
        <div v-if="event" class="payment-form__content">
          <div class="payment-form__inputs">
            <div class="payment-form__input">
              <div class="label">Дата</div>
              <div class="input-text">
                {{ isoToDate(event.date, 'short') }}
              </div>
            </div>
            <div class="payment-form__input">
              <div class="label">Локация</div>
              <div class="input-text">
                {{ selectedEventLocation }}
              </div>
            </div>
            <div class="payment-form__input">
              <div class="label">Промокод</div>
              <div class="input">
                <BaseInput placeholder="Введи промокод" v-model="promocode" />
                <button class="btn btn-primary" @click="checkPromocode">Применить</button>
              </div>
              <div v-if="promocodeMessage" class="promocode-message">
                {{ promocodeMessage }}
              </div>
            </div>
          </div>
          <div class="payment-form__total">
            <div class="input-text">Итого</div>
            <div class="input-text">
              <span v-if="_promocodeValue.code">{{ prices.price }} ₽</span
              >{{ _promocodeValue.code ? prices.promocodePrice : prices.price }} ₽
            </div>
          </div>
          <div class="payment-form__offerta">
            <div class="offerta-description">
              <span>
                Возврат средств возможен только в том случае, если вы отмените бронирование до
                полуночи понедельника, предшествующего дню ужина.
              </span>
              <span>
                Нажимая на кнопку, вы даете согласие
                <a href=""> на обработку персональных данных </a> и соглашаетесь с
                <a href=""> политикой конфиденциальности </a>
              </span>
            </div>
          </div>

          <div class="payment-form__footer">
            <div class="payment-form__checkbox">
              <BaseCheckbox
                class="checkbox"
                :model-value="offertaChecked"
                :value="offertaCheckedDef"
                @update:model-value="checkOfferta"
              />
              <span> Я принимаю  <a href="https://forkies.ru/offer">условия оферты</a> </span>
            </div>
            <button class="btn btn-primary" :disabled="!offertaChecked" @click="confirmPayment">
              {{ paymentType === 'subscription' ? 'Оплатить' : 'Оплатить 1 встречу' }}
            </button>
          </div>
        </div>
      </div>
    </BaseBottomSheet>

    <BaseBottomSheet :model-value="showCardForm" title="" @update:model-value="closeCardForm">
      <div class="card-form">
        <div class="card-form__scanner">
          <span> Сканировать карту </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 17.5C13.25 17.5 14.3127 17.0627 15.188 16.188C16.0633 15.3133 16.5007 14.2507 16.5 13C16.4993 11.7493 16.062 10.687 15.188 9.813C14.314 8.939 13.2513 8.50133 12 8.5C10.7487 8.49867 9.68633 8.93633 8.813 9.813C7.93967 10.6897 7.502 11.752 7.5 13C7.498 14.248 7.93567 15.3107 8.813 16.188C9.69033 17.0653 10.7527 17.5027 12 17.5ZM12 15.5C11.3 15.5 10.7083 15.2583 10.225 14.775C9.74167 14.2917 9.5 13.7 9.5 13C9.5 12.3 9.74167 11.7083 10.225 11.225C10.7083 10.7417 11.3 10.5 12 10.5C12.7 10.5 13.2917 10.7417 13.775 11.225C14.2583 11.7083 14.5 12.3 14.5 13C14.5 13.7 14.2583 14.2917 13.775 14.775C13.2917 15.2583 12.7 15.5 12 15.5ZM4 21C3.45 21 2.97933 20.8043 2.588 20.413C2.19667 20.0217 2.00067 19.5507 2 19V7C2 6.45 2.196 5.97933 2.588 5.588C2.98 5.19667 3.45067 5.00067 4 5H7.15L9 3H15L16.85 5H20C20.55 5 21.021 5.196 21.413 5.588C21.805 5.98 22.0007 6.45067 22 7V19C22 19.55 21.8043 20.021 21.413 20.413C21.0217 20.805 20.5507 21.0007 20 21H4Z"
              fill="#291E1E"
            />
          </svg>
        </div>

        <div class="card-form__inputs">
          <label>
            <span> Данные платежной карты </span>
            <BaseInput v-model="card.pan" />
          </label>
          <label>
            <span> Срок действия карты </span>
            <BaseInput v-model="card.date" />
          </label>
          <label>
            <span>CVV</span>
            <BaseInput v-model="card.cvv" />
          </label>
        </div>

        <button class="btn btn-primary" :disabled="!validateCard" @click="pay">
          Оплатить {{ paymentAmount }} ₽
        </button>
      </div>
    </BaseBottomSheet>

    <BaseBottomSheet title="" v-model="showEventControls">
      <div class="user-event__controls-btn">
        <button @click="showChangeDate" class="btn btn-primary">Перенести ужин</button>
      </div>
      <div class="user-event__controls-btn">
        <button @click="cancelEvent" class="btn btn-outline-primary">Отменить ужин</button>
      </div>
    </BaseBottomSheet>
    <BaseBottomSheet title="" v-model="showGameBottomSheet">
      <div v-for="game in eventGames" :key="game.id" class="user-event__controls-btn">
        <button @click="openGameDrawer(game)" class="btn btn-outline-primary">
          {{ game.title }}
        </button>
      </div>
    </BaseBottomSheet>
    <BaseBottomSheet
      title=""
      :model-value="showEventChangeDate"
      @update:model-value="closeDateModal"
    >
      <div class="user-event__cancel-reasons">
        <div class="controls-modal">
          <div class="controls-modal__header">
            <p class="modal-title">Выбери новую дату</p>
            <p class="modal-description">Мы перенесем бронирование без доплат</p>
          </div>
        </div>
        <div class="user-event__cancel-reason">
          <BaseRadio
            v-for="event in events"
            :key="event.id"
            v-model="selectedDate"
            :label="isoToDate(event.date)"
            :value="event.id"
          />
        </div>
      </div>
      <template #footer>
        <button
          :disabled="selectedDate === userEvent?.event_id"
          class="btn btn-primary"
          @click="submitChangeDate"
        >
          Продолжить
        </button>
      </template>
    </BaseBottomSheet>
    <BaseBottomSheet
      title=""
      class=""
      :model-value="showEventCancel"
      @update:model-value="closeReasonsModal"
    >
      <div class="controls-modal">
        <div class="controls-modal__header">
          <p class="modal-title">Отмена брони</p>
          <p class="modal-description">Пожалуйста, укажи причину отмены</p>
        </div>
      </div>

      <div class="user-event__cancel-reasons">
        <div class="user-event__cancel-reason">
          <BaseRadio
            v-for="reason in cancelReasons"
            :key="reason.id"
            :label="reason.name"
            :value="reason.id"
            v-model="selectedReason"
          />
        </div>
      </div>
      <template #footer>
        <button :disabled="!selectedReason" class="btn btn-primary" @click="submitCancelation">
          Продолжить
        </button>
      </template>
    </BaseBottomSheet>

    <BaseBottomSheet
      title=""
      :model-value="showSuccessModal"
      @update:model-value="closeSuccessModal"
    >
      <div class="success-modal controls-modal">
        <div class="controls-modal__header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="61"
            height="60"
            viewBox="0 0 61 60"
            fill="none"
          >
            <path
              d="M10 30.5L23.6667 44L51 17"
              stroke="#E75010"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p class="modal-title">
            {{ submitEventTitle }}
          </p>
          <p class="modal-description">
            {{ submitEventDesc }}
          </p>
        </div>
      </div>
    </BaseBottomSheet>
    <BaseBottomSheet
      title=""
      :model-value="showConfirmModal"
      @update:model-value="closeConfirmModal"
    >
      <div class="success-modal controls-modal">
        <div class="controls-modal__header">
          <p class="modal-title">Точно хочешь отменить бронь?</p>
          <p class="modal-description">
            Нам точно будет тебя не хватать — каждый участник создаёт атмосферу вечера. Но если
            не получается сейчас, ждём тебя в другой раз!
          </p>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-primary" @click="showCancelResions">Отменить бронь</button>
      </template>
    </BaseBottomSheet>
    <BaseBottomSheet title="" :model-value="showInfoModal" @update:model-value="closeInfoModal">
      <div class="controls-modal">
        <div class="controls-modal__header">
          <p class="modal-title">до ужина меньше 24 часов</p>
          <p class="modal-description">
            Возврат или перенос уже невозможны. Но если ты не сможешь прийти, пожалуйста, сообщи
            нам. Мы предупредим твою группу, а тебе подарим скидку 30% на следующую встречу
          </p>
        </div>
      </div>
      <template #footer>
        <div class="controls-modal__footer">
          <button class="btn btn-primary" @click="submitEmergencyReason(true)">Я не приду</button>
          <button class="btn btn-outline-primary" @click="submitEmergencyReason(false)">
            Я смогу прийти
          </button>
        </div>
      </template>
    </BaseBottomSheet>
    <BaseBottomSheet
      title=""
      :model-value="showDiscountModal"
      @update:model-value="showDiscountModal = false"
    >
      <div class="controls-modal">
        <div class="controls-modal__header">
          <p class="modal-title">Еще увидимся!</p>
          <p class="modal-description">
            Спасибо, мы предупредим твою группу — это правда важно.
            <b>А вот и твой промокод на скидку 30% для следующей встречи:</b> 
          </p>
          <p class="modal-title">
            {{ emergancyPromo }}
          </p>
          <p class="modal-description">До встречи за столом!</p>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-primary" @click="closeDiscountModal">Окей</button>
      </template>
    </BaseBottomSheet>
    <teleport to="body">
      <BaseDrawer class="event-game-drawer" v-model="showGameDrawer" :show-footer="false">
        <template #navbar>
          <div class="event-game__navbar">
            <button @click="showGameDrawer = false">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                  fill="#FCF9EA"
                />
                <path
                  d="M16.7364 7.2636C17.0879 7.61508 17.0879 8.18492 16.7364 8.5364L13.273 12L16.7364 15.4636C17.0586 15.7858 17.0854 16.2915 16.817 16.6442L16.7364 16.7364C16.3849 17.0879 15.8151 17.0879 15.4636 16.7364L12 13.273L8.5364 16.7364C8.18492 17.0879 7.61508 17.0879 7.2636 16.7364C6.91213 16.3849 6.91213 15.8151 7.2636 15.4636L10.727 12L7.2636 8.5364C6.94142 8.21421 6.91457 7.70853 7.18306 7.35577L7.2636 7.2636C7.61508 6.91213 8.18492 6.91213 8.5364 7.2636L12 10.727L15.4636 7.2636C15.8151 6.91213 16.3849 6.91213 16.7364 7.2636Z"
                  fill="#E75010"
                />
              </svg>
            </button>
          </div>
        </template>
        <div class="event-game">
          <swiper
            :modules="swiperModules"
            :navigation="true"
            :pagination="{
              type: 'fraction',
            }"
            :slides-per-view="1"
            :space-between="50"
          >
            <swiper-slide v-for="item in selectedGameItem?.items" :key="item.question">
              <div class="event-game__item">
                <p>
                  {{ item.question }}
                </p>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </BaseDrawer>
    </teleport>

    <BaseBottomSheet
      title=""
      :model-value="showGroupItemModal"
      @update:model-value="closeGroupItemModal"
    >
      <div class="controls-modal">
        <div class="controls-modal__header">
          <div class="user-avatar">
            <img
              :src="
                selectedGroupItem?.photo
                  ? 'https://miniapp.forkies.ru/' + selectedGroupItem?.photo
                  : notProfile
              "
              alt=""
            />
          </div>
          <p class="modal-title">
            {{ selectedGroupItem?.name }}
          </p>
          <!--          <p class="modal-description1">Журналист</p>-->
          <div class="user-about-self">
            <p class="modal-description">
              {{ selectedGroupItem?.about }}
            </p>
          </div>
        </div>
        <div class="user-socials">
          <a
            v-if="selectedGroupItem?.instagramm"
            :href="`https://instagram.com/${selectedGroupItem.instagramm}`"
            target="_blank"
            class="btn btn-outline-rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_21_3882)">
                <path
                  d="M11.0286 0C12.1536 0.003 12.7246 0.009 13.2176 0.023L13.4116 0.03C13.6356 0.038 13.8566 0.0479999 14.1236 0.0599999C15.1876 0.11 15.9136 0.278 16.5506 0.525C17.2106 0.779 17.7666 1.123 18.3226 1.678C18.8313 2.17773 19.2248 2.78247 19.4756 3.45C19.7226 4.087 19.8906 4.813 19.9406 5.878C19.9526 6.144 19.9626 6.365 19.9706 6.59L19.9766 6.784C19.9916 7.276 19.9976 7.847 19.9996 8.972L20.0006 9.718V11.028C20.003 11.7574 19.9953 12.4868 19.9776 13.216L19.9716 13.41C19.9636 13.635 19.9536 13.856 19.9416 14.122C19.8916 15.187 19.7216 15.912 19.4756 16.55C19.2248 17.2175 18.8313 17.8223 18.3226 18.322C17.8228 18.8307 17.2181 19.2242 16.5506 19.475C15.9136 19.722 15.1876 19.89 14.1236 19.94L13.4116 19.97L13.2176 19.976C12.7246 19.99 12.1536 19.997 11.0286 19.999L10.2826 20H8.97357C8.24383 20.0026 7.51409 19.9949 6.78457 19.977L6.59057 19.971C6.35318 19.962 6.11584 19.9517 5.87857 19.94C4.81457 19.89 4.08857 19.722 3.45057 19.475C2.7834 19.2241 2.17901 18.8306 1.67957 18.322C1.17051 17.8224 0.776678 17.2176 0.525569 16.55C0.278569 15.913 0.110569 15.187 0.0605687 14.122L0.0305688 13.41L0.0255689 13.216C0.00713493 12.4868 -0.00119929 11.7574 0.000568797 11.028V8.972C-0.0021991 8.2426 0.00513501 7.5132 0.0225689 6.784L0.0295688 6.59C0.0375688 6.365 0.0475688 6.144 0.0595688 5.878C0.109569 4.813 0.277569 4.088 0.524569 3.45C0.776263 2.7822 1.17079 2.17744 1.68057 1.678C2.17972 1.16955 2.78376 0.776074 3.45057 0.525C4.08857 0.278 4.81357 0.11 5.87857 0.0599999C6.14457 0.0479999 6.36657 0.038 6.59057 0.03L6.78457 0.0239999C7.51376 0.00623271 8.24316 -0.0014347 8.97257 0.000999928L11.0286 0ZM10.0006 5C8.67449 5 7.40272 5.52678 6.46503 6.46447C5.52735 7.40215 5.00057 8.67392 5.00057 10C5.00057 11.3261 5.52735 12.5979 6.46503 13.5355C7.40272 14.4732 8.67449 15 10.0006 15C11.3267 15 12.5984 14.4732 13.5361 13.5355C14.4738 12.5979 15.0006 11.3261 15.0006 10C15.0006 8.67392 14.4738 7.40215 13.5361 6.46447C12.5984 5.52678 11.3267 5 10.0006 5ZM10.0006 7C10.3945 6.99993 10.7847 7.07747 11.1487 7.22817C11.5127 7.37887 11.8434 7.5998 12.122 7.87833C12.4007 8.15686 12.6217 8.48754 12.7725 8.85149C12.9233 9.21544 13.001 9.60553 13.0011 9.9995C13.0011 10.3935 12.9236 10.7836 12.7729 11.1476C12.6222 11.5116 12.4013 11.8423 12.1227 12.121C11.8442 12.3996 11.5135 12.6206 11.1496 12.7714C10.7856 12.9223 10.3955 12.9999 10.0016 13C9.20592 13 8.44286 12.6839 7.88025 12.1213C7.31764 11.5587 7.00157 10.7956 7.00157 10C7.00157 9.20435 7.31764 8.44129 7.88025 7.87868C8.44286 7.31607 9.20592 7 10.0016 7M15.2516 3.5C14.92 3.5 14.6021 3.6317 14.3677 3.86612C14.1333 4.10054 14.0016 4.41848 14.0016 4.75C14.0016 5.08152 14.1333 5.39946 14.3677 5.63388C14.6021 5.8683 14.92 6 15.2516 6C15.5831 6 15.901 5.8683 16.1355 5.63388C16.3699 5.39946 16.5016 5.08152 16.5016 4.75C16.5016 4.41848 16.3699 4.10054 16.1355 3.86612C15.901 3.6317 15.5831 3.5 15.2516 3.5Z"
                  fill="#291E1E"
                />
              </g>
              <defs>
                <clipPath id="clip0_21_3882">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {{ selectedGroupItem?.instagramm }}
          </a>
          <a
            v-if="selectedGroupItem?.telegramm"
            :href="`https://t.me/${selectedGroupItem.telegramm}`"
            target="_blank"
            class="btn btn-outline-rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_21_3889)">
                <path
                  d="M19.9362 3.51976L16.9062 17.7048C16.6802 18.7038 16.1002 18.9288 15.2622 18.4778L10.7172 15.1258L8.49216 17.2528C8.26716 17.4788 8.04116 17.7048 7.52516 17.7048L7.88016 13.0298L16.3582 5.32576C16.7122 4.97076 16.2612 4.84176 15.8102 5.13276L5.26916 11.7728L0.723157 10.3868C-0.275843 10.0648 -0.275843 9.38676 0.949157 8.93676L18.6142 2.06976C19.4842 1.81176 20.2262 2.26376 19.9362 3.51976Z"
                  fill="#291E1E"
                />
              </g>
              <defs>
                <clipPath id="clip0_21_3889">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {{ selectedGroupItem?.telegramm }}
          </a>
        </div>
      </div>
    </BaseBottomSheet>

    <Teleport to="body">
      <Transition name="payment-success-frame">
        <PaymentSuccessScreen
          v-if="showSuccessFrame"
          @on:click="showSuccessFrame = false"
        ></PaymentSuccessScreen>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.events-page {
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
  position: relative;
  background: var(--primary-light, #fcf9ea);
  display: flex;
  flex-direction: column;
  height: 100%;

  &.drawer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: 60px;
  }

  .user-event {
    overflow: auto;

    &__info {
      padding: 32px 12px 12px;
    }

    &__controls {
      padding: 12px;
    }

    &__contents {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 24px;
      gap: 12px;
      border-radius: 12px;
      border: 2px solid var(--primary-dark, #291e1e);

      &-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .event-group__items {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
        margin-top: 8px;
        width: 100%;

        .event-group__item {
          width: 54px;
          height: 55px;
          border: 2px solid var(--primary-accent, #e75010);
          border-radius: 100%;
          overflow: hidden;
          background: var(--primary-gray);
          //margin-left: auto;
          //margin-right: auto;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      &-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        gap: 12px;
      }

      .icon {
        display: flex;
        width: 20px;
        height: 20px;
        padding: 4px;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background: var(--primary-accent, #e75010);
      }

      span {
        color: var(--primary-dark, #291e1e);

        /* Text Bold */
        font-family: Manrope;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 137.5% */
        letter-spacing: -0.6px;
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

      .info {
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

    &__title {
      p {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        color: var(--primary-dark);

        /* Text Bold */
        font-family: Manrope;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 137.5% */
        letter-spacing: -0.6px;
      }
    }

    &__item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px 0;
      border-bottom: 1px dashed var(--dark-color);

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

      .info {
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

  &__title {
    padding: 12px 0px;
    margin-bottom: 12px;

    h1 {
      color: var(--primary-dark, #291e1e);
      text-align: center;

      /* H2 */
      font-family: 'Sofia Sans Extra Condensed';
      font-size: 34px;
      font-style: normal;
      font-weight: 800;
      line-height: 34px; /* 100% */
      text-transform: uppercase;
    }
  }

  &__header {
    height: 43.103vh;
    position: relative;
    text-align: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .location-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 16px;
      padding-bottom: 16px;

      button {
        border: none;
        background: transparent;
        color: var(--primary-light, #fcf9ea);
        text-align: center;

        /* Text Bold */
        font-family: Manrope;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 137.5% */
        letter-spacing: -0.6px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  &__footer {
    padding: 32px 12px;
    background: var(--primary-light);
  }

  &__events {
    height: 100%;
    padding: 20px 12px;
    background: var(--primary-light);
    flex-grow: 1;
    overflow: auto;
  }

  .event-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.payment-form {
  &__footer {
    .payment-form__checkbox {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 12px 0;
      width: 100%;
      gap: 12px;

      &:deep .checkbox {
        padding: 0;
        border: none;
        width: auto;

        .base-checkbox__input {
          width: 24px;
          height: 24px;
          border-color: var(--dark-color);

          &.checked {
            border-color: var(--primary-accent);
          }
        }
      }

      span {
        color: var(--primary-dark, #291e1e);
        font-family: Manrope;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 133.333% */
        letter-spacing: -0.4px;

        a {
          color: var(--primary-dark, #291e1e);
          text-decoration: underline;
        }
      }
    }

    .btn {
      margin-top: 12px;
      margin-bottom: 12px;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
    padding: 12px 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__inputs {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 12px 0;
    align-items: flex-start;
    width: 100%;
  }

  &__total {
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: var(--primary-dark, #291e1e);
    text-align: right;

    /* Text Bold */
    font-family: Manrope;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px; /* 137.5% */
    letter-spacing: -0.6px;

    .input-text {
      span {
        color: var(--primary-dark, #291e1e);
        text-align: right;
        opacity: 0.4;

        /* Text Bold */
        font-family: Manrope;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 137.5% */
        letter-spacing: -0.6px;
        text-decoration-line: line-through;
        margin-right: 8px;
      }
    }
  }

  &__input {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 16px;
    border-bottom: 1px dashed var(--dark-color);
    width: 100%;

    .label,
    .promocode-message {
      color: var(--primary-dark, #291e1e);

      /* Caption */
      font-family: Manrope;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px; /* 133.333% */
      letter-spacing: -0.4px;
    }

    .input-text {
      color: var(--primary-dark, #291e1e);

      /* Text Bold */
      font-family: Manrope;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.6px;
    }

    .input {
      display: flex;
      gap: 12px;
      align-items: center;
      width: 100%;

      .btn {
        width: max-content;
      }
    }

    &:last-child {
      .label {
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

  &__offerta {
    margin-top: 56px;

    .offerta-description {
      display: flex;
      flex-direction: column;
      gap: 10px;
      color: var(--primary-dark, #291e1e);

      /* Caption */
      font-family: Manrope;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px; /* 133.333% */
      letter-spacing: -0.4px;

      a {
        text-decoration: underline;
        color: var(--primary-dark, #291e1e);
      }
    }
  }
}

.card-form {
  .btn {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  &__scanner {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    padding: 12px 0;

    span {
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

  &__inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
    padding: 12px 0;

    label:first-child {
      grid-column: 1 / 3;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label span {
      color: var(--primary-dark, #291e1e);
      font-family: Manrope;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px; /* 133.333% */
      letter-spacing: -0.4px;
    }
  }
}

.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.payment-success-frame {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

// Transition animations
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: transform 0.3s ease-out;
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  transform: translateY(100%);
}

.bottom-sheet-enter-active .bottom-sheet-overlay,
.bottom-sheet-leave-active .bottom-sheet-overlay {
  transition: opacity 0.3s ease-out;
}

.bottom-sheet-enter-from .bottom-sheet-overlay,
.bottom-sheet-leave-to .bottom-sheet-overlay {
  opacity: 0;
}

// Transition animations
.payment-success-frame-enter-active,
.payment-success-frame-leave-active {
  transition: transform 0.3s ease-out;
}

.payment-success-frame-enter-from,
.payment-success-frame-leave-to {
  opacity: 1;
  z-index: 20;
}

// Transition animations
.payment-success-frame-enter-active,
.payment-success-frame-leave-active {
  transition: transform 0.3s ease-out;
}

.payment-success-frame-enter-from,
.payment-success-frame-leave-to {
  transform: translateX(100%);
}

.payment-success-frame-enter-active .payment-success-frame-overlay,
.payment-success-frame-leave-active .payment-success-frame-overlay {
  transition: opacity 0.3s ease-out;
}

.payment-success-frame-enter-from .payment-success-frame-overlay,
.payment-success-frame-leave-to .payment-success-frame-overlay {
  opacity: 0;
}
</style>

<style lang="scss">
.event-game-drawer {
  padding: 0 !important;
  --swiper-navigation-top-offset: calc(100% - 20%);

  .event-game {
    background: var(--primary-accent, #fcf9ea);
    width: 100%;
    height: 100%;
  }

  .swiper {
    width: 100%;
    height: 100%;

    .swiper-pagination {
      color: var(--primary-light, #fcf9ea);
      text-align: center;

      /* Text Medium */
      font-family: Manrope;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.6px;
      padding-bottom: 21px;
    }

    .swiper-button-prev:after {
      content: url('/img/arrow_left.svg');
      width: 24px;
      height: 24px;
    }

    .swiper-button-next:after {
      content: url('/img/arrow_right.svg');
      width: 24px;
      height: 24px;
    }
  }

  .base-drawer__content {
    padding: 0;
    height: 100%;
  }

  .base-drawer__navbar {
    position: absolute;
    right: 4px;
  }

  .event-game__navbar {
    display: flex;
    align-items: center;
    padding: 4px;
    justify-content: space-between;
    background: transparent;
    z-index: 101;

    button {
      background: transparent;
      border: none;
      width: 48px;
      height: 44px;
      padding: 10px 12px;

      svg {
        width: 24px;
        height: 24px;
        fill: var(--primary-light, #fcf9ea);
      }
    }
  }

  .event-game__item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    p {
      color: var(--primary-light, #fcf9ea);
      text-align: center;

      /* H3 */
      font-family: Manrope;
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: 28px; /* 116.667% */
      letter-spacing: -0.6px;
    }
  }
}

.user-event__controls-btn {
  padding: 6px 0;

  .btn {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}

.success-modal {
  padding-bottom: 40px !important;
}

.user-event {
  &__cancel-reasons {
  }

  &__cancel-reason {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }
}
</style>
