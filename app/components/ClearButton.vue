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
    class="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1B9AAA]/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-4 sm:py-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
    @click="emit('click')"
  >
    <svg
      class="mr-1.5 h-4 w-4 sm:mr-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clip-rule="evenodd"
      />
    </svg>
    {{ props.label }}
  </button>
</template>

