import type { ConsultasRequestParams } from "~/types/consultasRequestParams";
import type { ConsultasResponse } from "~/types/consultasResponse";
import getConsultaService from "../services/getConsultaService";

export default defineCachedEventHandler(async (event): Promise<ConsultasResponse> => {
  await sleep(1000)
  const query = getQuery<ConsultasRequestParams>(event)
  const response = getConsultaService(query)

  return response
},
  {
    maxAge: 60,
    name: 'consultas-cache',
    getKey: (event) => {
      const query = getQuery(event);
      return `consultas-${JSON.stringify(query)}`;
    }
  }
)