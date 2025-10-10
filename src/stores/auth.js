import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,     // could be user name or ID, optional
    role: null,     // "admin" or "basic"
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.role
  },

  actions: {
    userLogin(role, token, user = null) {
      this.role = role      // e.g., "admin" or "basic"
      this.token = token
      this.user = user
    },
    userLogout() {
      this.role = null
      this.token = null
      this.user = null
    }
  }
})
