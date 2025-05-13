import { defineStore } from 'pinia'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    position: null as number | null,
    isOnboardingCompleted: false,
    userAnket: null,
    dictionaries: {}
  }),
  getters: {
    getPosition(state) {
      return state.position
    },
    getUserAnket(state) {
      return state.userAnket
    },
    getIsOnboardingCompleted(state) {
      return state.isOnboardingCompleted
    },
    getDictionaries(state) {
      return state.dictionaries
    }
  },
  actions: {
    setPosition(position: number) {
      this.position = position
    },
    setUserAnket(anket: any) {
      this.userAnket = anket
    },
    setDictionaries(dictionaries: any) {
      this.dictionaries = dictionaries
    },
    setIsOnboardingCompleted(isCompleted: boolean) {
      this.isOnboardingCompleted = isCompleted
    }
  }
})
