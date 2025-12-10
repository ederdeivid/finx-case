import type { Paginacao } from "./paginacao"

export interface ConsultasResponse {
  data: Consulta[]
  paginacao: Paginacao
}

export interface Consulta {
  id: number
  medico: Medico
  paciente: Paciente
  convenio: Convenio
  dataCriacao: string
}

export interface Medico {
  nome: string
}

export interface Paciente {
  nome: string
  dataNascimento: string
}

export interface Convenio {
  id: number
  nome: string
}