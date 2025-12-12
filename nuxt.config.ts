// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    '@nuxt/hints',
  ],
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