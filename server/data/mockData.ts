import { dynamicDataGenerate } from "../utils/dynamicDataGenerate"
import type { Consulta } from '~/types/consultasResponse'

export const mockConsultas: Consulta[] = [
  {
    id: 1,
    medico: { nome: 'Afonso Silva' },
    paciente: { nome: 'Gustavo Santos', dataNascimento: '2023-08-21' },
    convenio: { id: 1, nome: 'Unimed' },
    dataCriacao: '2024-09-20T12:00:00Z',
  },
  {
    id: 2,
    medico: { nome: 'Fernando Gomes' },
    paciente: { nome: 'Jurandir Souza', dataNascimento: '1999-08-21' },
    convenio: { id: 2, nome: 'Bradesco' },
    dataCriacao: '2024-09-20T12:00:00Z',
  },
  {
    id: 3,
    medico: { nome: 'Maria Costa' },
    paciente: { nome: 'Ana Paula', dataNascimento: '1985-03-15' },
    convenio: { id: 1, nome: 'Unimed' },
    dataCriacao: '2024-09-21T10:30:00Z',
  },
  {
    id: 4,
    medico: { nome: 'Eder Silva' },
    paciente: { nome: 'Carlos Eduardo', dataNascimento: '1990-07-10' },
    convenio: { id: 5, nome: 'SulAmérica' },
    dataCriacao: '2024-09-22T14:00:00Z',
  },
  ...dynamicDataGenerate(50)
]