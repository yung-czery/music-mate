import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const auth = useAuthStore()

  if (!auth.user) {
    await auth.fetchUser()
  }

  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})