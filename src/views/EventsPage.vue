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

const events = ref([])

const userEvent = ref(null)
const isoToDate = (isoString: string, type: string = 'long') => {
  const date = new Date(isoString)
  if (type === 'short') {
    return date.toLocaleDateString('ru-RU', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
  }
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }
  // Удалим "в" и сделаем первую букву заглавной
  const formatted = new Intl.DateTimeFormat('ru-RU', options).format(date)

  // Удалим "в" и сделаем первую букву заглавной
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
const showDiscountModal = ref(false)
const emergancyPromo = ref('')
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
const getUserEvent = () => {
  return createUserService()
    .getUserEvents()
    .then((res) => {
      if (res[0]?.event_id) {
        userEvent.value = res[0]
        selectedDate.value = userEvent.value.event_id
      } else {
        userEvent.value = null
      }
      return Promise.resolve()
    })
    .catch(() => {
      const tgWebApp = window.Telegram.WebApp
      tgWebApp.showAlert('Ошибка получения ваших событий')
      return Promise.resolve()
    })
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
      .then(() => {
        const language = 'ru-RU'
        const widget = new cp.CloudPayments({ language: language })
        widget.pay(
          'auth', // или 'charge'
          {
            //options
            publicId: 'pk_dbb7431f80a9ac46f07793ef02de8',
            description: 'Оплата ужина Forkies.ru',
            amount: prices.value.promocodePrice ? prices.value.promocodePrice : prices.value.price,
            currency: 'RUB',
            accountId: '6122396208',
            invoiceId: 'daa480c9-cd62-4ee5-8bdf-c2866e7e990e',
            skin: 'mini',
            autoClose: 3,
          },
          {
            onSuccess: function (options) {
              showSuccessFrame.value = true
              showPaymentForm.value = false
              _promocodeValue.value = {
                code: '',
                bonus: 0,
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
  bonus: 0,
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
      _promocodeValue.value = res.data
      const timer = setTimeout(() => {
        promocodeMessage.value = ''
        clearTimeout(timer)
      }, 2000)
    })
    .catch((err) => {
      promocodeMessage.value = err.data.message || 'Произошла ошибка'
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
  const now = new Date();
  const target = new Date(isoDateStr);

  const diffInMs = target - now;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours < 24;
}
const showControls = () => {
  if (!isUnder24Hours(userEvent.value.event_date)) {
    showInfoModal.value = true
    showEventControls.value = false
  } else {
    showEventControls.value = true
  }
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
  return _promocodeValue.value.bonus
    ? _promocodeValue.value.bonus
    : selectedEventData.price
})

const prices = computed(() => {
  const selectedEventData = events.value.find((event) => event.id === selectedEvent.value)
  return {
    price: selectedEventData?.price || 0,
    promocodePrice: _promocodeValue.value.bonus,
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

const cancelReasons = ref([])

const showChangeDate = () => {
  showEventChangeDate.value = true
  showEventControls.value = false
}

const cancelEvent = () => {
  showConfirmModal.value = true
  showEventControls.value = false
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

        getUserEvent()
      })
      .catch((err) => {
        tgWebApp.showAlert('Ошибка отмены бронирования')
      })
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
  <div class="events-page">
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
              <span class="info">{{ userEvent.location }}</span>
            </div>
          </div>
        </div>
        <div class="user-event__controls">
          <button class="btn btn-primary" @click="showControls">
            Управлять бронью
          </button>
        </div>
        <div class="user-event__contents">
          <div class="user-event__content">
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
              <p class="label">Место твоего ужина будет известно:</p>
              <p class="info">
                {{ isoToDate(userEvent.event_date, 'long') }}
              </p>
            </div>
          </div>
          <div class="user-event__content">
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
              <p class="label">Место твоего ужина будет известно:</p>
              <p class="info">
                {{ isoToDate(userEvent.event_date, 'long') }}
              </p>
            </div>
          </div>
          <div class="user-event__content">
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
              <p class="label">Место твоего ужина будет известно:</p>
              <p class="info">
                {{ isoToDate(userEvent.event_date, 'long') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <BaseBottomSheet :model-value="showPaymentForm" title="" @update:model-value="closePaymentForm">
      <div class="payment-form">
        <div class="payment-form__header">
          <button
            :class="paymentType === 'subscription' ? 'btn-dark' : 'btn-outline-rounded'"
            class="btn"
            @click="paymentType = 'subscription'"
          >
            Подписка
          </button>
          <button
            :class="paymentType === 'one' ? 'btn-dark' : 'btn-outline-rounded'"
            class="btn"
            @click="paymentType = 'one'"
          >
            1 встреча
          </button>
        </div>
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
                {{ event.location }}
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
              <span v-if="prices.promocodePrice">{{ prices.price }}</span
              >{{ prices.promocodePrice ? prices.promocodePrice : prices.price }} ₽
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
              {{ paymentType === 'subscription' ? 'Подписаться' : 'Оплатить 1 встречу' }}
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
    <BaseBottomSheet
      title=""
      :model-value="showInfoModal"
      @update:model-value="closeInfoModal"
    >
      <div class="controls-modal">
        <div class="controls-modal__header">
          <p class="modal-title">до ужина меньше 24 часов</p>
          <p class="modal-description">
            Возврат или перенос уже невозможны. Но если ты не сможешь прийти, пожалуйста, сообщи нам. Мы предупредим твою группу, а тебе подарим скидку 30% на следующую встречу
          </p>
        </div>
      </div>
      <template #footer>
        <div class="controls-modal__footer">

          <button class="btn btn-primary" @click="submitEmergencyReason(true)">Я не приду</button>
          <button class="btn btn-outline-primary" @click="submitEmergencyReason(false)">Я смогу прийти</button>
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
            Спасибо, мы предупредим твою группу — это правда важно. <b>А вот и твой промокод на скидку 30% для следующей встречи:</b> 
          </p>
          <p class="modal-title">
            {{ emergancyPromo }}
          </p>
          <p class="modal-description">
            До встречи за столом!
          </p>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-primary" @click="closeDiscountModal">
          Окей
        </button>
      </template>
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
        margin-bottom: 8px;
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
      font-family: 'Sofia Sans';
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
