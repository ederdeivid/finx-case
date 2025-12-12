import type { Consulta } from '~/types/consultasResponse'
import type { ConsultasRequestParams } from '~/types/consultasRequestParams'
import stringNormalize from '#shared/utils/stringNormalize'

type FilterFn = (consulta: Consulta, value: string) => boolean

export function applyFilters(data: Consulta[], filtros: ConsultasRequestParams): Consulta[] {
  let result = [...data]

  // Filtros de texto simples
  const textFilterKeys = ['nomeMedico', 'nomePaciente', 'dataCriacao'] as const

  for (const key of textFilterKeys) {
    const value = filtros[key]
    const strategy = filterStrategies[key]

    if (value && strategy) {
      result = result.filter((consulta) => strategy(consulta, value))
    }
  }

  // Filtro de convênios (array)
  if (filtros.nomeConvenio && filtros.nomeConvenio.length > 0) {
    const conveniosNormalized = filtros.nomeConvenio.map(c => stringNormalize(c))
    result = result.filter((consulta) => {
      const convenioNormalized = stringNormalize(consulta.convenio.nome)
      return conveniosNormalized.some(c => convenioNormalized.includes(c))
    })
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

  dataCriacao: (consulta, value) =>
    consulta.dataCriacao.startsWith(value),
}

function regexBuilder(value: string) {
  const normalized = stringNormalize(value)
  return new RegExp(normalized, 'gi')
}