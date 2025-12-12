<script setup lang="ts">
interface Props {
  disabled?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  label: 'Limpar',
})

const emit = defineEmits<{
  'click': []
}>()
</script>

<template>
  <button
    type="button"
    :disabled="props.disabled"
    class="inline-flex w-full items-center justify-center rounded-lg border border-finx-text bg-finx-text px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-finx-text/80 focus:outline-none focus:ring-2 focus:ring-finx-text/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-4 sm:py-2.5"
    @click="emit('click')"
  >
    {{ props.label }}
  </button>
</template>

