import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  components: {
    dirs: [
      { path: './components', prefix: 'consultas' },
    ]
  }
})