<script setup lang="ts">
const props = defineProps<{
  playlist: Playlist
}>();

const coverImages = computed(() => {
  if (!props.playlist.tracks) return [];

  return props.playlist.tracks
  .map(t => t.coverUrl)
  .filter((url): url is string => !!url)
  .slice(0, 4);
});

const isGrid = computed(() => coverImages.value.length >= 4);

const items = [
  [{ label: 'Edytuj', icon: 'i-lucide-edit-2' }, { label: 'Udostępnij', icon: 'i-lucide-share-2' }],
  [{ label: 'Usuń', icon: 'i-lucide-trash-2', color: 'error' as const }]
];

const formattedDate = computed(() => {
  return new Date(props.playlist.createdAt).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
});

const gradientClass = computed(() => {
  const gradients = [
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-cyan-500 via-blue-500 to-indigo-500',
    'from-emerald-400 via-teal-500 to-cyan-600'
  ];
  const index = props.playlist.id.charCodeAt(props.playlist.id.length - 1) % gradients.length;
  return gradients[index];
});
</script>

<template>
  <UCard
      class="group hover:ring-2 hover:ring-primary transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
      :ui="{
        body: 'p-0 sm:p-0',
        header: 'p-4 pb-2',
        footer: 'p-4 pt-2 mt-auto'
      }"
  >
    <template #header>
      <div class="flex justify-between items-start gap-2">
        <div class="min-w-0">
          <h3 class="font-bold text-lg truncate group-hover:text-primary transition-colors">
            {{ playlist.name }}
          </h3>
          <div class="flex items-center gap-1.5 mt-1 text-xs text-gray-500 font-medium">
            <UIcon :name="playlist.isPublic ? 'i-lucide-globe' : 'i-lucide-lock'" class="size-3.5" />
            <span>{{ playlist.isPublic ? 'Publiczna' : 'Prywatna' }}</span>
            <span>• Utworów: {{ playlist._count?.tracks || 0 }}</span>
          </div>
        </div>
        <div @click.stop>
          <UDropdownMenu :items="items">
            <UButton color="neutral" variant="ghost" icon="i-lucide-ellipsis-vertical" size="xs"/>
          </UDropdownMenu>
        </div>
      </div>
    </template>

    <NuxtLink :to="`/playlists/${playlist.id}`" class="block relative aspect-square w-full bg-gray-100 dark:bg-gray-900 group-image">

      <div v-if="isGrid" class="grid grid-cols-2 grid-rows-2 w-full h-full">
        <img
            v-for="(img, index) in coverImages"
            :key="index"
            :src="img"
            alt=""
            class="w-full h-full object-cover"
            loading="lazy"
        />
      </div>

      <img
          v-else-if="coverImages.length > 0"
          :src="coverImages[0]"
          alt="Okładka"
          class="w-full h-full object-cover"
          loading="lazy"
      />

      <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br" :class="gradientClass">
        <UIcon name="i-heroicons-musical-note" class="size-16 text-white/80 drop-shadow-md" />
      </div>

      <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
        <UIcon
            name="i-lucide-play-circle"
            class="size-14 text-white scale-90 group-hover:scale-100 transition-transform duration-300 drop-shadow-lg"
        />
      </div>

    </NuxtLink>

    <template #footer>
      <div class="space-y-2">
        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5em]">
          {{ playlist.description || 'Brak opisu playlisty.' }}
        </p>
        <div v-if="playlist.user" class="flex items-center justify-between pt-2 border-t border-default text-xs text-gray-500">
          <span>Autor:</span>
          <span class="font-mono">{{ playlist.user.name }}</span>
        </div>
        <div
            class="flex items-center justify-between pt-2 border-default text-xs text-gray-500"
            :class="{ 'border-t': !playlist.user }"
        >
          <span>Utworzono:</span>
          <span class="font-mono">{{ formattedDate }}</span>
        </div>
      </div>
    </template>
  </UCard>
</template>