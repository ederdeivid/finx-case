import type { ConsultasRequestParams } from '~/types/consultasRequestParams'

const ITEMS_PER_PAGE = 15

export function useConsultasFilters() {
  const route = useRoute()
  const router = useRouter()

  const getInitialFilters = (): ConsultasRequestParams => {
    const query = route.query

    let nomeConvenio: string[] | undefined
    if (query.nomeConvenio) {
      const convenioParam = query.nomeConvenio as string
      nomeConvenio = convenioParam.split(',').filter(Boolean)
    }

    return {
      paginaAtual: query.paginaAtual ? Number(query.paginaAtual) : 1,
      itensPorPagina: query.itensPorPagina ? Number(query.itensPorPagina) : ITEMS_PER_PAGE,
      dataCriacao: (query.dataCriacao as string) || undefined,
      nomeConvenio,
      nomeMedico: (query.nomeMedico as string) || undefined,
      nomePaciente: (query.nomePaciente as string) || undefined,
      ordenarPor: (query.ordenarPor as 'dataCriacao') || 'dataCriacao',
      ordem: (query.ordem as 'asc' | 'desc') || 'desc',
    }
  }

  const filters = ref<ConsultasRequestParams>(getInitialFilters())

  watch(filters, (newFilters) => syncFiltersToUrl(newFilters) , { deep: true })

  function syncFiltersToUrl(newFilters: ConsultasRequestParams) {
    const query: Record<string, string | undefined> = {}

    if ((newFilters?.paginaAtual || 1) > 1) query.paginaAtual = String(newFilters.paginaAtual)
    if (newFilters?.nomeMedico) query.nomeMedico = newFilters.nomeMedico
    if (newFilters?.nomePaciente) query.nomePaciente = newFilters.nomePaciente
    if (newFilters?.nomeConvenio?.length) query.nomeConvenio = newFilters.nomeConvenio.join(',')
    if (newFilters?.dataCriacao) query.dataCriacao = newFilters.dataCriacao
    if (newFilters?.ordem !== 'desc') query.ordem = newFilters.ordem

    router.replace({ query: { ...route.query, ...query } })
  }

  function updateFilters(newFilters: Partial<ConsultasRequestParams>) {
    const isPageChange = Object.keys(newFilters).length === 1 && 'paginaAtual' in newFilters

    filters.value = {
      ...filters.value,
      ...newFilters,
      paginaAtual: isPageChange ? newFilters.paginaAtual : 1,
    }
  }

  function clearFilters() {
    filters.value = {
      paginaAtual: 1,
      itensPorPagina: ITEMS_PER_PAGE,
      ordenarPor: 'dataCriacao',
      ordem: 'desc',
    }
  }

  return {
    filters,
    updateFilters,
    clearFilters
  }
}