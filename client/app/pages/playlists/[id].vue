<script setup lang="ts">
const route = useRoute();
const playlistId = route.params.id as string;

const { data: playlist, refresh, status } = useFetch<Playlist>(`/api/playlists/${useRoute().params.id}`, {
  key: `playlist-${playlistId}`,
});

const toast = useToast();
const auth = useAuthStore();
const loadingImport = ref(false);
const loadingRemoveTrack = ref(false);
const editModalOpen = ref(false);

const links = computed(() => [
  ...(auth.user?.id === playlist.value?.userId ? [{
    label: 'Edytuj playlistę',
    icon: 'i-lucide-edit-2',
    onClick: () => {
      editModalOpen.value = true;
    },
    class: 'grow justify-center',
  }] : []),
  ...(playlist.value?.spotifyId ? [{
    label: 'Otwórz w Spotify',
    icon: 'i-simple-icons-spotify',
    href: `https://open.spotify.com/playlist/${playlist.value.spotifyId}`,
    target: '_blank',
    class: 'grow justify-center',
  }] : []),
]);

const handleImport = async () => {
  loadingImport.value = true;

  try {
    await $fetch('/api/spotify/sync', {
      method: 'POST',
      body: {
        internalPlaylistId: playlist.value?.id,
        spotifyPlaylistId: playlist.value?.spotifyId,
      },
    });

    await refresh();

    toast.add({
      title: 'Sukces!',
      description: 'Utwory zostały zaimportowane pomyślnie',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    });
  } catch (e) {
    console.error(e);
    if (e.response?.status === 401) {
      toast.add({
        title: 'Błąd!',
        description: 'Twoje konto Spotify nie jest połączone.',
        color: 'error',
        icon: 'i-heroicons-x-circle',
      });
    } else {
      toast.add({
        title: 'Błąd!',
        description: 'Wystąpił błąd podczas importowania utworów',
        color: 'error',
        icon: 'i-heroicons-x-circle',
      });
    }
  } finally {
    loadingImport.value = false;
  }
};

const handleRemoveTrack = async (trackId: string) => {
  loadingRemoveTrack.value = true;

  try {
    await $fetch(`/api/playlists/${playlist.value?.id}/tracks/${trackId}`, {
      method: 'DELETE',
    });
    await refresh();
    toast.add({ title: 'Pomyślnie usunięto utwór', color: 'success' });
  } catch (e) {
    console.error(e);
    toast.add({ title: 'Błąd podczas usuwania utworu', color: 'error' });
  }
};
</script>

<template>
  <UPage v-if="playlist">
    <UPageHeader
        :title="playlist.name"
        :description="playlist.description"
        :headline="`Autor: ${playlist.user?.name}` || ''"
        :links="links"
    />

    <PlaylistEmpty
        v-if="!playlist?.tracks.length && !playlist.spotifyId"
        title="Brak utworów"
        :description="`Ta playlista nie zawiera żadnych utworów.${playlist.userId === auth.user?.id ? ' Dodaj korzystając z wyszukiwarki!' : ''}`"
        :playlist-link="false"
    />

    <UContainer
        v-if="!playlist?.tracks.length && playlist.spotifyId"
        class="flex flex-col gap-4 items-center text-center py-10 text-gray-500">
      Zaimportowałeś playlisty ze Spotify, ale nie zaimportowałeś utworów?

      <UButton icon="i-lucide-import" :loading="loadingImport" :disabled="loadingImport" @click="handleImport">
        Zaimportuj utwory
      </UButton>
    </UContainer>

    <UScrollArea
        v-else
        v-slot="{ item, index }"
        :items="playlist?.tracks || []"
        orientation="vertical"
        :virtualize="{
      gap: 16,
      lanes: 1,
      estimateSize: 64,
      overscan: 5,
    }"
        class="h-[calc(100vh-300px)] w-full playlist-scroll"
    >
      <TrackRowCard
          :key="(item as Track).id"
          :index="index"
          :track="item as Track"
          @remove="handleRemoveTrack"
      />
    </UScrollArea>

    <LazyPlaylistEditModal
        v-model:open="editModalOpen"
        :playlist="playlist"
        @success="refresh"
    />
  </UPage>
</template>

<style scoped>
.playlist-scroll:deep(::-webkit-scrollbar) {
  width: 8px;
}

.playlist-scroll:deep(::-webkit-scrollbar-track) {
  background: transparent;
}

.playlist-scroll:deep(::-webkit-scrollbar-thumb) {
  background-color: #3f3f46;
  border-radius: 99px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.playlist-scroll:deep(::-webkit-scrollbar-thumb:hover) {
  background-color: #71717a;
}

.playlist-scroll {
  scrollbar-width: thin;
  scrollbar-color: #3f3f46 transparent;
}
</style>