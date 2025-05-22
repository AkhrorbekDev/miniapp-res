<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Редактирование профиля',
  },
})

const emit = defineEmits(['update:modelValue'])

const closeDrawer = () => {
  emit('update:modelValue', false)
}
</script>

<template>
    <Transition name="page-drawer">
      <div v-if="modelValue" class="base-drawer">
        <div v-if="showHeader" class="base-drawer__navbar">
          <slot name="navbar">
            <button @click="closeDrawer">
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
            <div class="base-drawer__navbar-title">
              <p>
                {{ title }}
              </p>
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
          </slot>
        </div>

        <div class="base-drawer__content">
          <slot />
        </div>

        <div v-if="showFooter" class="base-drawer__footer">
          <button class="btn btn-primary" @click="closeDrawer">Сохранить</button>
        </div>
      </div>
    </Transition>
</template>

<style scoped lang="scss">
.base-drawer {
  position: fixed;
  padding: 0 12px 20px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background-color: var(--primary-light);
  display: flex;
  flex-direction: column;

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
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 0;
  }

  &__footer {
    padding: 12px 0;
    margin-top: auto;
  }
}

// Transition animations
.page-drawer-enter-active,
.page-drawer-leave-active {
  transition: transform 0.3s ease-out;
}

.page-drawer-enter-from,
.page-drawer-leave-to {
  transform: translateX(100%);
}

.page-drawer-enter-active .page-drawer-overlay,
.page-drawer-leave-active .page-drawer-overlay {
  transition: opacity 0.3s ease-out;
}

.page-drawer-enter-from .page-drawer-overlay,
.page-drawer-leave-to .page-drawer-overlay {
  opacity: 0;
}
</style>
