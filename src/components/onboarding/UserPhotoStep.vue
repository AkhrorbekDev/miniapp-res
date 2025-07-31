<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { createUserService } from '@/services'

const userPhoto = ref('')
const emit = defineEmits(['update:modelValue'])

const imagerUploading = ref(false)
const uploadPhoto = (e) => {
  const file = e.target.files[0]
  const tgWebApp = window.Telegram.WebApp

  if (!file) {
    tgWebApp.showAlert('Файл не выбран')
    return
  }

  const formData = new FormData()
  formData.append('photo', file)
  imagerUploading.value = true

  createUserService()
    .changeAvatar(formData)
    .then((res) => {
      userPhoto.value = res.photo
      emit('update:modelValue', res.photo)
    })
    .catch((err) => {
      tgWebApp.showAlert('Ошибка загрузки фото')
      console.error(err)
    })
    .finally(() => {
      imagerUploading.value = false
    })
}


const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

watch(
  () => props.modelValue,
  (newVal) => {
    userPhoto.value = newVal
  },
)
</script>

<template>
  <div class="user-photo">
    <label for="file-input" class="file-input">
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

      <img v-if="userPhoto" :src="'https://miniapp.forkies.ru/' + userPhoto" alt="" />
      <template v-else>
        <svg
          width="61"
          height="60"
          viewBox="0 0 61 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="material-symbols:photo-camera">
            <path
              id="Vector"
              d="M30.5 43.75C33.625 43.75 36.2817 42.6567 38.47 40.47C40.6583 38.2833 41.7517 35.6267 41.75 32.5C41.7483 29.3733 40.655 26.7175 38.47 24.5325C36.285 22.3475 33.6283 21.2533 30.5 21.25C27.3717 21.2467 24.7158 22.3408 22.5325 24.5325C20.3492 26.7242 19.255 29.38 19.25 32.5C19.245 35.62 20.3392 38.2767 22.5325 40.47C24.7258 42.6633 27.3817 43.7567 30.5 43.75ZM30.5 38.75C28.75 38.75 27.2708 38.1458 26.0625 36.9375C24.8542 35.7292 24.25 34.25 24.25 32.5C24.25 30.75 24.8542 29.2708 26.0625 28.0625C27.2708 26.8542 28.75 26.25 30.5 26.25C32.25 26.25 33.7292 26.8542 34.9375 28.0625C36.1458 29.2708 36.75 30.75 36.75 32.5C36.75 34.25 36.1458 35.7292 34.9375 36.9375C33.7292 38.1458 32.25 38.75 30.5 38.75ZM10.5 52.5C9.125 52.5 7.94833 52.0108 6.97 51.0325C5.99167 50.0542 5.50167 48.8767 5.5 47.5V17.5C5.5 16.125 5.99 14.9483 6.97 13.97C7.95 12.9917 9.12667 12.5017 10.5 12.5H18.375L23 7.5H38L42.625 12.5H50.5C51.875 12.5 53.0525 12.99 54.0325 13.97C55.0125 14.95 55.5017 16.1267 55.5 17.5V47.5C55.5 48.875 55.0108 50.0525 54.0325 51.0325C53.0542 52.0125 51.8767 52.5017 50.5 52.5H10.5Z"
              fill="#291E1E"
            />
          </g>
        </svg>
      </template>

      <input type="file" hidden="hidden" @change="uploadPhoto" id="file-input" />
    </label>

    <label for="file-input" class="btn btn-outline-primary"> Изменить фото </label>
  </div>
</template>

<style scoped lang="scss">
.user-photo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.file-input {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 2px solid var(--dark-color);
  width: 200px;
  height: 200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 12px;
  margin-bottom: 12px;
  overflow: hidden;
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
</style>
