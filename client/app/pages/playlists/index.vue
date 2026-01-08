<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { data: playlists, refresh, pending } = useFetch<Playlist[]>('api/playlists', {
  key: 'user-playlists',
});

const auth = useAuthStore();
const toast = useToast();
const addModalOpen = ref(false);
const confirmDeleteOpen = ref(false);
const playlistIdToDelete = ref<string | null>(null);

const handleImport = async () => {
  try {
    await $fetch('/api/spotify/import', { method: 'POST' });

    await refresh();

    toast.add({
      title: 'Sukces!',
      description: 'Playlisty zostały zaimportowane pomyślnie. Teraz możesz zaimportować utwory dla nich.',
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
  }
};

const onRemoveClick = (playlistId: string) => {
  playlistIdToDelete.value = playlistId;
  confirmDeleteOpen.value = true;
};

const handleDelete = async () => {
  if (!playlistIdToDelete.value) return;

  const id = playlistIdToDelete.value;

  try {
    await $fetch(`/api/playlists/${id}`, {
      method: 'DELETE',
    });
    await refresh();
    toast.add({ title: 'Pomyślnie usunięto playlistę', color: 'success', icon: 'i-heroicons-check-circle' });
  } catch (e) {
    console.error(e);
    toast.add({ title: 'Błąd podczas usuwania playlisty', color: 'error', icon: 'i-heroicons-x-circle' });
  } finally {
    playlistIdToDelete.value = null;
  }
};

const links = ref([
  ...(auth.isSpotifyConnected ? [{
    label: 'Importuj ze spotify',
    icon: 'i-simple-icons-spotify',
    onClick: handleImport,
    class: 'w-full sm:w-auto justify-center',
  }] : []),
  {
    label: 'Dodaj nową playlistę',
    icon: 'i-lucide-plus',
    onClick: () => {
      addModalOpen.value = true;
    },
    class: 'w-full sm:w-auto justify-center',
  },
]);

</script>

<template>
  <UPage>
    <UPageHeader title="Twoje Playlisty" :links="links"/>

    <UPageBody>
      <UPageGrid v-if="pending">
        <USkeleton v-for="n in 6" :key="n" class="h-64 w-full rounded-lg"/>
      </UPageGrid>

      <UPageGrid v-else-if="playlists && playlists.length > 0">
        <PlaylistCard
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
            @remove="onRemoveClick"
        />
      </UPageGrid>

      <PlaylistEmpty
          v-else
          title="Nie masz jeszcze żadnych playlist"
          description="Stwórz swoją pierwszą playlistę lub zaimportuj je ze Spotify."
          :playlist-link="false"
      />
    </UPageBody>

    <LazyPlaylistAddModal
        v-model:open="addModalOpen"
        @success="refresh"
    />

    <LazyConfirmModal
        v-model:open="confirmDeleteOpen"
        title="Usuń playlistę"
        description="Czy na pewno chcesz usunąć tę playlistę? Nie będziesz mógł jej odzyskać."
        @confirm="handleDelete"
    />
  </UPage>
</template>

<style scoped>

</style>