type LoginCredentials = {
  email: string
  password: string
}

type RegisterCredentials = {
  name: string
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isSpotifyConnected: state => state.user?.isSpotifyConnected,
  },

  actions: {
    async fetchUser() {
      this.loading = true;
      try {
        const headers = useRequestHeaders(['cookie']);

        const data = await $fetch<{ user: User }>('/api/auth/me', {
          headers: headers,
        });
        if (data.user) {
          this.user = data.user;
        } else {
          this.user = null;
        }
      } catch (error) {
        console.error(error);
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials: LoginCredentials) {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });
      await this.fetchUser();
    },

    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' });
      this.user = null;
      navigateTo('/login');
    },

    async register(credentials: RegisterCredentials) {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: credentials,
      });
      await this.fetchUser();
    },
  },
});