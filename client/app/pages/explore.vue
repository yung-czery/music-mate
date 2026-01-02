<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { data } = useFetch<Playlist[]>('/api/playlists/public');
</script>

<template>
  <UPage>
    <UPageHeader title="Przeglądaj playlisty społeczności"/>

    <UPageBody>
      <UPageGrid>
        <PlaylistCard
            v-for="playlist in data"
            :key="playlist.id"
            :playlist="playlist"
        />
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>

<style scoped>

</style>