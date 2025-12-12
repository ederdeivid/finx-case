import type { Consulta } from '~/types/consultasResponse'
import { mockConsultas } from '../../data/mockData'

export default defineEventHandler((event): Consulta | null => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido',
    })
  }

  const consulta = mockConsultas.find(c => c.id === id)

  if (!consulta) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Consulta não encontrada',
    })
  }

  return consulta
})

