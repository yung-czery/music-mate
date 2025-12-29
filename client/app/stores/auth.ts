type LoginCredentials = {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async fetchUser() {
      this.loading = true
      try {
        const { data } = await useFetch<{ user: User }>('/api/auth/me')
        if (data.value?.user) {
          this.user = data.value.user
        } else {
          this.user = null
        }
      } catch (error) {
        console.error(error)
        this.user = null
      } finally {
        this.loading = false
      }
    },

    async login(credentials: LoginCredentials) {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      await this.fetchUser()
    },

    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' })
      this.user = null
      navigateTo('/login')
    }
  }
})