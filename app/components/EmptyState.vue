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
    class="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center shadow-sm"
  >
    <IconsSearchIcon v-if="props.icon === 'search'" class="mx-auto h-10 w-10 text-finx-text" />
    <IconsEmptyIcon v-else-if="props.icon === 'empty'" class="mx-auto h-10 w-10 text-finx-text" />
    <IconsErrorIcon v-else-if="props.icon === 'error'" class="mx-auto h-10 w-10 text-finx-text" />

    <h3 class="mt-2 text-sm font-semibold text-finx-text-primary">
      {{ props.title }}
    </h3>
    <p class="mt-1 text-xs font-semibold text-finx-text-secondary sm:text-sm">
      {{ props.description }}
    </p>
    <slot />
  </div>
</template>
