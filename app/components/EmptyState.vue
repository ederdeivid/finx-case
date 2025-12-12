<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  icon?: 'search' | 'error' | 'empty'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Nenhum resultado encontrado',
  description: 'Tente ajustar os filtros de busca',
  icon: 'search',
})
</script>

<template>
  <div
    class="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
  >
    <icons-search-icon v-if="props.icon === 'search'" />
    <icons-empty-icon v-else-if="props.icon === 'empty'" />
    <icons-error-icon v-else-if="props.icon === 'error'" />

    <h3 class="mt-2 text-sm font-medium text-slate-700 dark:text-white">
      {{ props.title }}
    </h3>
    <p class="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
      {{ props.description }}
    </p>
    <slot />
  </div>
</template>
