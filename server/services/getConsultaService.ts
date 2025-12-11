import type { ConsultasRequestParams } from "~/types/consultasRequestParams"
import { mockConsultas } from "../data/mockData"
import { applyFilters } from "../utils/filters"
import { buildNavigationUrls, calculatePagination, sliceForPage } from "../utils/pagination"
import type { ConsultasResponse } from "~/types/consultasResponse"

const BASE_URL = '/api/consultas'

export default async function getConsultaService (query: ConsultasRequestParams): Promise<ConsultasResponse> {
  const allData = mockConsultas
  const filteredData = applyFilters(allData, query)

  const { paginaAtual = 1, itensPorPagina = 15 } = query

  const paginationBase = calculatePagination({
    paginaAtual,
    itensPorPagina,
    totalDeItens: filteredData.length,
  })

  const navigationUrls = buildNavigationUrls({
    baseUrl: BASE_URL,
    paginaAtual,
    totalDePaginas: paginationBase.totalDePaginas,
    queryParams: buildQueryParamsForUrl(query),
  })

  const paginatedData = sliceForPage(filteredData, paginaAtual, itensPorPagina)

  return {
    data: paginatedData,
    paginacao: {
      ...paginationBase,
      ...navigationUrls,
    },
  }
}

function buildQueryParamsForUrl(filtros: ConsultasRequestParams): Record<string, string | undefined> {
  return {
    itensPorPagina: String(filtros.itensPorPagina || 15),
    dataCriacao: filtros.dataCriacao,
    nomeConvenio: filtros.nomeConvenio,
    nomeMedico: filtros.nomeMedico,
    nomePaciente: filtros.nomePaciente,
    paginaAtual: String(filtros.paginaAtual || 1)
  }
}