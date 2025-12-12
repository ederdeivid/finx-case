import type { Consulta, Convenio } from '~/types/consultasResponse'

const convenios: Convenio[] = [
  { id: 1, nome: "Unimed" },
  { id: 2, nome: "Bradesco" },
  { id: 3, nome: "Amil" },
  { id: 4, nome: "MedSenior" },
  { id: 5, nome: "SulAmérica" },
];

export function dynamicDataGenerate(amount: number): Consulta[] {
  return Array.from({ length: amount }, (_, i) => {
    const index = i + 1

    return {
      id: 1000 + index,
      medico: { nome: `Medico ${index}` },
      paciente: {
        nome: `Paciente ${index}`,
        dataNascimento: normalizeBirthDate()
      },
      convenio: randomConvenio(),
      dataCriacao: randomDateGenerate(2015, 2023),
    };
  });
}

function randomDateGenerate(minYear = 1950, maxYear = 2000): string {
  const start = new Date(minYear, 0, 1).getTime()
  const end = new Date(maxYear, 11, 31).getTime()
  const timestamp = Math.floor(Math.random() * (end - start) + start)
  return new Date(timestamp).toISOString()
}

function normalizeBirthDate(): string {
  return randomDateGenerate().split("T")[0] as string
}

function randomConvenio(): Convenio {
  const index = Math.floor(Math.random() * convenios.length);
  return convenios[index] as Convenio;
}