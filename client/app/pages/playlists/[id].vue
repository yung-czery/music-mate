<script setup lang="ts">
const { data } = useFetch<Playlist>(`/api/playlists/${useRoute().params.id}`);
</script>

<template>
  <pre>
    {{ data}}
  </pre>
</template>

<style scoped>

</style>