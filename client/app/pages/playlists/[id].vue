<script setup lang="ts">
const { data } = useFetch<Playlist>(`/api/playlists/${useRoute().params.id}`);

const links = ref([
  {
    label: 'Podejrzyj na Spotify',
    icon: 'i-simple-icons-spotify',
    to: `https://open.spotify.com/playlist/${data.value?.spotifyId}`,
    target: '_blank',
  },
]);

const handleImport = async () => {

}
</script>

<template>
  <UPage v-if="data">
    <UPageHeader
        :title="data.name"
        :description="data.description"
        :headline="`Autor: ${data.user?.name}` || ''"
        :links="data.spotifyId ? links : []"
    />

    <UPageList>
      <TrackRowCard
          v-for="(item, index) in data?.tracks as Track[]"
          :key="item.id"
          :index="index"
          :track="item"
      />
    </UPageList>

    <div v-if="!data?.tracks.length && !data.spotifyId" class="text-center py-10 text-gray-500">
      Ta playlista jest pusta.
    </div>

    <UContainer v-if="!data?.tracks.length && data.spotifyId"
                class="flex flex-col gap-4 items-center text-center py-10 text-gray-500">
      Zaimportowałeś playlisty ze Spotify, ale nie zaimportowałeś utworów?

      <UButton icon="i-lucide-import" @click="handleImport">Zaimportuj utwory</UButton>
    </UContainer>
  </UPage>
</template>

<style scoped>

</style>