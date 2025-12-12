<script setup lang="ts">
interface Props {
  direction: 'prev' | 'next'
  disabled?: boolean
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  showLabel: false,
})

const emit = defineEmits<{
  'click': []
}>()

const ariaLabel = computed(() => props.direction === 'prev' ? 'Página anterior' : 'Próxima página')
</script>

<template>
  <button
    type="button"
    :disabled="props.disabled"
    :aria-label="ariaLabel"
    class="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white text-slate-500 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-finx-primary/50 disabled:cursor-not-allowed disabled:opacity-50 h-9 w-9 lg:h-9 lg:w-9"
    :class="props.showLabel && 'h-10 flex-1 px-3 text-sm font-medium text-slate-600 sm:flex-none sm:px-4'"
    @click="emit('click')"
  >
    <svg
      v-if="props.direction === 'prev'"
      class="h-4 w-4 lg:h-5 lg:w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 19l-7-7 7-7"
      />
    </svg>

    <svg
      v-if="props.direction === 'next'"
      class="h-4 w-4 lg:h-5 lg:w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
</template>
