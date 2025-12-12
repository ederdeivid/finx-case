<script setup lang="ts">
import type { Convenio, Consulta } from '~/types/consultasResponse'

const { data: convenios } = await useFetch<Convenio[]>('/api/convenios')

const router = useRouter()
const route = useRoute()

const {
  consultas,
  paginacao,
  isLoading,
  error,
  filters,
  updateFilters,
  clearFilters,
  goToPage,
  toggleSortOrder,
} = useConsultasApi()

const inputMedico = ref(filters.value.nomeMedico || '')
const inputPaciente = ref(filters.value.nomePaciente || '')
const nomeConvenio = ref<string[]>(filters.value.nomeConvenio || [])

const sortOrder = computed(() => filters.value.ordem || 'desc')
const currentPage = ref(paginacao.value?.paginaAtual || 1)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function handleMedicoChange(value: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    updateFilters({ nomeMedico: value || undefined })
  }, 400)
}

function handlePacienteChange(value: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    updateFilters({ nomePaciente: value || undefined })
  }, 400)
}

function handleClearFilters() {
  inputMedico.value = ''
  inputPaciente.value = ''
  nomeConvenio.value = []
  clearFilters()
}

function navigateToConsulta(consulta: Consulta) {
  const query = route.fullPath.includes('?') ? route.fullPath.split('?')[1] : ''
  router.push({
    path: `/consultas/${consulta.id}`,
    query: query ? { returnQuery: query } : undefined,
  })
}

const totalPages = computed(() => paginacao.value?.totalDePaginas || 1)
const totalItems = computed(() => paginacao.value?.totalDeItens || 0)
const itemsPerPage = computed(() => paginacao.value?.itensPorPagina || 15)

const shouldRenderEmptyMessage = computed<boolean>(() => {
  return !consultas.value?.length && !error.value && !isLoading.value
})

const shouldRenderTableData = computed<boolean>(() => {
  return Boolean(consultas.value?.length && !error.value && !isLoading.value)
})

watch(inputMedico, handleMedicoChange)
watch(inputPaciente, handlePacienteChange)

watch(nomeConvenio, (value) => {
  updateFilters({ nomeConvenio: value.length > 0 ? value : undefined })
})

watch(currentPage, (page) => {
  goToPage(page)
})

watch(() => paginacao.value?.paginaAtual, (val) => {
  if (!val) return
  currentPage.value = val
})

watch(() => filters.value.nomeMedico, (val) => {
  inputMedico.value = val || ''
})

watch(() => filters.value.nomePaciente, (val) => {
  inputPaciente.value = val || ''
})

watch(() => filters.value.nomeConvenio, (val) => {
  nomeConvenio.value = val || []
})

useHead({
  title: 'Consultas - Fin-X',
  meta: [
    { name: 'description', content: 'Gerencie e acompanhe todas as consultas médicas' },
  ],
})
</script>

<template>
  <main class="min-h-screen bg-[#F5F5F5] dark:bg-slate-950">
    <div class="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <ConsultasHeader />

      <ConsultasFilters
        v-model:nome-medico="inputMedico"
        v-model:nome-paciente="inputPaciente"
        v-model:nome-convenio="nomeConvenio"
        :convenios="convenios || []"
        :total-results="totalItems"
        :is-loading="isLoading"
        :sort-order="sortOrder"
        @clear="handleClearFilters"
        @toggle-sort="toggleSortOrder"
      />

      <ConsultasErrorState
        :error-message="(error?.message as string)"
        :is-loading="isLoading"
        @on-try-again="() => updateFilters({})"
      />

      <ConsultasLoadingState :is-loading="isLoading" variant="list" />

      <template v-if="shouldRenderEmptyMessage">
        <EmptyState
          title="Nenhuma consulta encontrada"
          description="Tente ajustar os filtros de busca"
          icon="search"
        />
      </template>

      <template v-if="shouldRenderTableData">
        <ConsultasTable
          :consultas="consultas"
          @row-click="navigateToConsulta"
        >
          <template #pagination>
            <PaginationItem
              v-if="totalPages > 1"
              v-model:current-page="currentPage"
              :total-pages="totalPages"
              :total-items="totalItems"
              :items-per-page="itemsPerPage"
            />
          </template>
        </ConsultasTable>

        <ConsultasCards
          :consultas="consultas"
          @card-click="navigateToConsulta"
        >
          <template #pagination>
            <PaginationItem
              v-if="totalPages > 1"
              v-model:current-page="currentPage"
              :total-pages="totalPages"
              :total-items="totalItems"
              :items-per-page="itemsPerPage"
            />
          </template>
        </ConsultasCards>
      </template>
    </div>
  </main>
</template>
