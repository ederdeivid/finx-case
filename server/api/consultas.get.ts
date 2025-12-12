import type { ConsultasResponse } from '~/types/consultasResponse'
import getConsultaService from '../services/getConsultaService'
import { parseConsultasQuery } from '../utils/parseConsultasQuery'

export default defineCachedEventHandler(async (event): Promise<ConsultasResponse> => {
  await sleep(1000)

  const rawQuery = getQuery(event)
  const query = parseConsultasQuery(rawQuery)
  const response = getConsultaService(query)

  return response
}, {
  maxAge: 60,
  name: 'consultas-cache',
  getKey: (event) => {
    const query = getQuery(event)
    return `consultas-${JSON.stringify(query)}`
  },
})
