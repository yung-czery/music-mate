# MusicMate

## 1. Wprowadzenie

**MusicMate** to nowoczesna aplikacja internetowa typu Full Stack, służąca do zarządzania biblioteką muzyczną zintegrowaną z serwisem Spotify. Projekt powstał w celu rozwiązania problemu rozproszenia muzyki oraz braku możliwości tworzenia zaawansowanych, prywatnych kolekcji niezależnych od algorytmów serwisów streamingowych.

**Cel aplikacji:**
Stworzenie platformy umożliwiającej użytkownikom importowanie ulubionych playlist ze Spotify, zarządzanie nimi w lokalnej bazie danych oraz odkrywanie nowych utworów dzięki wbudowanej wyszukiwarce.

**Kluczowe możliwości:**

* Bezpieczne logowanie i integracja z kontem Spotify (OAuth 2.0).
* Wyszukiwanie utworów z wykorzystaniem Spotify API.
* Importowanie istniejących playlist i utworów.
* Tworzenie własnych playlist i edycja ich zawartości.
* Przeglądanie publicznych playlist innych użytkowników.
* Odtwarzanie utworów lub ich 30-sekundowych wersji Preview (w zależności od urządzenia).

## 2. Wykorzystane technologie

Projekt został zrealizowany w architekturze klient-serwer przy użyciu następującego stosu technologicznego:

**Frontend:**

* **Framework:** Nuxt 3 (Vue.js 3 + Composition API)
* **Język:** TypeScript
* **Biblioteka UI:** Nuxt UI
* **Zarządzanie stanem:** Pinia
* **Komunikacja API:** `$fetch` / `ofetch`

**Backend:**

* **Środowisko:** Node.js
* **Framework:** Express.js
* **Język:** TypeScript
* **Autoryzacja:** JSON Web Token (JWT) + Cookies (HttpOnly)

**Baza Danych i Integracje:**

* **Baza danych:** PostgreSQL
* **ORM:** Prisma (modelowanie danych i migracje)
* **Zewnętrzne API:** Spotify Web API

## 3. Instalacja i Konfiguracja (Wprowadzenie)

**Wymagania wstępne:**

* Node.js (wersja 18 lub nowsza)
* Baza danych PostgreSQL (lokalnie lub w chmurze)
* Konto developerskie Spotify (w celu uzyskania `Client ID` i `Client Secret`)

**Instrukcja instalacji:**

1. **Klonowanie repozytorium:**
```bash
git clone https://github.com/twoj-nick/musicmate.git
cd musicmate

```


2. **Instalacja zależności (Backend):**
```bash
cd server
npm install

```


3. **Instalacja zależności (Frontend):**
```bash
cd ../client  # (lub folder główny w zależności od struktury)
npm install

```


4. **Konfiguracja Bazy Danych:**
   W katalogu `server` uruchom migracje Prisma, aby utworzyć tabele:
```bash
npx prisma migrate dev --name init

```



## 4. Instrukcje użytkowania

**Uruchamianie lokalne:**

Należy uruchomić dwa procesy (serwer backendowy oraz serwer frontendowy).

1. Start Backend (w folderze `server`):
```bash
npm run dev

```


*Serwer API uruchomi się pod adresem: http://localhost:3000*
2. Start Frontend (w folderze głównym/client):
```bash
npm run dev

```


*Aplikacja dostępna pod adresem: http://localhost:3001*

**Prezentacja interfejsu:**

![main-page.png](images/main-page.png)

* **Strona główna:** Prezentacja możliwości aplikacji.

![login-page.png](images/login-page.png)

* **Ekran logowania:** Formularz logowania z możliwością rejestracji.

![dashboard-page.png](images/dashboard-page.png)

* **Dashboard:** Lista playlist użytkownika.

![playlist-page.png](images/playlist-page.png)

* **Widok Playlisty:** Szczegółowa lista utworów z odtwarzaczem.

## 5. Kod i konfiguracja

**Repozytorium:**
Link do repozytorium: `https://github.com/twoj-user/musicmate`

**Przykłady konfiguracji (`.env`):**

