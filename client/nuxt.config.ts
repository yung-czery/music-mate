// https://nuxt.com/docs/api/configuration/nuxt-config

const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'MusicMate',
      meta: [
        { name: 'description', content: 'Twoja ulubiona aplikacja do zarządzania playlistami Spotify.' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
      ]
    }
  },

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
    '/api/auth/**': { proxy: `${API_URL}/api/auth/**` },
    '/api/playlists/**': { proxy: `${API_URL}/api/playlists/**` },
    '/api/spotify/**': { proxy: `${API_URL}/api/spotify/**` },
  },

  runtimeConfig: {
    public: {
      apiUrl: API_URL,
      appName: 'MusicMate',
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
  }
})