<script setup lang="ts">

const open = ref(false);

const links = ref([
  {
    label: 'Dodaj nową playlistę',
    icon: 'i-lucide-plus',
    onClick: () => {
      open.value = true;
    },
  },
]);

const { data } = useFetch<Playlist[]>('api/playlists');
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

    <LazyPlaylistAddFormModal
        v-model:open="open"
    />
  </UPage>
</template>

<style scoped>

</style>