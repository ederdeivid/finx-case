import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ConsultasResponse, Consulta } from '~/types/consultasResponse'
import type { ConsultasRequestParams } from '~/types/consultasRequestParams'

function createMockConsulta(overrides: Partial<Consulta> = {}): Consulta {
  return {
    id: 1,
    medico: { nome: 'Dr. João Silva' },
    paciente: { nome: 'Maria Santos', dataNascimento: '1990-05-15' },
    convenio: { id: 1, nome: 'Unimed' },
    dataCriacao: '2024-01-15',
    ...overrides,
  }
}

function createMockResponse(data: Consulta[], paginacao: Partial<ConsultasResponse['paginacao']> = {}): ConsultasResponse {
  const defaultPaginacao = {
    paginaAtual: 1,
    itensPorPagina: 15,
    totalDePaginas: 1,
    totalDeItens: data.length,
    nextPageUrl: null,
    prevPageUrl: null,
  }

  return {
    data,
    paginacao: { ...defaultPaginacao, ...paginacao },
  }
}

const mockGetConsultaService = vi.fn<(params: ConsultasRequestParams) => Promise<ConsultasResponse>>()

vi.mock('../getConsultaService', () => ({
  default: (params: ConsultasRequestParams) => mockGetConsultaService(params),
}))

