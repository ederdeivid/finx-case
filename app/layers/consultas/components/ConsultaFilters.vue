<script setup lang="ts">
import type { Convenio } from '~/types/consultasResponse'

interface Props {
  convenios: Convenio[]
  totalResults: number
  isLoading?: boolean
  sortOrder?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  sortOrder: 'desc',
})

const emit = defineEmits<{
  'clear': []
  'toggle-sort': []
}>()

const nomeMedico = defineModel<string>('nomeMedico', { required: true })
const nomePaciente = defineModel<string>('nomePaciente', { required: true })
const nomeConvenio = defineModel<string[]>('nomeConvenio', { required: true })

const convenioOptions = computed(() =>
  props.convenios.map(convenio => ({ id: convenio.nome, nome: convenio.nome }))
)

function handleConvenioUpdate(values: (string | number)[]) {
  nomeConvenio.value = values.map(String)
}

function handleClear() {
  emit('clear')
}

const hasActiveFilters = computed(() =>
  nomeMedico.value || nomePaciente.value || nomeConvenio.value.length > 0
)
</script>

<template>
  <section
    class="relative z-20 mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:mb-6 sm:p-4 lg:p-5"
    aria-label="Filtros de pesquisa"
  >
    <div class="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end">
      <SearchInput
        id="search-paciente"
        v-model="nomePaciente"
        label="Buscar por paciente"
        placeholder="Nome do paciente..."
      />

      <SearchInput
        id="search-medico"
        v-model="nomeMedico"
        label="Buscar por médico"
        placeholder="Nome do médico..."
      />

      <div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <MultiSelectDropdown
          id="convenio-select"
          :model-value="nomeConvenio"
          :options="convenioOptions"
          label="Convênio"
          placeholder="Todos os convênios"
          @update:model-value="handleConvenioUpdate"
        />

        <div class="flex items-end">
          <ClearButton
            :disabled="!hasActiveFilters"
            label="Limpar"
            @click="handleClear"
          />
        </div>
      </div>
    </div>

    <div class="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
      <ResultsCounter
        :count="props.totalResults"
        :is-loading="props.isLoading"
        singular-label="consulta encontrada"
        plural-label="consultas encontradas"
      />

      <SortButton
        :order="props.sortOrder"
        field-label="data de criação"
        @toggle="emit('toggle-sort')"
      />
    </div>
  </section>
</template>
