<script setup lang="ts">
const auth = useAuthStore()

await useAsyncData(async () => {
  await auth.fetchUser()
  return true
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>