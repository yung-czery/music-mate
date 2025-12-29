// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: 3001,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/api/auth/**': { proxy: 'http://localhost:3000/api/auth/**' },
    '/api/playlists/**': { proxy: 'http://localhost:3000/api/playlists/**' },
    '/api/spotify/**': { proxy: 'http://localhost:3000/api/spotify/**' },
  },

  icon: {
    serverBundle: 'local',

    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    }
  },

  image: {
    domains: [
      'i.scdn.co',       // Główne CDN Spotify
      'mosaic.scdn.co',  // Dla playlist generowanych automatycznie
      'lineup-images.scdn.co'
    ]
  }
})