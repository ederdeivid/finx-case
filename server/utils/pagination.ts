/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Paginacao } from '~/types/paginacao'
import type { PaginationParams, PaginationUrlParams } from '~/types/paginationParams'
import queryString from '#shared/utils/queryString'

export function calculatePagination(params: PaginationParams): Omit<Paginacao, 'nextPageUrl' | 'prevPageUrl'> {
  const { paginaAtual = 1, itensPorPagina = 15, totalDeItens } = params
  const totalDePaginas = Math.ceil(totalDeItens / itensPorPagina)

  return {
    paginaAtual: Number(paginaAtual),
    itensPorPagina,
    totalDePaginas,
    totalDeItens,
  }
}

export function buildNavigationUrls(params: PaginationUrlParams): Pick<Paginacao, 'nextPageUrl' | 'prevPageUrl'> {
  const { baseUrl, paginaAtual = 1, totalDePaginas, queryParams } = params

  return {
    nextPageUrl: makePageUrl(Number(paginaAtual) + 1, totalDePaginas, baseUrl, queryParams as Record<string, never>),
    prevPageUrl: makePageUrl(Number(paginaAtual) - 1, totalDePaginas, baseUrl, queryParams as Record<string, never>),
  }
}

function makePageUrl(page: number, total: number, baseUrl: string, queryParams?: Record<string, never>) {
  if (page < 1 || page > total) return null
  return buildPageUrl(page, baseUrl, queryParams)
}

export function buildPageUrl(page: number, baseUrl: string, queryParams?: Record<string, any>): string {
  queryParams = { ...queryParams, paginaAtual: page }
  const searchQuery = queryString(queryParams as Record<string, never>)
  return `${baseUrl}?${searchQuery}`
}

export function sliceForPage<T>(items: T[], paginaAtual: number, itensPorPagina: number): T[] {
  const startIndex = (paginaAtual - 1) * itensPorPagina
  const endIndex = startIndex + itensPorPagina
  return items.slice(startIndex, endIndex)
}

