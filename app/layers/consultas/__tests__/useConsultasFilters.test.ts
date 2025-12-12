import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { ConsultasRequestParams } from '~/types/consultasRequestParams'

describe('useConsultasFilters - Lógica de Filtros', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Valores padrão', () => {
    it('deve ter paginaAtual = 1 como padrão', () => {
      const defaultFilters: ConsultasRequestParams = {
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      }

      expect(defaultFilters.paginaAtual).toBe(1)
    })

    it('deve ter itensPorPagina = 15 como padrão', () => {
      const defaultFilters: ConsultasRequestParams = {
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      }

      expect(defaultFilters.itensPorPagina).toBe(15)
    })

    it('deve ter ordem = desc como padrão', () => {
      const defaultFilters: ConsultasRequestParams = {
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      }

      expect(defaultFilters.ordem).toBe('desc')
    })

    it('deve ter ordenarPor = dataCriacao como padrão', () => {
      const defaultFilters: ConsultasRequestParams = {
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      }

      expect(defaultFilters.ordenarPor).toBe('dataCriacao')
    })

    it('filtros opcionais devem ser undefined por padrão', () => {
      const defaultFilters: ConsultasRequestParams = {
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      }

      expect(defaultFilters.nomeMedico).toBeUndefined()
      expect(defaultFilters.nomePaciente).toBeUndefined()
      expect(defaultFilters.nomeConvenio).toBeUndefined()
      expect(defaultFilters.dataCriacao).toBeUndefined()
    })
  })

  describe('Lógica de updateFilters', () => {
    it('deve resetar página para 1 ao atualizar outros filtros', () => {
      const filters = ref<ConsultasRequestParams>({
        paginaAtual: 5,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      })

      const updateFilters = (newFilters: Partial<ConsultasRequestParams>) => {
        const isPageChange = Object.keys(newFilters).length === 1 && 'paginaAtual' in newFilters

        filters.value = {
          ...filters.value,
          ...newFilters,
          paginaAtual: isPageChange ? newFilters.paginaAtual! : 1,
        }
      }

      updateFilters({ nomeMedico: 'Dr. João' })

      expect(filters.value.nomeMedico).toBe('Dr. João')
      expect(filters.value.paginaAtual).toBe(1)
    })

    it('deve manter página ao atualizar apenas paginaAtual', () => {
      const filters = ref<ConsultasRequestParams>({
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      })

      const updateFilters = (newFilters: Partial<ConsultasRequestParams>) => {
        const isPageChange = Object.keys(newFilters).length === 1 && 'paginaAtual' in newFilters

        filters.value = {
          ...filters.value,
          ...newFilters,
          paginaAtual: isPageChange ? newFilters.paginaAtual! : 1,
        }
      }

      updateFilters({ paginaAtual: 3 })

      expect(filters.value.paginaAtual).toBe(3)
    })

    it('deve mesclar novos filtros com existentes', () => {
      const filters = ref<ConsultasRequestParams>({
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
        nomeMedico: 'Dr. João',
      })

      const updateFilters = (newFilters: Partial<ConsultasRequestParams>) => {
        const isPageChange = Object.keys(newFilters).length === 1 && 'paginaAtual' in newFilters

        filters.value = {
          ...filters.value,
          ...newFilters,
          paginaAtual: isPageChange ? newFilters.paginaAtual! : 1,
        }
      }

      updateFilters({ nomePaciente: 'Maria' })

      expect(filters.value.nomeMedico).toBe('Dr. João')
      expect(filters.value.nomePaciente).toBe('Maria')
    })
  })

  describe('Lógica de clearFilters', () => {
    it('deve limpar todos os filtros para valores padrão', () => {
      const filters = ref<ConsultasRequestParams>({
        paginaAtual: 5,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'asc',
        nomeMedico: 'Dr. João',
        nomePaciente: 'Maria',
        nomeConvenio: ['Unimed', 'Bradesco'],
        dataCriacao: '2024-01-01',
      })

      const clearFilters = () => {
        filters.value = {
          paginaAtual: 1,
          itensPorPagina: 15,
          ordenarPor: 'dataCriacao',
          ordem: 'desc',
          nomeMedico: undefined,
          nomePaciente: undefined,
          nomeConvenio: undefined,
          dataCriacao: undefined,
        }
      }

      clearFilters()

      expect(filters.value.paginaAtual).toBe(1)
      expect(filters.value.ordem).toBe('desc')
      expect(filters.value.nomeMedico).toBeUndefined()
      expect(filters.value.nomePaciente).toBeUndefined()
      expect(filters.value.nomeConvenio).toBeUndefined()
      expect(filters.value.dataCriacao).toBeUndefined()
    })
  })

  describe('Lógica de syncFiltersToUrl', () => {
    it('deve criar query vazia para filtros padrão', () => {
      const filters: ConsultasRequestParams = {
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      }

      const buildQuery = (f: ConsultasRequestParams): Record<string, string> => {
        const query: Record<string, string> = {}

        if (f.paginaAtual && f.paginaAtual > 1) {
          query.paginaAtual = String(f.paginaAtual)
        }
        if (f.nomeMedico) query.nomeMedico = f.nomeMedico
        if (f.nomePaciente) query.nomePaciente = f.nomePaciente
        if (f.nomeConvenio?.length) query.nomeConvenio = f.nomeConvenio.join(',')
        if (f.dataCriacao) query.dataCriacao = f.dataCriacao
        if (f.ordem && f.ordem !== 'desc') query.ordem = f.ordem

        return query
      }

      const query = buildQuery(filters)

      expect(Object.keys(query)).toHaveLength(0)
    })

    it('deve incluir apenas filtros com valor', () => {
      const filters: ConsultasRequestParams = {
        paginaAtual: 2,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'asc',
        nomeMedico: 'Dr. João',
        nomeConvenio: ['Unimed'],
      }

      const buildQuery = (f: ConsultasRequestParams): Record<string, string> => {
        const query: Record<string, string> = {}

        if (f.paginaAtual && f.paginaAtual > 1) {
          query.paginaAtual = String(f.paginaAtual)
        }
        if (f.nomeMedico) query.nomeMedico = f.nomeMedico
        if (f.nomePaciente) query.nomePaciente = f.nomePaciente
        if (f.nomeConvenio?.length) query.nomeConvenio = f.nomeConvenio.join(',')
        if (f.dataCriacao) query.dataCriacao = f.dataCriacao
        if (f.ordem && f.ordem !== 'desc') query.ordem = f.ordem

        return query
      }

      const query = buildQuery(filters)

      expect(query.paginaAtual).toBe('2')
      expect(query.nomeMedico).toBe('Dr. João')
      expect(query.nomeConvenio).toBe('Unimed')
      expect(query.ordem).toBe('asc')
      expect(query.nomePaciente).toBeUndefined()
    })

    it('deve juntar nomeConvenio com vírgula', () => {
      const filters: ConsultasRequestParams = {
        paginaAtual: 1,
        itensPorPagina: 15,
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
        nomeConvenio: ['Unimed', 'Bradesco', 'Amil'],
      }

      const buildQuery = (f: ConsultasRequestParams): Record<string, string> => {
        const query: Record<string, string> = {}
        if (f.nomeConvenio?.length) query.nomeConvenio = f.nomeConvenio.join(',')
        return query
      }

      const query = buildQuery(filters)

      expect(query.nomeConvenio).toBe('Unimed,Bradesco,Amil')
    })
  })

  describe('Lógica de getFiltersFromUrl', () => {
    it('deve fazer parse de paginaAtual da URL', () => {
      const urlQuery = { paginaAtual: '3' }

      const parseFilters = (query: Record<string, string>): Partial<ConsultasRequestParams> => {
        return {
          paginaAtual: query.paginaAtual ? Number(query.paginaAtual) : 1,
        }
      }

      const filters = parseFilters(urlQuery)

      expect(filters.paginaAtual).toBe(3)
    })

    it('deve fazer parse de nomeConvenio separado por vírgula', () => {
      const urlQuery = { nomeConvenio: 'Unimed,Bradesco' }

      const parseFilters = (query: Record<string, string>): Partial<ConsultasRequestParams> => {
        return {
          nomeConvenio: query.nomeConvenio?.split(',').filter(Boolean),
        }
      }

      const filters = parseFilters(urlQuery)

      expect(filters.nomeConvenio).toEqual(['Unimed', 'Bradesco'])
    })

    it('deve retornar valores padrão quando URL está vazia', () => {
      const urlQuery = {}

      const parseFilters = (query: Record<string, string>): ConsultasRequestParams => {
        return {
          paginaAtual: query.paginaAtual ? Number(query.paginaAtual) : 1,
          itensPorPagina: 15,
          ordenarPor: 'dataCriacao',
          ordem: (query.ordem as 'asc' | 'desc') || 'desc',
          nomeMedico: query.nomeMedico || undefined,
          nomePaciente: query.nomePaciente || undefined,
          nomeConvenio: query.nomeConvenio?.split(',').filter(Boolean),
        }
      }

      const filters = parseFilters(urlQuery)

      expect(filters.paginaAtual).toBe(1)
      expect(filters.ordem).toBe('desc')
      expect(filters.nomeMedico).toBeUndefined()
    })
  })
})
