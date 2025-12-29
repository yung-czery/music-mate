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
    '/api/_nuxt_icon/**': { proxy: false },
    '/_nuxt_icon/**': { proxy: false },

    '/api/**': {
      proxy: 'http://localhost:3000/api/**'
    }
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
  },
})