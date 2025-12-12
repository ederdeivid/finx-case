import type { Convenio } from '~/types/consultasResponse'

const convenios: Convenio[] = [
  { id: 1, nome: 'Unimed' },
  { id: 2, nome: 'Bradesco' },
  { id: 3, nome: 'Amil' },
  { id: 4, nome: 'MedSenior' },
  { id: 5, nome: 'SulAmérica' },
]

export default defineCachedEventHandler((): Convenio[] => {
  return convenios
})