Plik `.env` (Backend):

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://user:pass@localhost:5432/musicmate?schema=public"
JWT_SECRET="bardzo_tajny_klucz_jwt"
SPOTIFY_CLIENT_ID="twoje_id_ze_spotify"
SPOTIFY_CLIENT_SECRET="twoj_sekret_ze_spotify"
SPOTIFY_REDIRECT_URI="http://localhost:3000/api/spotify/callback"
CLIENT_URL="http://localhost:3001"
```

Plik `.env` (Frontend):

```env
NUXT_PUBLIC_API_URL="http://localhost:3000"
```

## 6. Funkcje

1. **Import i Synchronizacja Spotify:** Użytkownik może jednym kliknięciem pobrać swoje playlisty z chmury Spotify do lokalnej bazy danych. Aplikacja dba o to, by nie dublować utworów.
2. **Wyświetlanie Listy Utworów:** Użytkownik jest w stanie przeglądać zawartość playlist swoich, jak i społeczności. Dzięki zastosowaniu wirtualnego scrollowania aplikacja płynnie wyświetla playlisty zawierające tysiące utworów, renderując w DOM tylko widoczne elementy.
3. **Globalny Odtwarzacz (Pinia Store):** Stan odtwarzacza jest trzymany globalnie. Użytkownik może nawigować między podstronami, a muzyka gra w tle nieprzerwanie.
4. **Inteligentne Wyszukiwanie:** Użytkownik ma możliwość wyszukiwania utworów dostępnych w bazie utworów Spotify i odtwarzania ich w aplikacji oraz dodawania ich do własnych playlist. Wyszukiwarka korzysta z mechanizmu `debounce`, aby ograniczyć liczbę zapytań do API podczas wpisywania tekstu.
5. **Optymalizacja Obrazów:** Wykorzystanie `<NuxtImg>` do serwowania okładek w nowoczesnym formacie WebP i odpowiednim rozmiarze, oszczędzając transfer danych.

## 7. Struktura kodu

### 7.1. Model Danych (Baza Danych)

Baza danych oparta jest o relacje. Główne modele zdefiniowane w `schema.prisma`:

* **User:** Przechowuje dane logowania i tokeny Spotify. Relacja 1:N z Playlistami.
* **Playlist:** Kolekcja utworów. Relacja N:M z Tracks (poprzez tabelę łączącą `PlaylistTrack`).
* **Track:** Unikalny utwór (Spotify ID, tytuł, wykonawca). Utwór jest zapisywany w bazie tylko raz, nawet jeśli występuje na wielu playlistach.
* **PlaylistTrack:** Tabela łącząca, przechowująca informację, kiedy dany utwór został dodany do konkretnej playlisty (`addedAt`).

### 7.2. Struktura Katalogów

* `server/src/controllers` – Logika biznesowa (obsługa zapytań).
* `server/src/routes` – Definicje endpointów API.
* `server/src/middlewares` – Sprawdzanie tokenów JWT i Spotify.
* `client/pages` – Widoki aplikacji (Routing).
* `client/components` – Reużywalne komponenty Vue.
* `client/stores` – Globalny stan (Pinia).

### 7.3. Opis implementacji (Backend: Controller)

Przykład kontrolera obsługującego pobieranie szczegółów playlisty (`server/src/controllers/playlist.controller.ts`). Kontroler realizuje logikę sprawdzania uprawnień.

```typescript
// Fragment kontrolera backendowego
export const getPlaylistDetails = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;
      const userId = req.user?.userId; // ID z middleware JWT

      // Pobieranie danych z bazy za pomocą Prisma ORM
      const rawPlaylist = await prisma.playlist.findUnique({
         where: { id },
         include: { // Dołączanie utworów i autora
            tracks: {
               orderBy: { addedAt: 'desc' },
               include: {
                  track: true,
               },
            },
            user: {
               select: {
                  id: true,
                  name: true,
                  email: true,
               },
            },
         },
      });

      // Walidacja
      if (!rawPlaylist) {
         res.status(404).json({ error: 'Playlist not found' });
         return;
      }

      if (!rawPlaylist.isPublic && rawPlaylist.userId !== userId) {
         res.status(403).json({ error: 'Access denied to this private playlist' });
         return;
      }

      // Przygotowanie odpowiedzi
      const playlist = {
         ...rawPlaylist,
         tracks: rawPlaylist.tracks.map((pt) => ({
            ...pt.track,
            addedAt: pt.addedAt,
         })),
      };

      res.json(playlist);
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not fetch playlist details' });
   }
};

