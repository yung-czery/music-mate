<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore()

await useAsyncData('auth_init', async () => {
  await auth.fetchUser()
  return true // <--- To jest "smoczek" dla Nuxta, żeby nie płakał
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>