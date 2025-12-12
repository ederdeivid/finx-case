<script setup lang="ts">
interface Props {
  isLoading?: boolean
  errorMessage?: string | null
  title?: string
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: '',
  title: 'Erro ao carregar consultas',
  buttonText: 'Tentar novamente',
})

const emit = defineEmits<{
  'on-try-again': []
}>()
</script>

<template>
  <EmptyState
    v-if="props.errorMessage && !props.isLoading"
    :title="props.title"
    :description="props.errorMessage"
    icon="error"
  >
    <button
      type="button"
      class="mt-4 inline-flex items-center rounded-lg bg-finx-text px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-finx-text/80 focus:outline-none focus:ring-2 focus:ring-finx-text/50"
      @click="emit('on-try-again')"
    >
      {{ props.buttonText }}
    </button>
  </EmptyState>
</template>
