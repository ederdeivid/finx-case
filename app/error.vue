<script setup lang="ts">

import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isDev = import.meta.dev

const is404 = computed(() => props.error.statusCode === 404)

const title = computed(() => {
  if (is404.value) return 'Página não encontrada'
  return 'Algo deu errado'
})

const description = computed(() => {
  if (is404.value) return 'A página que você está procurando não existe ou foi movida.'
  return props.error.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
})

function handleGoHome() {
  clearError({ redirect: '/consultas' })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-[#E8F7F9] to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div class="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div class="relative mb-8">
        <div class="absolute -inset-4 rounded-full bg-[#1B9AAA]/10 blur-2xl dark:bg-[#1B9AAA]/5" />

        <div class="relative">
          <span class="text-8xl font-black tracking-tighter text-[#1B9AAA] sm:text-9xl dark:text-[#22B8CC]">
            {{ error.statusCode }}
          </span>
        </div>
      </div>

      <div class="max-w-md text-center">
        <h1 class="mb-3 text-2xl font-bold text-[#2D4059] sm:text-3xl dark:text-white">
          {{ title }}
        </h1>
        <p class="mb-8 text-sm text-slate-600 sm:text-base dark:text-slate-400">
          {{ description }}
        </p>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-[#1B9AAA] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1B9AAA]/25 transition-all hover:bg-[#147885] hover:shadow-xl hover:shadow-[#1B9AAA]/30 focus:outline-none focus:ring-2 focus:ring-[#1B9AAA]/50 focus:ring-offset-2 sm:text-base dark:shadow-[#1B9AAA]/10 dark:hover:shadow-[#1B9AAA]/20"
          @click="handleGoHome"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Ir para a página inicial
        </button>
      </div>

      <div
        v-if="error.stack && isDev"
        class="mt-12 max-w-2xl rounded-lg border border-slate-200 bg-white/80 p-4 text-left backdrop-blur dark:border-slate-700 dark:bg-slate-800/80"
      >
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Stack trace (dev only)
        </p>
        <pre class="overflow-x-auto text-xs text-slate-600 dark:text-slate-300">{{ error.stack }}</pre>
      </div>
    </div>
  </div>
</template>

