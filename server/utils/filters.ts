import type { Consulta } from '~/types/consultasResponse'
import type { ConsultasRequestParams } from '~/types/consultasRequestParams'
import stringNormalize from '#shared/utils/stringNormalize'

type FilterFn = (consulta: Consulta, value: string) => boolean

export function applyFilters(data: Consulta[], filtros: ConsultasRequestParams): Consulta[] {
  let result = [...data]
  const filterKeys = ['nomeMedico', 'nomePaciente', 'nomeConvenio', 'dataCriacao'] as const

  for (const key of filterKeys) {
    const value = filtros[key]
    const strategy = filterStrategies[key]

    if (value && strategy) {
      result = result.filter((consulta) => strategy(consulta, value))
    }
  }

  return result
}

const filterStrategies: Record<string, FilterFn> = {
  nomeMedico: (consulta, value) => {
    const regex = regexBuilder(value)
    return regex.test(stringNormalize(consulta.medico.nome))
  },

  nomePaciente: (consulta, value) => {
    const regex = regexBuilder(value)
    return regex.test(stringNormalize(consulta.paciente.nome))
  },

  nomeConvenio: (consulta, value) => {
    const regex = regexBuilder(value)
    return regex.test(stringNormalize(consulta.convenio.nome))
  },

  dataCriacao: (consulta, value) =>
    consulta.dataCriacao.startsWith(value),
}

function regexBuilder(value: string) {
  const normalized = stringNormalize(value)
  return new RegExp(normalized, 'gi')
}