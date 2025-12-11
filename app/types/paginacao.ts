export interface Paginacao {
  paginaAtual: number
  itensPorPagina: number
  totalDePaginas: number
  totalDeItens: number
  nextPageUrl: string | null
  prevPageUrl: string | null
}