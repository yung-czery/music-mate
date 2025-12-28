<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <header class="border-b border-gray-800 p-4 flex justify-between items-center bg-gray-900">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-musical-note" class="text-primary-500 w-6 h-6" />
        <h1 class="font-bold text-xl">MusicMate</h1>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-400">Witaj, {{ auth.user?.name }}</span>
        <UButton
            variant="ghost"
            icon="i-heroicons-arrow-right-on-rectangle"
            @click="auth.logout()"
        >
          Wyloguj
        </UButton>
      </div>
    </header>

    <main class="p-6">
      <slot />
    </main>
  </div>
</template>