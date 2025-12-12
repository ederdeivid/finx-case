<script setup lang="ts">
interface Props {
  page: number | string
  isActive?: boolean
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  size: 'sm',
})

const emit = defineEmits<{
  'click': [page: number]
}>()

const isEllipsis = computed(() => props.page === '...')

const sizeClasses = computed(() =>
  props.size === 'md' ? 'h-10 w-10' : 'h-9 w-9'
)

function handleClick() {
  if (!isEllipsis.value) {
    emit('click', props.page as number)
  }
}
</script>

<template>
  <span
    v-if="isEllipsis"
    class="px-2 text-slate-400"
    aria-hidden="true"
  >...</span>

  <button
    v-else
    type="button"
    :aria-label="`Página ${props.page}`"
    :aria-current="props.isActive ? 'page' : undefined"
    :class="[
      'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B9AAA]/50',
      sizeClasses,
      props.isActive
        ? 'bg-[#1B9AAA] text-white shadow-sm'
        : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
    ]"
    @click="handleClick"
  >
    {{ props.page }}
  </button>
</template>

