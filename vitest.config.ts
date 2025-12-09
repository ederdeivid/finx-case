import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineVitestProject({
  test: {
    globals: true,
    environment: 'nuxt'
  }
})