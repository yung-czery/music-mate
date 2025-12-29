<script setup lang="ts">
definePageMeta({
  layout: false
})

const auth = useAuthStore()
const state = reactive({ email: '', password: '' })
const loading = ref(false)
const toast = useToast()

const handleLogin = async () => {
  try {
    await auth.login(state)

    toast.add({
      title: 'Sukces!',
      description: 'Zalogowano pomyślnie',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })

    navigateTo('/')
  } catch (e) {
    console.error(e)
    toast.add({
      title: 'Błąd',
      description: 'Nieprawidłowe dane logowania',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-950">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h2 class="text-xl font-bold text-center text-primary-500">Zaloguj się</h2>
      </template>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <UFormField label="Email">
          <UInput v-model="state.email" type="email" icon="i-heroicons-envelope" class="w-full" />
        </UFormField>

        <UFormField label="Hasło">
          <UInput v-model="state.password" type="password" icon="i-heroicons-lock-closed" class="w-full" />
        </UFormField>

        <UButton type="submit" block :loading="loading" color="primary">
          Wejdź
        </UButton>
      </form>
    </UCard>

    <UCard class="w-full max-w-sm">
      <template #header>
        <h2 class="text-xl font-bold text-center text-primary-500">Nie masz konta?</h2>
      </template>

        <UButton to="/register" block color="primary">
          Zarejestruj się
        </UButton>
    </UCard>
  </div>
</template>