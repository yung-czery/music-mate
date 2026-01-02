<script setup lang="ts">

const addModalOpen = ref(false);

const links = ref([
  {
    label: 'Dodaj nową playlistę',
    icon: 'i-lucide-plus',
    onClick: () => {
      addModalOpen.value = true;
    },
  },
]);

const { data, refresh } = useFetch<Playlist[]>('api/playlists');
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