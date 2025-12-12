import type { ConsultasResponse, Consulta } from '~/types/consultasResponse'
import type { Paginacao } from '~/types/paginacao'

export function useConsultasApi() {
  const { filters, updateFilters, clearFilters } = useConsultasFilters()

  const queryParams = computed(() => {
    return {
      ...filters.value,
      nomeConvenio: filters.value.nomeConvenio?.join(',')
    }
  })

  const { data, status, error, refresh } = useFetch<ConsultasResponse>('/api/consultas', {
    key: 'consultas-list',
    query: queryParams,
    watch: [queryParams]
  })

  const consultas = computed<Consulta[]>(() => data.value?.data || [])
  const paginacao = computed<Paginacao | null>(() => data.value?.paginacao || null)
  const isLoading = computed(() => status.value === 'pending')

  function goToPage(page: number) {
    if (!paginacao.value || page < 1 || page > paginacao.value.totalDePaginas) return
    updateFilters({ paginaAtual: page })
  }

  function toggleSortOrder() {
    const newOrdem = filters.value.ordem === 'desc' ? 'asc' : 'desc'
    updateFilters({ ordem: newOrdem })
  }

  return {
    consultas,
    paginacao,
    isLoading,
    error,
    filters,
    fetchConsultas: refresh,
    updateFilters,
    clearFilters,
    goToPage,
    toggleSortOrder
  }
}