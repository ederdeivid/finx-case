import { describe, it, expect } from 'vitest'
import { parseConsultasQuery } from '../parseConsultasQuery'

describe('parseConsultasQuery', () => {
  describe('Parâmetros numéricos', () => {
    it('deve fazer parse de paginaAtual', () => {
      const result = parseConsultasQuery({ paginaAtual: '2' })
      expect(result.paginaAtual).toBe(2)
    })

    it('deve fazer parse de itensPorPagina', () => {
      const result = parseConsultasQuery({ itensPorPagina: '10' })
      expect(result.itensPorPagina).toBe(10)
    })

    it('deve retornar undefined para valores numéricos inválidos', () => {
      const result = parseConsultasQuery({ paginaAtual: 'abc' })
      expect(result.paginaAtual).toBeUndefined()
    })

    it('deve retornar undefined para valores numéricos vazios', () => {
      const result = parseConsultasQuery({ paginaAtual: '' })
      expect(result.paginaAtual).toBeUndefined()
    })
  })

  describe('Parâmetros string', () => {
    it('deve fazer parse de nomeMedico', () => {
      const result = parseConsultasQuery({ nomeMedico: 'Dr. João' })
      expect(result.nomeMedico).toBe('Dr. João')
    })

    it('deve fazer parse de nomePaciente', () => {
      const result = parseConsultasQuery({ nomePaciente: 'Maria Silva' })
      expect(result.nomePaciente).toBe('Maria Silva')
    })

    it('deve fazer parse de dataCriacao', () => {
      const result = parseConsultasQuery({ dataCriacao: '2024-01-15' })
      expect(result.dataCriacao).toBe('2024-01-15')
    })

    it('deve retornar undefined para strings vazias', () => {
      const result = parseConsultasQuery({ nomeMedico: '' })
      expect(result.nomeMedico).toBeUndefined()
    })
  })

  describe('Parâmetros de array (nomeConvenio)', () => {
    it('deve fazer parse de string separada por vírgulas', () => {
      const result = parseConsultasQuery({ nomeConvenio: 'Unimed,Bradesco' })
      expect(result.nomeConvenio).toEqual(['Unimed', 'Bradesco'])
    })

    it('deve fazer parse de valor único', () => {
      const result = parseConsultasQuery({ nomeConvenio: 'Unimed' })
      expect(result.nomeConvenio).toEqual(['Unimed'])
    })

    it('deve fazer parse de array existente', () => {
      const result = parseConsultasQuery({ nomeConvenio: ['Unimed', 'Bradesco'] })
      expect(result.nomeConvenio).toEqual(['Unimed', 'Bradesco'])
    })

    it('deve filtrar valores vazios', () => {
      const result = parseConsultasQuery({ nomeConvenio: 'Unimed,,Bradesco,' })
      expect(result.nomeConvenio).toEqual(['Unimed', 'Bradesco'])
    })

    it('deve retornar undefined para string vazia', () => {
      const result = parseConsultasQuery({ nomeConvenio: '' })
      expect(result.nomeConvenio).toBeUndefined()
    })
  })

  describe('Parâmetros de ordenação', () => {
    it('deve fazer parse de ordenarPor', () => {
      const result = parseConsultasQuery({ ordenarPor: 'dataCriacao' })
      expect(result.ordenarPor).toBe('dataCriacao')
    })

    it('deve fazer parse de ordem desc', () => {
      const result = parseConsultasQuery({ ordem: 'desc' })
      expect(result.ordem).toBe('desc')
    })

    it('deve fazer parse de ordem asc', () => {
      const result = parseConsultasQuery({ ordem: 'asc' })
      expect(result.ordem).toBe('asc')
    })
  })

  describe('Query completa', () => {
    it('deve fazer parse de todos os parâmetros juntos', () => {
      const result = parseConsultasQuery({
        paginaAtual: '2',
        itensPorPagina: '10',
        nomeMedico: 'Dr. João',
        nomePaciente: 'Maria',
        nomeConvenio: 'Unimed,Bradesco',
        dataCriacao: '2024-01-15',
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      })

      expect(result).toEqual({
        paginaAtual: 2,
        itensPorPagina: 10,
        nomeMedico: 'Dr. João',
        nomePaciente: 'Maria',
        nomeConvenio: ['Unimed', 'Bradesco'],
        dataCriacao: '2024-01-15',
        ordenarPor: 'dataCriacao',
        ordem: 'desc',
      })
    })

    it('deve retornar objeto com undefined para query vazia', () => {
      const result = parseConsultasQuery({})

      expect(result).toEqual({
        paginaAtual: undefined,
        itensPorPagina: undefined,
        nomeMedico: undefined,
        nomePaciente: undefined,
        nomeConvenio: undefined,
        dataCriacao: undefined,
        ordenarPor: undefined,
        ordem: undefined,
      })
    })
  })
})

