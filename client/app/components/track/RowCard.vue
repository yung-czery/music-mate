<script setup lang="ts">
defineProps<{
  track: Track;
  index: number;
}>();

const player = usePlayerStore();

const emit = defineEmits<{
  (e: 'remove', trackId: string): void;
}>();

const onRowClick = (trackId: string) => {
  if (window.innerWidth < 640) {
    player.play(trackId);
  }
};
</script>

<template>
  <div
      class="group flex items-center gap-2 sm:gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
  >

    <div class="w-6 sm:w-8 flex justify-center text-gray-400 text-xs sm:text-sm font-mono shrink-0">
      <span class="sm:group-hover:hidden block">
        {{ index + 1 }}
      </span>
      <UButton
          icon="i-lucide-play"
          variant="link"
          color="primary"
          size="xs"
          class="hidden sm:group-hover:flex"
          :padded="false"
          @click.stop="player.play(track.spotifyId)"
      />
    </div>

    <div class="flex items-center gap-3 flex-1 min-w-0" @click="onRowClick(track.spotifyId)">
      <div class="relative w-10 h-10 shrink-0">
        <NuxtImg
            :src="track.coverUrl || '/placeholder.png'"
            alt="Cover"
            width="64"
            height="64"
            format="webp"
            loading="lazy"
            class="w-full h-full rounded object-cover shadow-sm hover:opacity-80 transition-opacity bg-gray-200 dark:bg-gray-800"
            placeholder
        />
      </div>

      <div class="min-w-0 flex-1">
        <p class="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
          {{ track.title }}
        </p>
        <p class="text-xs text-gray-500 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          {{ track.artist }}
        </p>
      </div>
    </div>

    <div class="hidden md:block flex-1 min-w-0 text-sm text-gray-500 truncate">
      {{ track.album }}
    </div>

    <div class="text-xs text-gray-400 font-mono w-auto sm:w-10 text-right shrink-0">
      {{ formatDuration(track.durationMs) }}
    </div>

    <div class="shrink-0 transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100 pl-2">
      <UButton
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          size="xs"
          class="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          @click.stop="emit('remove', track.id)"
      />
    </div>

  </div>
</template>