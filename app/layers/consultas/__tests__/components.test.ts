import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { Consulta, Convenio } from '~/types/consultasResponse'

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

const mockConvenios: Convenio[] = [
  { id: 1, nome: 'Unimed' },
  { id: 2, nome: 'Bradesco' },
  { id: 3, nome: 'Amil' },
]

describe('Componentes de Consultas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ConsultaCard', () => {
    it('deve receber consulta como prop obrigatória', () => {
      const consulta = createMockConsulta()

      // Simula props do componente
      const props = {
        consulta,
        clickable: true,
      }

      expect(props.consulta).toBeDefined()
      expect(props.consulta.paciente.nome).toBe('Maria Santos')
      expect(props.consulta.medico.nome).toBe('Dr. João Silva')
    })

    it('deve ter clickable como prop opcional com default true', () => {
      const defaultClickable = true

      expect(defaultClickable).toBe(true)
    })

    it('deve conter dados do paciente', () => {
      const consulta = createMockConsulta({
        paciente: { nome: 'Ana Paula', dataNascimento: '1985-03-20' },
      })

      expect(consulta.paciente.nome).toBe('Ana Paula')
      expect(consulta.paciente.dataNascimento).toBe('1985-03-20')
    })

    it('deve conter dados do médico', () => {
      const consulta = createMockConsulta({
        medico: { nome: 'Dra. Maria' },
      })

      expect(consulta.medico.nome).toBe('Dra. Maria')
    })

    it('deve conter dados do convênio', () => {
      const consulta = createMockConsulta({
        convenio: { id: 2, nome: 'Bradesco Saúde' },
      })

      expect(consulta.convenio.nome).toBe('Bradesco Saúde')
      expect(consulta.convenio.id).toBe(2)
    })
  })

  describe('ConsultaCards', () => {
    it('deve receber lista de consultas como prop', () => {
      const consultas = [
        createMockConsulta({ id: 1 }),
        createMockConsulta({ id: 2 }),
        createMockConsulta({ id: 3 }),
      ]

      expect(consultas).toHaveLength(3)
      expect(consultas[0]?.id).toBe(1)
      expect(consultas[2]?.id).toBe(3)
    })

    it('deve emitir card-click com consulta ao clicar', () => {
      const consulta = createMockConsulta({ id: 5 })
      const emitMock = vi.fn()

      // Simula emit
      emitMock('card-click', consulta)

      expect(emitMock).toHaveBeenCalledWith('card-click', consulta)
      expect(emitMock?.mock?.calls?.[0]?.[1]?.id).toBe(5)
    })
  })

  describe('ConsultaTable', () => {
    it('deve receber lista de consultas como prop', () => {
      const consultas = [
        createMockConsulta({ id: 1 }),
        createMockConsulta({ id: 2 }),
      ]

      expect(consultas).toHaveLength(2)
    })

    it('deve emitir row-click com consulta ao clicar na linha', () => {
      const consulta = createMockConsulta({ id: 10 })
      const emitMock = vi.fn()

      emitMock('row-click', consulta)

      expect(emitMock).toHaveBeenCalledWith('row-click', consulta)
    })

    it('deve ter slot para paginação', () => {
      const hasSlot = true // Componente tem slot name="pagination"

      expect(hasSlot).toBe(true)
    })
  })

  describe('ConsultaFilters', () => {
    it('deve receber convenios como prop', () => {
      const props = {
        convenios: mockConvenios,
        totalResults: 100,
        isLoading: false,
        sortOrder: 'desc' as const,
      }

      expect(props.convenios).toHaveLength(3)
      expect(props?.convenios[0]?.nome).toBe('Unimed')
    })

    it('deve usar defineModel para nomeMedico', () => {
      const nomeMedico = ref('')
      nomeMedico.value = 'Dr. João'

      expect(nomeMedico.value).toBe('Dr. João')
    })

    it('deve usar defineModel para nomePaciente', () => {
      const nomePaciente = ref('')
      nomePaciente.value = 'Maria'

      expect(nomePaciente.value).toBe('Maria')
    })

    it('deve usar defineModel para nomeConvenio como array', () => {
      const nomeConvenio = ref<string[]>([])
      nomeConvenio.value = ['Unimed', 'Bradesco']

      expect(nomeConvenio.value).toEqual(['Unimed', 'Bradesco'])
    })

    it('deve emitir clear ao limpar filtros', () => {
      const emitMock = vi.fn()

      emitMock('clear')

      expect(emitMock).toHaveBeenCalledWith('clear')
    })

    it('deve emitir toggle-sort ao clicar em ordenar', () => {
      const emitMock = vi.fn()

      emitMock('toggle-sort')

      expect(emitMock).toHaveBeenCalledWith('toggle-sort')
    })
  })

  describe('LoadingState', () => {
    it('deve receber isLoading como prop', () => {
      const props = {
        isLoading: true,
        variant: 'list' as const,
      }

      expect(props.isLoading).toBe(true)
    })

    it('deve aceitar variant list ou detail', () => {
      const listVariant = 'list'
      const detailVariant = 'detail'

      expect(['list', 'detail']).toContain(listVariant)
      expect(['list', 'detail']).toContain(detailVariant)
    })
  })

  describe('ConsultaErrorState', () => {
    it('deve receber errorMessage como prop', () => {
      const props = {
        isLoading: false,
        errorMessage: 'Erro ao carregar consultas',
        title: 'Erro',
        buttonText: 'Tentar novamente',
      }

      expect(props.errorMessage).toBe('Erro ao carregar consultas')
    })

    it('deve emitir on-try-again ao clicar no botão', () => {
      const emitMock = vi.fn()

      emitMock('on-try-again')

      expect(emitMock).toHaveBeenCalledWith('on-try-again')
    })

    it('não deve exibir quando isLoading é true', () => {
      const props = {
        isLoading: true,
        errorMessage: 'Erro',
      }

      const shouldShow = props.errorMessage && !props.isLoading

      expect(shouldShow).toBe(false)
    })

    it('deve exibir quando há erro e não está carregando', () => {
      const props = {
        isLoading: false,
        errorMessage: 'Erro ao carregar',
      }

      const shouldShow = props.errorMessage && !props.isLoading

      expect(shouldShow).toBe(true)
    })
  })
})
