<script setup lang="ts">
const props = defineProps<{
  track: SpotifyTrack | null
}>();

const open = defineModel<boolean>('open');
const toast = useToast();

const { data: playlists } = await useFetch<Playlist[]>('/api/playlists');

const handleAdd = async (playlistId: string) => {
  if (!props.track) return;

  try {
    await $fetch(`/api/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: {
        spotifyId: props.track.id,
        title: props.track.name,
        artist: props.track.artist,
        album: props.track.album,
        coverUrl: props.track.image,
        durationMs: props.track.duration_ms,
      },
    });

    await refreshNuxtData(`playlist-${playlistId}`);

    toast.add({
      title: 'Dodano!',
      description: `Utwór ${props.track.name} trafił do playlisty.`,
      color: 'success',
      icon: 'i-heroicons-check-circle',
    });

    open.value = false;
  } catch (e) {
    console.error(e);
    toast.add({
      title: 'Błąd',
      description: 'Nie udało się dodać utworu.',
      color: 'error',
      icon: 'i-heroicons-x-circle',
    });
  }
};
</script>

<template>
  <UModal
      v-model:open="open"
      title="Dodaj do playlisty"
      description="Dodaj utwór do swojej playlisty"
      :ui="{ description: 'sr-only' }"
      :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
      onClick: () => {
        open = false
      }
    }"
  >
    <template #body>
      <div v-if="!track" class="text-center">Błąd: Brak wybranego utworu</div>

      <div v-else class="space-y-4">
        <div
            class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
          <img :src="track.image" class="w-10 h-10 rounded object-cover" :alt="track.name + ' - album artwork'">
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ track.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ track.artist }}</p>
          </div>
        </div>

        <div class="text-sm font-medium text-gray-500 mt-4 mb-2">Wybierz playlistę:</div>

        <div v-if="playlists && playlists.length > 0" class="max-h-60 overflow-y-auto space-y-1">
          <button
              v-for="playlist in playlists"
              :key="playlist.id"
              class="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left group"
              @click="handleAdd(playlist.id)"
          >
            <span class="flex items-center gap-3">
              <UIcon name="i-heroicons-musical-note" class="text-gray-400"/>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ playlist.name }}</span>
            </span>
            <UIcon name="i-heroicons-plus" class="w-5 h-5 text-gray-400 group-hover:text-primary-500"/>
          </button>
        </div>

        <div v-else class="text-center py-4 text-sm text-gray-500">
          Nie masz jeszcze żadnych playlist. <br>
          <NuxtLink to="/playlists" class="text-primary-500 hover:underline" @click="open = false">Utwórz nową
          </NuxtLink>
        </div>
      </div>
    </template>
  </UModal>
</template>