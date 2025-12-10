export interface PaginationParams {
  paginaAtual: number
  itensPorPagina: number
  totalDeItens: number
}

export interface PaginationUrlParams {
  baseUrl: string
  paginaAtual: number
  totalDePaginas: number
  queryParams?: Record<string, string | undefined>
}