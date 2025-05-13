<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean,
  title: string,
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})

const close = () => {
  isOpen.value = false
  emit('update:modelValue', false)
}

</script>

<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div v-if="isOpen" class="bottom-sheet-overlay" @click="close">
        <div class="bottom-sheet" @click.stop>
          <div class="bottom-sheet-header">
            <slot name="header">
              <div class="header-content">
                <div></div>
                <p v-if="title">
                  {{title}}
                </p>
                <button class="close-btn" @click="close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#E75010"/>
                    <path d="M16.7364 7.2636C17.0879 7.61507 17.0879 8.18492 16.7364 8.53639L13.273 12L16.7364 15.4636C17.0586 15.7858 17.0854 16.2915 16.817 16.6442L16.7364 16.7364C16.3849 17.0879 15.8151 17.0879 15.4636 16.7364L12 13.273L8.5364 16.7364C8.18492 17.0879 7.61508 17.0879 7.2636 16.7364C6.91213 16.3849 6.91213 15.8151 7.2636 15.4636L10.727 12L7.2636 8.53639C6.94142 8.21421 6.91457 7.70853 7.18306 7.35576L7.2636 7.2636C7.61508 6.91212 8.18492 6.91212 8.5364 7.2636L12 10.727L15.4636 7.2636C15.8151 6.91212 16.3849 6.91212 16.7364 7.2636Z" fill="#FCF9EA"/>
                  </svg>
                </button>
              </div>
            </slot>
          </div>

          <div class="bottom-sheet-content">
            <slot></slot>
          </div>

          <div v-if="$slots.footer" class="bottom-sheet-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
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

.bottom-sheet {
  background-color: white;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bottom-sheet-header {
  padding: 4px;
}


.bottom-sheet-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
}

.bottom-sheet-footer {
  padding: 16px;
  border-top: 1px solid #eee;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close-btn {
  background: none;
  border: none;
  padding: 12px;
  cursor: pointer;
  color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
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
</style>
