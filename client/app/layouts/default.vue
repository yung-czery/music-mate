<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/components/NavigationMenu.vue';

const API_URL = useRuntimeConfig().public.apiUrl;
const auth = useAuthStore();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Dashboard',
    to: '/',
    icon: 'i-heroicons-home',
  },
  {
    label: 'Biblioteka',
    to: '/playlists',
    icon: 'i-heroicons-musical-note',
  },
]);

const userItems = computed<NavigationMenuItem[]>(() => [
  [{
    label: auth.user?.email || 'Konto',
    slot: 'account',
    disabled: true,
  }],
  [{
    label: 'Importuj ze Spotify',
    icon: 'i-simple-icons-spotify',
    to: `${API_URL}/api/spotify/login`,
    external: true,
  }, {
    label: 'Ustawienia',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings',
  }],
  [{
    label: 'Wyloguj się',
    icon: 'i-heroicons-arrow-right-start-on-rectangle',
    onSelect: () => auth.logout(),
    class: 'cursor-pointer',
  }],
]);
</script>

<template>
  <div>
    <UHeader toggle mode="slideover">
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl text-primary-500 mr-4">
          <UIcon name="i-heroicons-musical-note" class="w-8 h-8"/>
          <span class="hidden sm:block">MusicMate</span>
        </NuxtLink>
      </template>

      <UInput
          icon="i-heroicons-magnifying-glass"
          placeholder="Szukaj..."
          variant="outline"
          :ui="{ icon: { trailing: { pointer: '' } } }"
          class="w-full"
      />

      <template #right>
        <UColorModeButton/>
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5"/>

        <div class="text-left w-full truncate mt-5">
          <p class="text-xs text-gray-500">Zalogowany jako</p>
          <p class="font-medium text-gray-900 dark:text-white truncate">
            {{ auth.user?.name }}
          </p>
        </div>
        <UNavigationMenu :items="userItems" orientation="vertical" class="-mx-2.5"/>
      </template>
    </UHeader>

    <UMain class="dark:bg-gray-950 dark:text-gray-100 bg-gray-100">
      <UContainer class="py-8">
        <slot/>
      </UContainer>
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }} MusicMate
        </p>
      </template>
    </UFooter>
  </div>
</template>