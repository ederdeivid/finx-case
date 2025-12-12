<script setup lang="ts">
interface Props {
  order: 'asc' | 'desc'
  ascLabel?: string
  descLabel?: string
  fieldLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  ascLabel: 'Mais antigos primeiro',
  descLabel: 'Mais recentes primeiro',
  fieldLabel: 'data de criação',
})

const emit = defineEmits<{
  'toggle': []
}>()

const currentLabel = computed(() =>
  props.order === 'desc' ? props.descLabel : props.ascLabel
)

const ariaLabel = computed(() =>
  `Ordenar por ${props.fieldLabel}. Atualmente: ${currentLabel.value}`
)
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-finx-text focus:outline-none focus:text-finx-text sm:text-sm"
    :aria-label="ariaLabel"
    @click="emit('toggle')"
  >
    <svg
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
      />
    </svg>
    <span>{{ currentLabel }}</span>

    <IconsArrowDownIcon class="h-4 w-4" :is-open="Boolean(props.order === 'asc')" />
  </button>
</template>

