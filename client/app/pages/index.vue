<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const links = ref([
  {
    label: 'Odkrywaj playlisty',
    to: '/explore',
    icon: 'i-lucide-compass',
  },
  {
    label: 'Twoja biblioteka',
    to: '/playlists',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right',
  },
]);

const cards = ref([
  {
    title: 'Społeczność MusicMate',
    description: 'Brakuje Ci inspiracji? Przeglądaj playlisty stworzone przez innych użytkowników. Zobacz, czego słucha świat i znajdź nowe brzmienia.',
    icon: 'i-lucide-users',
  },
  {
    title: 'Import ze Spotify',
    description: 'Przenieś swoje ulubione kawałki w mgnieniu oka. Połącz konto i zarządzaj swoją dotychczasową kolekcją w nowym, lepszym miejscu.',
    icon: 'i-simple-icons-spotify',
  },
  {
    title: 'Twórz i Organizuj',
    description: 'Buduj własne playlisty z utworów dostępnych w systemie. Masz pełną kontrolę nad kolejnością i zawartością swojej biblioteki.',
    icon: 'i-lucide-library',
  },
]);
</script>

<template>
  <UContainer>
    <UPageHero
        title="Aplikacja MusicMate"
        description="Zarządzaj swoją muzyką w jednym miejscu. Importuj playlisty ze Spotify i twórz nowe wyszukując utworów z różnych zakątków świata."
        :links="links"
    />
    <UPageGrid>
      <UPageCard
          v-for="(card, index) in cards"
          :key="index"
          v-bind="card"
      />
    </UPageGrid>
  </UContainer>
</template>