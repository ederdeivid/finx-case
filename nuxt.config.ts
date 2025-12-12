// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/test-utils',
    '@nuxt/hints',
  ],
  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: [400, 500, 600, 700],
      },
    ],
    defaults: {
      weights: [400, 500, 600, 700],
    },
  },
  extends: [
    './app/layers/consultas'
  ],
  router: {
    options: {
      hashMode: false,
    },
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  experimental: {
    componentIslands: true,
    viewTransition: true,
    payloadExtraction: true,
  },
})