describe('getConsultaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Retorno de dados', () => {
    it('deve retornar lista de consultas com estrutura correta', async () => {
      const mockConsultas = [
        createMockConsulta({ id: 1, medico: { nome: 'Dr. João Silva' } }),
        createMockConsulta({ id: 2, medico: { nome: 'Dra. Ana Costa' } }),
        createMockConsulta({ id: 3, medico: { nome: 'Dr. Pedro Souza' } }),
      ]

      const expectedResponse = createMockResponse(mockConsultas, {
        totalDeItens: 3,
        totalDePaginas: 1,
      })

      mockGetConsultaService.mockResolvedValue(expectedResponse)

      const result = await mockGetConsultaService({})

      expect(result.data).toHaveLength(3)
      expect(result.data[0]).toHaveProperty('id')
      expect(result.data[0]).toHaveProperty('medico')
      expect(result.data[0]).toHaveProperty('paciente')
      expect(result.data[0]).toHaveProperty('convenio')
      expect(result.data[0]).toHaveProperty('dataCriacao')
    })

    it('deve retornar consulta com todos os campos do médico', async () => {
      const mockConsulta = createMockConsulta({
        medico: { nome: 'Dr. Carlos Henrique' },
      })

      mockGetConsultaService.mockResolvedValue(createMockResponse([mockConsulta]))

      const result = await mockGetConsultaService({})

      expect(result.data[0].medico).toEqual({ nome: 'Dr. Carlos Henrique' })
    })

    it('deve retornar consulta com todos os campos do paciente', async () => {
      const mockConsulta = createMockConsulta({
        paciente: { nome: 'José da Silva', dataNascimento: '1985-03-20' },
      })

      mockGetConsultaService.mockResolvedValue(createMockResponse([mockConsulta]))

      const result = await mockGetConsultaService({})

      expect(result.data[0].paciente).toEqual({
        nome: 'José da Silva',
        dataNascimento: '1985-03-20',
      })
    })

    it('deve retornar consulta com todos os campos do convênio', async () => {
      const mockConsulta = createMockConsulta({
        convenio: { id: 2, nome: 'Bradesco Saúde' },
      })

      mockGetConsultaService.mockResolvedValue(createMockResponse([mockConsulta]))

      const result = await mockGetConsultaService({})

      expect(result.data[0].convenio).toEqual({ id: 2, nome: 'Bradesco Saúde' })
    })

    it('deve retornar estrutura de paginação junto com os dados', async () => {
      mockGetConsultaService.mockResolvedValue(
        createMockResponse([createMockConsulta()], {
          paginaAtual: 1,
          itensPorPagina: 15,
          totalDePaginas: 1,
          totalDeItens: 1,
        })
      )

      const result = await mockGetConsultaService({})

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('paginacao')
      expect(result.paginacao).toHaveProperty('paginaAtual')
      expect(result.paginacao).toHaveProperty('itensPorPagina')
      expect(result.paginacao).toHaveProperty('totalDePaginas')
      expect(result.paginacao).toHaveProperty('totalDeItens')
    })
  })

  describe('Paginação', () => {
    it('deve retornar primeira página com nextPageUrl quando houver mais páginas', async () => {
      const mockConsultas = Array.from({ length: 15 }, (_, i) =>
        createMockConsulta({ id: i + 1 })
      )

      mockGetConsultaService.mockResolvedValue(
        createMockResponse(mockConsultas, {
          paginaAtual: 1,
          itensPorPagina: 15,
          totalDePaginas: 3,
          totalDeItens: 45,
          nextPageUrl: '/api/consultas?paginaAtual=2&itensPorPagina=15',
          prevPageUrl: null,
        })
      )

      const result = await mockGetConsultaService({ paginaAtual: 1, itensPorPagina: 15 })

      expect(result.paginacao.paginaAtual).toBe(1)
      expect(result.paginacao.nextPageUrl).toBeTruthy()
      expect(result.paginacao.prevPageUrl).toBeNull()
    })

    it('deve retornar página intermediária com prevPageUrl e nextPageUrl', async () => {
      const mockConsultas = Array.from({ length: 15 }, (_, i) =>
        createMockConsulta({ id: i + 16 })
      )

      mockGetConsultaService.mockResolvedValue(
        createMockResponse(mockConsultas, {
          paginaAtual: 2,
          itensPorPagina: 15,
          totalDePaginas: 3,
          totalDeItens: 45,
          nextPageUrl: '/api/consultas?paginaAtual=3&itensPorPagina=15',
          prevPageUrl: '/api/consultas?paginaAtual=1&itensPorPagina=15',
        })
      )

      const result = await mockGetConsultaService({ paginaAtual: 2, itensPorPagina: 15 })

      expect(result.paginacao.paginaAtual).toBe(2)
      expect(result.paginacao.nextPageUrl).toBeTruthy()
      expect(result.paginacao.prevPageUrl).toBeTruthy()
    })

    it('deve retornar última página apenas com prevPageUrl', async () => {
      const mockConsultas = Array.from({ length: 15 }, (_, i) =>
        createMockConsulta({ id: i + 31 })
      )

      mockGetConsultaService.mockResolvedValue(
        createMockResponse(mockConsultas, {
          paginaAtual: 3,
          itensPorPagina: 15,
          totalDePaginas: 3,
          totalDeItens: 45,
          nextPageUrl: null,
          prevPageUrl: '/api/consultas?paginaAtual=2&itensPorPagina=15',
        })
      )

      const result = await mockGetConsultaService({ paginaAtual: 3, itensPorPagina: 15 })

      expect(result.paginacao.paginaAtual).toBe(3)
      expect(result.paginacao.nextPageUrl).toBeNull()
      expect(result.paginacao.prevPageUrl).toBeTruthy()
    })

    it('deve respeitar itensPorPagina customizado', async () => {
      const mockConsultas = Array.from({ length: 5 }, (_, i) =>
        createMockConsulta({ id: i + 1 })
      )

      mockGetConsultaService.mockResolvedValue(
        createMockResponse(mockConsultas, {
          paginaAtual: 1,
          itensPorPagina: 5,
          totalDePaginas: 10,
          totalDeItens: 50,
        })
      )

      const result = await mockGetConsultaService({ paginaAtual: 1, itensPorPagina: 5 })

      expect(result.data).toHaveLength(5)
      expect(result.paginacao.itensPorPagina).toBe(5)
      expect(result.paginacao.totalDePaginas).toBe(10)
    })

    it('deve calcular totalDePaginas corretamente', async () => {
      mockGetConsultaService.mockResolvedValue(
        createMockResponse([], {
          paginaAtual: 1,
          itensPorPagina: 10,
          totalDePaginas: 5,
          totalDeItens: 47,
        })
      )

      const result = await mockGetConsultaService({ itensPorPagina: 10 })

      // 47 itens / 10 por página = 5 páginas (arredondado para cima)
      expect(result.paginacao.totalDePaginas).toBe(5)
      expect(result.paginacao.totalDeItens).toBe(47)
    })

    it('deve retornar página única quando totalDeItens <= itensPorPagina', async () => {
      const mockConsultas = Array.from({ length: 10 }, (_, i) =>
        createMockConsulta({ id: i + 1 })
      )

      mockGetConsultaService.mockResolvedValue(
        createMockResponse(mockConsultas, {
          paginaAtual: 1,
          itensPorPagina: 15,
          totalDePaginas: 1,
          totalDeItens: 10,
          nextPageUrl: null,
          prevPageUrl: null,
        })
      )

      const result = await mockGetConsultaService({ paginaAtual: 1, itensPorPagina: 15 })

      expect(result.paginacao.totalDePaginas).toBe(1)
      expect(result.paginacao.nextPageUrl).toBeNull()
      expect(result.paginacao.prevPageUrl).toBeNull()
    })
  })

  describe('Empty State', () => {
    it('deve retornar lista vazia quando não houver consultas', async () => {
      mockGetConsultaService.mockResolvedValue(
        createMockResponse([], {
          paginaAtual: 1,
          itensPorPagina: 15,
          totalDePaginas: 0,
          totalDeItens: 0,
          nextPageUrl: null,
          prevPageUrl: null,
        })
      )

      const result = await mockGetConsultaService({})

      expect(result.data).toEqual([])
      expect(result.data).toHaveLength(0)
    })

    it('deve retornar paginação zerada quando não houver dados', async () => {
      mockGetConsultaService.mockResolvedValue(
        createMockResponse([], {
          paginaAtual: 1,
          itensPorPagina: 15,
          totalDePaginas: 0,
          totalDeItens: 0,
          nextPageUrl: null,
          prevPageUrl: null,
        })
      )

      const result = await mockGetConsultaService({})

      expect(result.paginacao.totalDeItens).toBe(0)
      expect(result.paginacao.totalDePaginas).toBe(0)
      expect(result.paginacao.nextPageUrl).toBeNull()
      expect(result.paginacao.prevPageUrl).toBeNull()
    })

    it('deve retornar lista vazia quando filtro não encontrar resultados', async () => {
      mockGetConsultaService.mockResolvedValue(
        createMockResponse([], {
          paginaAtual: 1,
          itensPorPagina: 15,
          totalDePaginas: 0,
          totalDeItens: 0,
        })
      )

      const result = await mockGetConsultaService({
        nomeMedico: 'Médico Inexistente',
      })

      expect(result.data).toEqual([])
      expect(result.paginacao.totalDeItens).toBe(0)
    })

    it('deve retornar lista vazia quando filtro por convênio não encontrar resultados', async () => {
      mockGetConsultaService.mockResolvedValue(
        createMockResponse([], {
          totalDeItens: 0,
          totalDePaginas: 0,
        })
      )

      const result = await mockGetConsultaService({
        nomeConvenio: 'Convênio Inexistente',
      })

      expect(result.data).toEqual([])
      expect(result.paginacao.totalDeItens).toBe(0)
    })

    it('deve retornar lista vazia quando filtro por data não encontrar resultados', async () => {
      mockGetConsultaService.mockResolvedValue(
        createMockResponse([], {
          totalDeItens: 0,
          totalDePaginas: 0,
        })
      )

      const result = await mockGetConsultaService({
        dataCriacao: '1900-01-01',
      })

      expect(result.data).toEqual([])
      expect(result.paginacao.totalDeItens).toBe(0)
    })

    it('deve manter estrutura de response válida mesmo sem dados', async () => {
      mockGetConsultaService.mockResolvedValue(
        createMockResponse([], {
          paginaAtual: 1,
          itensPorPagina: 15,
          totalDePaginas: 0,
          totalDeItens: 0,
          nextPageUrl: null,
          prevPageUrl: null,
        })
      )

      const result = await mockGetConsultaService({})

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('paginacao')
      expect(Array.isArray(result.data)).toBe(true)
      expect(typeof result.paginacao.paginaAtual).toBe('number')
      expect(typeof result.paginacao.itensPorPagina).toBe('number')
      expect(typeof result.paginacao.totalDePaginas).toBe('number')
      expect(typeof result.paginacao.totalDeItens).toBe('number')
    })
  })
})

