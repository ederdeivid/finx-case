<script setup lang="ts">
import type { Consulta } from '~/types/consultasResponse'

const route = useRoute()
const router = useRouter()

const { data: consulta, status, error } = await useFetch<Consulta>(
  () => `/api/consultas/${consultaId.value}`,
)
const consultaId = computed(() => route.params.idConsulta as string)

const isLoading = computed(() => status.value === 'pending')
const errorMessage = computed(() => error.value?.message || null)

function handleGoBack() {
  if (returnQuery.value) {
    router.push(`/consultas?${returnQuery.value}`)
    return
  }
  router.push('/consultas')
}

const returnQuery = computed(() => (route.query.returnQuery as string) || '')

useHead({
  title: `Consulta de ${consulta?.value?.paciente?.nome || ''} - Fin-X`,
  meta: [
    {
      name: 'description',
      content: `Detalhes da consulta de ${consulta?.value?.paciente?.nome || ''} com ${consulta?.value?.medico?.nome || ''}.`,
    },
  ],
})
</script>

<template>
  <main class="min-h-screen bg-[#F5F5F5] dark:bg-slate-950">
    <div class="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div class="mb-6 flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B9AAA]/50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          aria-label="Voltar para a listagem de consultas"
          @click="handleGoBack"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-[#2D4059] dark:text-white">
          Detalhes da Consulta
        </h1>
      </div>

      <ConsultasLoadingState
        :is-loading="isLoading"
        variant="detail"
      />

      <ConsultasErrorState
        :is-loading="isLoading"
        :error-message="errorMessage"
        title="Erro ao carregar detalhes da consulta"
        button-text="Voltar para a listagem"
        @on-try-again="handleGoBack"
      />

      <ConsultasConsultaCard
        v-if="consulta && !isLoading && !errorMessage"
        :consulta="consulta"
        :clickable="false"
      />
    </div>
  </main>
</template>
