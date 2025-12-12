import type { ConsultasRequestParams } from "~/types/consultasRequestParams"
import { mockConsultas } from "../data/mockData"
import { applyFilters } from "../utils/filters"
import { buildNavigationUrls, calculatePagination, sliceForPage } from "../utils/pagination"
import type { ConsultasResponse, Consulta } from "~/types/consultasResponse"

const BASE_URL = '/api/consultas'

export default async function getConsultaService (query: ConsultasRequestParams): Promise<ConsultasResponse> {
  const allData = mockConsultas
  const filteredData = applyFilters(allData, query)

  const sortedData = applySorting(filteredData, query)

  const { paginaAtual = 1, itensPorPagina = 15 } = query

  const paginationBase = calculatePagination({
    paginaAtual,
    itensPorPagina,
    totalDeItens: sortedData.length,
  })

  const navigationUrls = buildNavigationUrls({
    baseUrl: BASE_URL,
    paginaAtual,
    totalDePaginas: paginationBase.totalDePaginas,
    queryParams: buildQueryParamsForUrl(query),
  })

  const paginatedData = sliceForPage(sortedData, paginaAtual, itensPorPagina)

  return {
    data: paginatedData,
    paginacao: {
      ...paginationBase,
      ...navigationUrls,
    },
  }
}

function applySorting(data: Consulta[], query: ConsultasRequestParams): Consulta[] {
  const { ordenarPor = 'dataCriacao', ordem = 'desc' } = query

  if (ordenarPor === 'dataCriacao') {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.dataCriacao).getTime()
      const dateB = new Date(b.dataCriacao).getTime()
      return ordem === 'asc' ? dateA - dateB : dateB - dateA
    })
  }

  return data
}

function buildQueryParamsForUrl(filtros: ConsultasRequestParams): Record<string, string | undefined> {
  return {
    itensPorPagina: String(filtros.itensPorPagina || 15),
    dataCriacao: filtros.dataCriacao,
    nomeConvenio: filtros.nomeConvenio?.join(','),
    nomeMedico: filtros.nomeMedico,
    nomePaciente: filtros.nomePaciente,
    paginaAtual: String(filtros.paginaAtual || 1),
    ordenarPor: filtros.ordenarPor,
    ordem: filtros.ordem,
  }
}