```

### 7.4. Prezentacja funkcjonalności w kodzie (Frontend: Widok Playlisty)

Poniższy kod przedstawia główny widok szczegółów playlisty. Jest to kluczowy komponent aplikacji, który łączy w sobie:

* Server-Side Rendering (SSR): Pobieranie metadanych playlisty.

* Warunkowe renderowanie: Obsługa różnych stanów (pusta playlista, playlista do importu, lista z utworami).

* Optymalizację wydajności: Wirtualizacja długich list utworów.

* Interakcje API: Importowanie ze Spotify i usuwanie utworów.

**Plik:** `pages/playlists/[id].vue`

```vue
<script setup lang="ts">
   const route = useRoute();
   const playlistId = route.params.id as string;

   // 1. POBIERANIE DANYCH (SSR)
   // Użycie useFetch zapewnia pobranie danych po stronie serwera przed wyrenderowaniem strony.
   const { data: playlist, refresh } = useFetch<Playlist>(`/api/playlists/${useRoute().params.id}`, {
      key: `playlist-${playlistId}`,
   });

   const toast = useToast();
   const auth = useAuthStore();
   const loadingImport = ref(false); // Stan ładowania dla importu
   const loadingRemoveTrack = ref(false);
   const editModalOpen = ref(false);

   // 2. LOGIKA PRZYCISKÓW (Computed)
   // Dynamiczne generowanie linków w nagłówku w zależności od uprawnień (właściciel vs gość)
   const links = computed(() => [
      ...(auth.user?.id === playlist.value?.userId ? [{
         label: 'Edytuj playlistę',
         icon: 'i-lucide-edit-2',
         onClick: () => { editModalOpen.value = true; },
         class: 'grow justify-center',
      }] : []),
      // ... Link do Spotify jeśli dostępne ID
   ]);

   // 3. OBSŁUGA IMPORTU ZE SPOTIFY
   // Wywołuje backendowy endpoint synchronizacji, a następnie odświeża widok (refresh)
   const handleImport = async () => {
      loadingImport.value = true;
      try {
         await $fetch('/api/spotify/sync', {
            method: 'POST',
            body: {
               internalPlaylistId: playlist.value?.id,
               spotifyPlaylistId: playlist.value?.spotifyId,
            },
         });
         await refresh(); // Odświeżenie danych bez przeładowania strony
         toast.add({ title: 'Sukces!', description: 'Utwory zaimportowane', color: 'success' });
      } catch (e) {
         // ... obsługa błędów (401, 500) ...
      } finally {
         loadingImport.value = false;
      }
   };

   // 4. USUWANIE UTWORU
   const handleRemoveTrack = async (trackId: string) => {
      // ... logika usuwania ...
   };
</script>

<template>
   <UPage v-if="playlist">
      <UPageHeader
              :title="playlist.name"
              :description="playlist.description"
              :headline="`Autor: ${playlist.user?.name}` || ''"
              :links="links"
      />

      <PlaylistEmpty
              v-if="!playlist?.tracks.length && !playlist.spotifyId"
              title="Brak utworów"
              :description="..."
      />

      <UContainer
              v-if="!playlist?.tracks.length && playlist.spotifyId"
              class="flex flex-col gap-4 items-center ...">
         <UButton :loading="loadingImport" @click="handleImport">
            Zaimportuj utwory
         </UButton>
      </UContainer>

      <UScrollArea
              v-else
              v-slot="{ item, index }"
              :items="playlist?.tracks || []"
              orientation="vertical"
              :virtualize="{
           gap: 16,
           lanes: 1,
           estimateSize: 64,  // Szacowana wysokość wiersza
           overscan: 5,       // Bufor renderowania
        }"
              class="h-[calc(100vh-300px)] w-full playlist-scroll"
      >
         <TrackRowCard
                 :key="(item as Track).id"
                 :index="index"
                 :track="item as Track"
                 @remove="handleRemoveTrack"
         />
      </UScrollArea>

      <LazyPlaylistEditModal v-model:open="editModalOpen" :playlist="playlist" @success="refresh" />
   </UPage>
</template>

<style scoped>
   /* Customizacja paska przewijania (Webkit & Firefox) */
   .playlist-scroll:deep(::-webkit-scrollbar) {
      width: 8px;
   }
   /* ...style paska... */
</style>

```

## 8. Wdrożenie

Projekt jest przystosowany do wdrożenia na platformach chmurowych (np. Vercel dla frontendu i Render dla backendu).

**Kroki konfiguracji środowiska produkcyjnego:**

1. **Frontend:** Uruchomienie komendy `npm run build` generuje zoptymalizowany katalog `.output`, gotowy do serwowania przez Node.js.
2. **Backend:** Należy skompilować TypeScript do JavaScript (`tsc`) lub użyć `ts-node` w trybie produkcyjnym.
3. **Zmienne środowiskowe:** Należy upewnić się, że `JWT_SECRET` w produkcji jest długim, losowym ciągiem znaków, a `DATABASE_URL` wskazuje na produkcyjną bazę danych.