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
    class="hidden flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:flex dark:border-slate-700 dark:bg-slate-800"
    role="region"
    aria-label="Tabela de consultas"
  >
    <div class="max-h-[calc(100vh-380px)] min-h-[400px] overflow-auto">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700" role="grid">
        <thead class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800/95">
          <tr>
            <th
              scope="col"
              class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Paciente
            </th>
            <th
              scope="col"
              class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Médico
            </th>
            <th
              scope="col"
              class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Convênio
            </th>
            <th
              scope="col"
              class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Data de Criação
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-700/50 dark:bg-slate-800">
          <tr
            v-for="consulta in props.consultas"
            :key="consulta.id"
            class="cursor-pointer transition-colors hover:bg-[#E8F7F9]/50 focus-within:bg-[#E8F7F9]/50 dark:hover:bg-slate-700/30 dark:focus-within:bg-slate-700/30"
            tabindex="0"
            role="row"
            :aria-label="`Consulta de ${consulta.paciente.nome} com ${consulta.medico.nome}. Clique para ver detalhes.`"
            @click="handleRowClick(consulta)"
            @keydown="handleRowKeydown($event, consulta)"
          >
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center">
                <div
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F7F9] dark:bg-[#1B9AAA]/20"
                  aria-hidden="true"
                >
                  <span class="text-sm font-medium text-[#1B9AAA] dark:text-[#22B8CC]">
                    {{ consulta.paciente.nome.charAt(0) }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-slate-800 dark:text-white">
                    {{ consulta.paciente.nome }}
                  </div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">
                    {{ calculateAge(consulta.paciente.dataNascimento) }} anos
                  </div>
                </div>
              </div>
            </td>

            <td class="whitespace-nowrap px-6 py-4">
              <div class="text-sm font-medium text-slate-800 dark:text-white">
                {{ consulta.medico.nome }}
              </div>
            </td>

            <td class="whitespace-nowrap px-6 py-4">
              <span class="inline-flex rounded-full bg-[#E8F7F9] px-2.5 py-1 text-xs font-medium text-[#147885] dark:bg-[#1B9AAA]/20 dark:text-[#22B8CC]">
                {{ consulta.convenio.nome }}
              </span>
            </td>

            <td class="whitespace-nowrap px-6 py-4">
              <div class="text-sm text-slate-600 dark:text-slate-300">
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
