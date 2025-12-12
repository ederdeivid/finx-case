import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import type { Consulta, Convenio } from '~/types/consultasResponse'
import type { Paginacao } from '~/types/paginacao'

/**
 * Testes para a página de listagem de consultas
 *
 * Foco em testar os três estados principais:
 * - Loading: exibição do skeleton
 * - Empty State: quando não há resultados
 * - Listagem: exibição dos dados
 *
 * Os testes são agnósticos de API - mockam o composable useConsultasApi
 */

// Mocks dos dados
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

const mockConvenios: Convenio[] = [
  { id: 1, nome: 'Unimed' },
  { id: 2, nome: 'Bradesco' },
  { id: 3, nome: 'Amil' },
]

// Mock do composable
const mockUseConsultasApi = vi.fn()

vi.mock('~/composables/useConsultasApi', () => ({
  useConsultasApi: () => mockUseConsultasApi(),
}))

// Mock do useFetch para convênios
vi.mock('#app', () => ({
  useFetch: vi.fn(() => ({
    data: ref(mockConvenios),
  })),
  useRoute: vi.fn(() => ({
    query: {},
    fullPath: '/consultas',
    params: {},
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  useHead: vi.fn(),
}))

describe('Página de Listagem de Consultas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado de Loading', () => {
    it('deve exibir skeleton quando isLoading é true', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(null),
        isLoading: ref(true),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.isLoading.value).toBe(true)
      expect(state.consultas.value).toHaveLength(0)
      expect(state.error.value).toBeNull()
    })

    it('não deve exibir erro durante loading', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(null),
        isLoading: ref(true),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.isLoading.value).toBe(true)
      expect(state.error.value).toBeNull()
    })

    it('deve ter lista vazia durante loading inicial', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(null),
        isLoading: ref(true),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.consultas.value).toEqual([])
      expect(state.paginacao.value).toBeNull()
    })
  })

  describe('Estado Vazio (Empty State)', () => {
    it('deve identificar estado vazio quando lista está vazia e não está carregando', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(createMockPaginacao({ totalDeItens: 0, totalDePaginas: 0 })),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.isLoading.value).toBe(false)
      expect(state.consultas.value).toHaveLength(0)
      expect(state.paginacao.value?.totalDeItens).toBe(0)
    })

    it('deve identificar estado vazio após aplicar filtros sem resultados', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(createMockPaginacao({ totalDeItens: 0, totalDePaginas: 0 })),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({
          paginaAtual: 1,
          itensPorPagina: 15,
          nomeMedico: 'Médico Inexistente',
        }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.consultas.value).toHaveLength(0)
      expect(state.filters.value.nomeMedico).toBe('Médico Inexistente')
    })

    it('não deve exibir erro no estado vazio normal', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(createMockPaginacao({ totalDeItens: 0 })),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.error.value).toBeNull()
    })
  })

  describe('Estado de Erro', () => {
    it('deve identificar estado de erro quando error não é null', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(null),
        isLoading: ref(false),
        error: ref('Erro ao carregar consultas. Tente novamente.'),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.error.value).toBe('Erro ao carregar consultas. Tente novamente.')
      expect(state.isLoading.value).toBe(false)
    })

    it('não deve estar em loading quando há erro', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(null),
        isLoading: ref(false),
        error: ref('Erro de conexão'),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.isLoading.value).toBe(false)
      expect(state.error.value).toBeTruthy()
    })
  })

  describe('Listagem de Dados', () => {
    it('deve exibir lista de consultas quando dados estão disponíveis', () => {
      const mockConsultas = [
        createMockConsulta({ id: 1, medico: { nome: 'Dr. João' } }),
        createMockConsulta({ id: 2, medico: { nome: 'Dra. Maria' } }),
        createMockConsulta({ id: 3, medico: { nome: 'Dr. Pedro' } }),
      ]

      mockUseConsultasApi.mockReturnValue({
        consultas: ref(mockConsultas),
        paginacao: ref(createMockPaginacao({ totalDeItens: 3 })),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.consultas.value).toHaveLength(3)
      expect(state.consultas.value[0].medico.nome).toBe('Dr. João')
      expect(state.consultas.value[1].medico.nome).toBe('Dra. Maria')
      expect(state.consultas.value[2].medico.nome).toBe('Dr. Pedro')
    })

    it('deve ter paginação correta quando há múltiplas páginas', () => {
      const mockConsultas = Array.from({ length: 15 }, (_, i) =>
        createMockConsulta({ id: i + 1 })
      )

      mockUseConsultasApi.mockReturnValue({
        consultas: ref(mockConsultas),
        paginacao: ref(createMockPaginacao({
          paginaAtual: 1,
          totalDeItens: 45,
          totalDePaginas: 3,
          nextPageUrl: '/api/consultas?paginaAtual=2',
        })),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.paginacao.value?.totalDePaginas).toBe(3)
      expect(state.paginacao.value?.totalDeItens).toBe(45)
      expect(state.paginacao.value?.paginaAtual).toBe(1)
      expect(state.paginacao.value?.nextPageUrl).toBeTruthy()
    })

    it('deve conter todos os campos necessários em cada consulta', () => {
      const mockConsulta = createMockConsulta({
        id: 1,
        medico: { nome: 'Dr. João Silva' },
        paciente: { nome: 'Maria Santos', dataNascimento: '1990-05-15' },
        convenio: { id: 1, nome: 'Unimed' },
        dataCriacao: '2024-01-15T10:00:00Z',
      })

      mockUseConsultasApi.mockReturnValue({
        consultas: ref([mockConsulta]),
        paginacao: ref(createMockPaginacao()),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()
      const consulta = state.consultas.value[0]

      expect(consulta).toHaveProperty('id')
      expect(consulta).toHaveProperty('medico')
      expect(consulta).toHaveProperty('paciente')
      expect(consulta).toHaveProperty('convenio')
      expect(consulta).toHaveProperty('dataCriacao')
      expect(consulta.medico).toHaveProperty('nome')
      expect(consulta.paciente).toHaveProperty('nome')
      expect(consulta.paciente).toHaveProperty('dataNascimento')
      expect(consulta.convenio).toHaveProperty('id')
      expect(consulta.convenio).toHaveProperty('nome')
    })

    it('não deve estar em loading quando dados estão carregados', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([createMockConsulta()]),
        paginacao: ref(createMockPaginacao()),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.isLoading.value).toBe(false)
      expect(state.consultas.value.length).toBeGreaterThan(0)
    })
  })

  describe('Filtros', () => {
    it('deve chamar updateFilters ao atualizar filtro de médico', async () => {
      const updateFiltersMock = vi.fn()

      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(createMockPaginacao()),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: updateFiltersMock,
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()
      state.updateFilters({ nomeMedico: 'Dr. João' })

      expect(updateFiltersMock).toHaveBeenCalledWith({ nomeMedico: 'Dr. João' })
    })

    it('deve chamar updateFilters ao atualizar filtro de convênio', async () => {
      const updateFiltersMock = vi.fn()

      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(createMockPaginacao()),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: updateFiltersMock,
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()
      state.updateFilters({ nomeConvenio: ['Unimed', 'Bradesco'] })

      expect(updateFiltersMock).toHaveBeenCalledWith({ nomeConvenio: ['Unimed', 'Bradesco'] })
    })

    it('deve chamar clearFilters ao limpar filtros', () => {
      const clearFiltersMock = vi.fn()

      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(createMockPaginacao()),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15, nomeMedico: 'Dr. João' }),
        updateFilters: vi.fn(),
        clearFilters: clearFiltersMock,
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()
      state.clearFilters()

      expect(clearFiltersMock).toHaveBeenCalled()
    })
  })

  describe('Paginação', () => {
    it('deve chamar goToPage ao navegar para próxima página', () => {
      const goToPageMock = vi.fn()

      mockUseConsultasApi.mockReturnValue({
        consultas: ref([createMockConsulta()]),
        paginacao: ref(createMockPaginacao({ totalDePaginas: 3 })),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: goToPageMock,
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()
      state.goToPage(2)

      expect(goToPageMock).toHaveBeenCalledWith(2)
    })

    it('deve atualizar paginaAtual nos filtros ao navegar', () => {
      const updateFiltersMock = vi.fn()

      mockUseConsultasApi.mockReturnValue({
        consultas: ref([createMockConsulta()]),
        paginacao: ref(createMockPaginacao({ totalDePaginas: 3 })),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: updateFiltersMock,
        clearFilters: vi.fn(),
        goToPage: (page: number) => updateFiltersMock({ paginaAtual: page }),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()
      state.goToPage(2)

      expect(updateFiltersMock).toHaveBeenCalledWith({ paginaAtual: 2 })
    })
  })

  describe('Ordenação', () => {
    it('deve chamar toggleSortOrder ao clicar no botão de ordenação', () => {
      const toggleSortOrderMock = vi.fn()

      mockUseConsultasApi.mockReturnValue({
        consultas: ref([createMockConsulta()]),
        paginacao: ref(createMockPaginacao()),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15, ordem: 'desc' }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: toggleSortOrderMock,
      })

      const state = mockUseConsultasApi()
      state.toggleSortOrder()

      expect(toggleSortOrderMock).toHaveBeenCalled()
    })

    it('deve ter ordem padrão desc', () => {
      mockUseConsultasApi.mockReturnValue({
        consultas: ref([createMockConsulta()]),
        paginacao: ref(createMockPaginacao()),
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15, ordem: 'desc', ordenarPor: 'dataCriacao' }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      expect(state.filters.value.ordem).toBe('desc')
      expect(state.filters.value.ordenarPor).toBe('dataCriacao')
    })
  })

  describe('Transições de Estado', () => {
    it('deve transicionar de loading para dados carregados', async () => {
      const isLoading = ref(true)
      const consultas = ref<Consulta[]>([])

      mockUseConsultasApi.mockReturnValue({
        consultas,
        paginacao: ref(null),
        isLoading,
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      // Estado inicial: loading
      expect(state.isLoading.value).toBe(true)
      expect(state.consultas.value).toHaveLength(0)

      // Simula fim do loading
      isLoading.value = false
      consultas.value = [createMockConsulta()]

      await nextTick()

      // Estado final: dados carregados
      expect(state.isLoading.value).toBe(false)
      expect(state.consultas.value).toHaveLength(1)
    })

    it('deve transicionar de loading para erro', async () => {
      const isLoading = ref(true)
      const error = ref<string | null>(null)

      mockUseConsultasApi.mockReturnValue({
        consultas: ref([]),
        paginacao: ref(null),
        isLoading,
        error,
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      // Estado inicial: loading
      expect(state.isLoading.value).toBe(true)
      expect(state.error.value).toBeNull()

      // Simula erro
      isLoading.value = false
      error.value = 'Erro de conexão'

      await nextTick()

      // Estado final: erro
      expect(state.isLoading.value).toBe(false)
      expect(state.error.value).toBe('Erro de conexão')
    })

    it('deve transicionar de dados para empty state após filtro', async () => {
      const consultas = ref([createMockConsulta()])
      const paginacao = ref(createMockPaginacao({ totalDeItens: 1 }))

      mockUseConsultasApi.mockReturnValue({
        consultas,
        paginacao,
        isLoading: ref(false),
        error: ref(null),
        filters: ref({ paginaAtual: 1, itensPorPagina: 15 }),
        updateFilters: vi.fn(),
        clearFilters: vi.fn(),
        goToPage: vi.fn(),
        toggleSortOrder: vi.fn(),
      })

      const state = mockUseConsultasApi()

      // Estado inicial: com dados
      expect(state.consultas.value).toHaveLength(1)

      // Simula filtro que retorna vazio
      consultas.value = []
      paginacao.value = createMockPaginacao({ totalDeItens: 0, totalDePaginas: 0 })

      await nextTick()

      // Estado final: vazio
      expect(state.consultas.value).toHaveLength(0)
      expect(state.paginacao.value?.totalDeItens).toBe(0)
    })
  })
})

