import type { ConsultasRequestParams } from '~/types/consultasRequestParams'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseConsultasQuery(rawQuery: Record<string, any>): ConsultasRequestParams {
  return {
    paginaAtual: parseNumberParam(rawQuery.paginaAtual),
    itensPorPagina: parseNumberParam(rawQuery.itensPorPagina),
    dataCriacao: parseStringParam(rawQuery.dataCriacao),
    nomeMedico: parseStringParam(rawQuery.nomeMedico),
    nomePaciente: parseStringParam(rawQuery.nomePaciente),
    nomeConvenio: parseArrayParam(rawQuery.nomeConvenio),
    ordenarPor: parseStringParam(rawQuery.ordenarPor) as 'dataCriacao' | undefined,
    ordem: parseStringParam(rawQuery.ordem) as 'asc' | 'desc' | undefined,
  }
}

function parseNumberParam(value: unknown): number | undefined {
  if (!value || isNaN(Number(value))) return undefined
  return Number(value)
}

function parseStringParam(value: unknown): string | undefined {
  if (!value) return undefined
  return value as string
}

function parseArrayParam(value: unknown): string[] | undefined {
  if (!value) return undefined

  if (Array.isArray(value)) {
    return value as string[]
  }

  return (value as string).split(',').filter(Boolean)
}
