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

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
      }
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