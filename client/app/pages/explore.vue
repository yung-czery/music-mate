<script setup lang="ts">
const { data, pending } = useFetch<Playlist[]>('/api/playlists/public');
</script>

<template>
  <UPage>
    <UPageHeader title="Przeglądaj playlisty społeczności"/>

    <UPageBody>
      <UPageGrid v-if="pending">
        <USkeleton v-for="n in 6" :key="n" class="h-64 w-full rounded-lg" />
      </UPageGrid>

      <UPageGrid v-else-if="data && data.length > 0">
        <PlaylistCard
            v-for="playlist in data"
            :key="playlist.id"
            :playlist="playlist"
        />
      </UPageGrid>

      <PlaylistEmpty
          v-else
          title="Pustki na parkiecie"
          description="Nikt nie udostępnił jeszcze żadnej playlisty. Bądź pierwszy i podziel się swoim gustem muzycznym!"
      />
    </UPageBody>
  </UPage>
</template>

<style scoped>

</style>