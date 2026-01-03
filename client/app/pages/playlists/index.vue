<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { data, refresh } = useFetch<Playlist[]>('api/playlists', {
  key: 'user-playlists'
});

const auth = useAuthStore();
const toast = useToast();
const addModalOpen = ref(false);

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

const links = ref([
  ...(auth.isSpotifyConnected ? [{
    label: 'Importuj ze spotify',
    icon: 'i-simple-icons-spotify',
    onClick: handleImport,
  }] : []),
  {
    label: 'Dodaj nową playlistę',
    icon: 'i-lucide-plus',
    onClick: () => {
      addModalOpen.value = true;
    },
  },
]);

</script>

<template>
  <UPage>
    <UPageHeader title="Twoje Playlisty" :links="links"/>

    <UPageBody>
      <UPageGrid>
        <PlaylistCard
            v-for="playlist in data"
            :key="playlist.id"
            :playlist="playlist"
        />
      </UPageGrid>
    </UPageBody>

    <LazyPlaylistAddModal
        v-model:open="addModalOpen"
        @success="refresh"
    />
  </UPage>
</template>

<style scoped>

</style>