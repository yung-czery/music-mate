<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const { data: playlists, pending } = await useFetch<Playlist[]>('/api/playlists');

onMounted(() => {
  if (route.query.import === 'success') {
    toast.add({
      title: 'Sukces!',
      description: 'Połączono ze Spotify i zaimportowano playlisty.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    });

    router.replace({ query: { ...route.query, import: undefined } });
  }
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Twoje Playlisty</h2>
    </div>

    <div v-if="pending" class="text-gray-400">Ładowanie playlist...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <UCard
          v-for="playlist in playlists"
          :key="playlist.id"
          class="hover:ring-2 hover:ring-primary-500 transition cursor-pointer"
      >
        <div class="space-y-3">
          <div class="aspect-square bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
            <UIcon name="i-heroicons-musical-note" class="w-16 h-16 text-gray-600"/>
          </div>

          <div>
            <h3 class="font-bold truncate">{{ playlist.name }}</h3>
            <p class="text-sm text-gray-400 truncate">{{ playlist.description || 'Brak opisu' }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <div v-if="!pending && playlists?.length === 0" class="text-center py-10 text-gray-500">
      Nie masz jeszcze żadnych playlist. Zaimportuj coś!
    </div>
  </div>
</template>