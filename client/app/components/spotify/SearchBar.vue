<script setup lang="ts">
import { useDebounceFn, onClickOutside } from '@vueuse/core';

type SearchResponse = {
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  total: number;
  tracks: SpotifyTrack[]
}

const player = usePlayerStore();
const router = useRouter();
const route = useRoute();

const q = ref(route.query.q?.toString() || '');
const open = ref(false);
const page = ref(1);
const limit = 5;
const isModalOpen = ref(false);
const trackToAdd = ref<SpotifyTrack | null>(null);

const offset = computed(() => (page.value - 1) * limit);

const containerRef = ref<HTMLElement | null>(null);
const popoverContentRef = ref<HTMLElement | null>(null);

const { data, status, refresh, error } = await useFetch<SearchResponse>('/api/spotify/search', {
  immediate: false,
  params: {
    q,
    type: 'track',
    limit,
    offset,
  },
  watch: false,
});

const debouncedSearch = useDebounceFn(() => {
  if (q.value.trim().length > 0) {
    page.value = 1;
    refresh();
    open.value = true;
  } else {
    open.value = false;
  }
}, 300);

watch(q, () => {
  if (!q.value) {
    open.value = false;
    return;
  }
  debouncedSearch();
});

watch(page, () => {
  refresh();
});

onClickOutside(containerRef, () => {
  if (open.value && !isModalOpen.value) {
    open.value = false;
  }
}, {
  ignore: [popoverContentRef],
});

const handleInput = () => {
  open.value = false;
  if (!q.value.trim()) return;
  router.push({ query: { q: q.value } });

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

const handleClear = () => {
  if (isModalOpen.value) return;

  open.value = false;
  q.value = '';
  router.push({ query: { q: undefined } });
};

const totalPages = computed(() => {
  if (!data.value?.total) return 0;
  return Math.ceil(data.value.total / limit);
});

const addToPlaylist = (track: SpotifyTrack) => {
  trackToAdd.value = track;
  isModalOpen.value = true;
  open.value = false;
};

const onRowClick = (trackId: string) => {
  if (window.innerWidth < 640) {
    player.play(trackId);
  }
};
</script>

<template>
  <UContainer ref="containerRef">
    <UPopover
        v-model:open="open"
        :dismissible="false"
        :ui="{ content: 'w-[calc(100vw-1rem)] sm:w-[var(--reka-popper-anchor-width)] max-w-none p-2 sm:p-4' }"
    >
      <template #anchor>
        <UInput
            v-model="q"
            name="q"
            icon="i-heroicons-magnifying-glass"
            placeholder="Szukaj utworów, artystów..."
            variant="outline"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
            class="w-full"
            @keydown.enter="handleInput"
            @focus="q.length > 0 ? open = true : null"
        >
          <template v-if="q?.length" #trailing>
            <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Wyczyść pole wyszukiwania"
                @click="handleClear"
            />
          </template>
        </UInput>
      </template>

      <template #content>
        <div ref="popoverContentRef">
          <div v-if="status === 'pending'" class="space-y-4">
            <USkeleton v-for="i in limit" :key="i" class="h-16 w-full"/>
          </div>

          <UAlert
              v-else-if="error"
              icon="i-heroicons-exclamation-triangle"
              color="error"
              variant="soft"
              title="Błąd wyszukiwania"
              :description="error.data?.message || 'Nie udało się pobrać wyników.'"
          />

          <div v-else-if="data?.tracks.length === 0" class="text-center py-10 text-gray-500">
            Nie znaleziono utworów pasujących do tej frazy.
          </div>

          <div v-else class="space-y-2">
            <div
                v-for="track in data?.tracks"
                :key="track.id"
                class="group flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div class="flex grow" @click="onRowClick(track.id)">
                <div class="relative w-10 h-10 sm:w-12 sm:h-12 mr-3 shrink-0">
                  <img :src="track.image" alt="Album" class="w-full h-full object-cover rounded shadow-sm">
                  <div
                      class="absolute inset-0 bg-black/40 hidden sm:group-hover:flex items-center justify-center rounded backdrop-blur-[1px]">
                    <UIcon name="i-heroicons-play" class="text-white w-6 h-6 cursor-pointer" @click.stop="player.play(track.id)"/>
                  </div>
                </div>

                <div class="flex-1 min-w-0 pr-2">
                  <p class="font-medium text-sm sm:text-base text-ellipsis truncate text-gray-900 dark:text-gray-100">
                    {{ track.name }}
                  </p>
                  <p class="text-xs sm:text-sm text-gray-500 text-ellipsis truncate">
                    {{ track.artist }}
                  </p>
                </div>
              </div>

              <div class="hidden sm:block text-sm text-gray-400 mx-2 font-mono">
                {{ formatDuration(track.duration_ms) }}
              </div>

              <div
                  class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <UButton
                    icon="i-heroicons-plus"
                    variant="ghost"
                    size="sm"
                    class="bg-gray-100 dark:bg-gray-800 sm:bg-transparent"
                    @click="addToPlaylist(track)"
                />
              </div>

            </div>
          </div>

          <div
              v-if="data?.total && data.total > limit"
              class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <UButton
                icon="i-heroicons-chevron-left"
                size="xs"
                variant="ghost"
                :disabled="page === 1"
                @click="page--"
            />

            <span class="text-xs text-gray-500">
            Strona {{ page }}
          </span>

            <UButton
                icon="i-heroicons-chevron-right"
                size="xs"
                variant="ghost"
                :disabled="page >= totalPages"
                @click="page++"
            />
          </div>
        </div>
      </template>
    </UPopover>
    <LazyTrackAddModal
        v-if="trackToAdd"
        v-model:open="isModalOpen"
        :track="trackToAdd"
        @close="trackToAdd = null"
    />
  </UContainer>
</template>