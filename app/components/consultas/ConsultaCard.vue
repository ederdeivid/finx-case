<script setup lang="ts">
import type { Consulta } from '~/types/consultasResponse'

interface Props {
  consulta: Consulta
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
})

const emit = defineEmits<{
  'click': [consulta: Consulta]
}>()

const { calculateAge } = usePatientAge()
const { formatDateTime } = useDateFormat()

function handleKeydown(event: KeyboardEvent) {
  if (props.clickable && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    handleClick()
  }
}

function handleClick() {
  if (!props.clickable) return
  emit('click', props.consulta)
}
</script>

<template>
  <article
    :class="[
      'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800',
      props.clickable && 'cursor-pointer transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-[#1B9AAA]/50'
    ]"
    :tabindex="props.clickable ? 0 : undefined"
    :role="props.clickable ? 'button' : undefined"
    :aria-label="props.clickable ? `Ver detalhes da consulta de ${props.consulta.paciente.nome} com ${props.consulta.medico.nome}` : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
      <div class="flex items-center gap-3">
        <div
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F7F9] sm:h-10 sm:w-10 dark:bg-[#1B9AAA]/20"
          aria-hidden="true"
        >
          <span class="text-sm font-medium text-[#1B9AAA] dark:text-[#22B8CC]">
            {{ props.consulta.paciente.nome.charAt(0) }}
          </span>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-slate-800 sm:text-base dark:text-white">
            {{ props.consulta.paciente.nome }}
          </h3>
          <p class="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            {{ calculateAge(props.consulta.paciente.dataNascimento) }} anos
          </p>
        </div>
      </div>
      <span class="inline-flex rounded-full bg-[#E8F7F9] px-2 py-0.5 text-xs font-medium text-[#147885] sm:px-2.5 sm:py-1 dark:bg-[#1B9AAA]/20 dark:text-[#22B8CC]">
        {{ props.consulta.convenio.nome }}
      </span>
    </div>

    <dl class="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4">
      <div>
        <dt class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Médico
        </dt>
        <dd class="mt-1 text-sm font-medium text-slate-700 dark:text-white">
          {{ props.consulta.medico.nome }}
        </dd>
      </div>

      <div>
        <dt class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Data de Criação
        </dt>
        <dd class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          <time :datetime="props.consulta.dataCriacao">
            {{ formatDateTime(props.consulta.dataCriacao) }}
          </time>
        </dd>
      </div>
    </dl>
  </article>
</template>

