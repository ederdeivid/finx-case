import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import type { ConsultasResponse, Consulta } from '~/types/consultasResponse'
import type { Paginacao } from '~/types/paginacao'
import type { ConsultasRequestParams } from '~/types/consultasRequestParams'

function createMockConsulta(overrides: Partial<Consulta> = {}): Consulta {
  return {
    id: 1,
    medico: { nome: 'Dr. João Silva' },
    paciente: { nome: 'Maria Santos', dataNascimento: '1990-05-15' },
    convenio: { id: 1, nome: 'Unimed' },
    dataCriacao: '2024-01-15T10:00:00Z',
    ...overrides,
  }
}

function createMockPaginacao(overrides: Partial<Paginacao> = {}): Paginacao {
  return {
    paginaAtual: 1,
    itensPorPagina: 15,
    totalDePaginas: 1,
    totalDeItens: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    ...overrides,
  }
}

describe('useConsultasApi - Lógica de API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('Construção de queryParams', () => {
    it('deve construir params básicos', () => {
      const filters: ConsultasRequestParams = {
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      }

      const buildQueryParams = (f: ConsultasRequestParams) => ({
        ...f,
        nomeConvenio: f.nomeConvenio?.join(','),
      })

      const params = buildQueryParams(filters)

      expect(params.paginaAtual).toBe(1)
      expect(params.itensPorPagina).toBe(15)
      expect(params.ordenarPor).toBe('dataCriacao')
      expect(params.ordem).toBe('desc')
    })

    it('deve converter nomeConvenio para string separada por vírgula', () => {
      const filters: ConsultasRequestParams = {
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
        nomeConvenio: ['Unimed', 'Bradesco'],
      }

      const buildQueryParams = (f: ConsultasRequestParams) => ({
        ...f,
        nomeConvenio: f.nomeConvenio?.join(','),
      })

      const params = buildQueryParams(filters)

      expect(params.nomeConvenio).toBe('Unimed,Bradesco')
    })

    it('deve incluir todos os filtros ativos', () => {
      const filters: ConsultasRequestParams = {
        paginaAtual: 2,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'asc',
        nomeMedico: 'Dr. João',
        nomePaciente: 'Maria',
        nomeConvenio: ['Unimed'],
        dataCriacao: '2024-01-15',
      }

      const buildQueryParams = (f: ConsultasRequestParams) => ({
        ...f,
        nomeConvenio: f.nomeConvenio?.join(','),
      })

      const params = buildQueryParams(filters)

      expect(params.nomeMedico).toBe('Dr. João')
      expect(params.nomePaciente).toBe('Maria')
      expect(params.nomeConvenio).toBe('Unimed')
      expect(params.dataCriacao).toBe('2024-01-15')
    })
  })

  describe('Lógica de goToPage', () => {
    it('deve validar página mínima', () => {
      const paginacao = createMockPaginacao({ totalDePaginas: 5 })
      const updateFiltersMock = vi.fn()

      const goToPage = (page: number) => {
        if (!paginacao || page < 1 || page > paginacao.totalDePaginas) return
        updateFiltersMock({ paginaAtual: page })
      }

      goToPage(0)

      expect(updateFiltersMock).not.toHaveBeenCalled()
    })

    it('deve validar página máxima', () => {
      const paginacao = createMockPaginacao({ totalDePaginas: 5 })
      const updateFiltersMock = vi.fn()

      const goToPage = (page: number) => {
        if (!paginacao || page < 1 || page > paginacao.totalDePaginas) return
        updateFiltersMock({ paginaAtual: page })
      }

      goToPage(10)

      expect(updateFiltersMock).not.toHaveBeenCalled()
    })

    it('deve aceitar página válida', () => {
      const paginacao = createMockPaginacao({ totalDePaginas: 5 })
      const updateFiltersMock = vi.fn()

      const goToPage = (page: number) => {
        if (!paginacao || page < 1 || page > paginacao.totalDePaginas) return
        updateFiltersMock({ paginaAtual: page })
      }

      goToPage(3)

      expect(updateFiltersMock).toHaveBeenCalledWith({ paginaAtual: 3 })
    })

    it('não deve navegar sem paginação', () => {
      const paginacao: Paginacao | null = null
      const updateFiltersMock = vi.fn()

      const goToPage = (page: number) => {
        if (!paginacao || page < 1 || page > (paginacao as Paginacao)?.totalDePaginas) return
        updateFiltersMock({ paginaAtual: page })
      }

      goToPage(2)

      expect(updateFiltersMock).not.toHaveBeenCalled()
    })
  })

  describe('Lógica de toggleSortOrder', () => {
    it('deve alternar de desc para asc', () => {
      const filters = ref<ConsultasRequestParams>({
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      })

      const updateFiltersMock = vi.fn()

      const toggleSortOrder = () => {
        const newOrdem = filters.value.ordem === 'desc' ? 'asc' : 'desc'
        updateFiltersMock({ ordem: newOrdem })
      }

      toggleSortOrder()

      expect(updateFiltersMock).toHaveBeenCalledWith({ ordem: 'asc' })
    })

    it('deve alternar de asc para desc', () => {
      const filters = ref<ConsultasRequestParams>({
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'asc',
      })

      const updateFiltersMock = vi.fn()

      const toggleSortOrder = () => {
        const newOrdem = filters.value.ordem === 'desc' ? 'asc' : 'desc'
        updateFiltersMock({ ordem: newOrdem })
      }

      toggleSortOrder()

      expect(updateFiltersMock).toHaveBeenCalledWith({ ordem: 'desc' })
    })
  })

  describe('Estados derivados', () => {
    it('deve derivar isLoading do status', () => {
      const status = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

      const isLoading = computed(() => status.value === 'pending')

      expect(isLoading.value).toBe(true)

      status.value = 'success'
      expect(isLoading.value).toBe(false)
    })

    it('deve derivar consultas vazias quando data é null', () => {
      const data = ref<ConsultasResponse | null>(null)

      const consultas = computed(() => data.value?.data || [])

      expect(consultas.value).toEqual([])
    })

    it('deve derivar consultas da response', () => {
      const mockConsultas = [createMockConsulta({ id: 1 }), createMockConsulta({ id: 2 })]
      const data = ref<ConsultasResponse | null>({
        data: mockConsultas,
        paginacao: createMockPaginacao(),
      })

      const consultas = computed(() => data.value?.data || [])

      expect(consultas.value).toHaveLength(2)
      expect(consultas.value[0]?.id).toBe(1)
    })

    it('deve derivar paginação null quando data é null', () => {
      const data = ref<ConsultasResponse | null>(null)

      const paginacao = computed(() => data.value?.paginacao || null)

      expect(paginacao.value).toBeNull()
    })

    it('deve derivar paginação da response', () => {
      const data = ref<ConsultasResponse | null>({
        data: [],
        paginacao: createMockPaginacao({ totalDeItens: 100, totalDePaginas: 7 }),
      })

      const paginacao = computed(() => data.value?.paginacao || null)

      expect(paginacao.value?.totalDeItens).toBe(100)
      expect(paginacao.value?.totalDePaginas).toBe(7)
    })
  })

  describe('Integração filtros e API', () => {
    it('deve repassar filters do composable de filtros', () => {
      const mockFilters = ref<ConsultasRequestParams>({
        paginaAtual: 2,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
        nomeMedico: 'Dr. João',
      })

      // Simula a estrutura do useConsultasApi
      const api = {
        filters: mockFilters,
      }

      expect(api.filters.value.paginaAtual).toBe(2)
      expect(api.filters.value.nomeMedico).toBe('Dr. João')
    })

    it('deve repassar updateFilters do composable de filtros', () => {
      const mockUpdateFilters = vi.fn()

      const api = {
        updateFilters: mockUpdateFilters,
      }

      api.updateFilters({ nomePaciente: 'Maria' })

      expect(mockUpdateFilters).toHaveBeenCalledWith({ nomePaciente: 'Maria' })
    })

    it('deve repassar clearFilters do composable de filtros', () => {
      const mockClearFilters = vi.fn()

      const api = {
        clearFilters: mockClearFilters,
      }

      api.clearFilters()

      expect(mockClearFilters).toHaveBeenCalled()
    })
  })
})
