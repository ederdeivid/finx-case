<script setup lang="ts">
import type { Consulta } from '~/types/consultasResponse'

interface Props {
  consultas: Consulta[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'row-click': [consulta: Consulta]
}>()

const { calculateAge } = usePatientAge()
const { formatDateTime } = useDateFormat()

function handleRowKeydown(event: KeyboardEvent, consulta: Consulta) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleRowClick(consulta)
  }
}

function handleRowClick(consulta: Consulta) {
  emit('row-click', consulta)
}
</script>

<template>
  <section
    class="hidden flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:flex"
    role="region"
    aria-label="Tabela de consultas"
  >
    <div class="max-h-[calc(100vh-380px)] min-h-100 overflow-auto">
      <table class="min-w-full divide-y divide-slate-200" role="grid">
        <thead class="sticky top-0 z-10 bg-slate-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-finx-text"
            >
              Paciente
            </th>
            <th
              scope="col"
              class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-finx-text"
            >
              Médico
            </th>
            <th
              scope="col"
              class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-finx-text"
            >
              Convênio
            </th>
            <th
              scope="col"
              class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-finx-text"
            >
              Data de Criação
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr
            v-for="consulta in props.consultas"
            :key="consulta.id"
            class="cursor-pointer transition-colors hover:bg-finx-text/10 focus-within:bg-finx-text/10"
            tabindex="0"
            role="row"
            :aria-label="`Consulta de ${consulta.paciente.nome} com ${consulta.medico.nome}. Clique para ver detalhes.`"
            @click="handleRowClick(consulta)"
            @keydown="handleRowKeydown($event, consulta)"
          >
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-finx-text"
                  aria-hidden="true"
                >
                  <span class="text-sm font-medium text-white">
                    {{ consulta.paciente.nome.charAt(0) }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-semibold text-finx-text-primary">
                    {{ consulta.paciente.nome }}
                  </div>
                  <div class="text-sm font-semibold text-finx-text-secondary">
                    {{ calculateAge(consulta.paciente.dataNascimento) }} anos
                  </div>
                </div>
              </div>
            </td>

            <td class="whitespace-nowrap px-6 py-4">
              <div class="text-sm font-semibold text-finx-text-primary">
                {{ consulta.medico.nome }}
              </div>
            </td>

            <td class="whitespace-nowrap px-6 py-4">
              <span class="flex justify-center items-center rounded-full bg-finx-text px-2.5 py-1 text-xs font-semibold text-white w-[75%]">
                {{ consulta.convenio.nome }}
              </span>
            </td>

            <td class="whitespace-nowrap px-6 py-4">
              <div class="text-sm font-semibold text-finx-text-primary">
                <time :datetime="consulta.dataCriacao">
                  {{ formatDateTime(consulta.dataCriacao) }}
                </time>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <slot name="pagination" />
  </section>
</template>
