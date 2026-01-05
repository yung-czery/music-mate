<script setup lang="ts">
withDefaults(defineProps<{
  title: string;
  description: string;
  playlistLink?: boolean;
}>(), {
  playlistLink: true,
});
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
      <UIcon
          name="i-heroicons-musical-note"
          class="w-12 h-12 text-gray-400 dark:text-gray-500"
      />
    </div>

    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
      {{ title }}
    </h3>

    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
      {{ description }}
    </p>

    <UButton
        v-if="playlistLink"
        to="/playlists"
        icon="i-heroicons-plus"
        label="Stwórz playlistę"
        color="primary"
        variant="soft"
    />
  </div>
</template>

<style scoped>

</style>