<script setup lang="ts">
interface Props {
  count: number
  isLoading?: boolean
  singularLabel?: string
  pluralLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  singularLabel: 'resultado encontrado',
  pluralLabel: 'resultados encontrados',
})

const label = computed(() =>
  props.count === 1 ? props.singularLabel : props.pluralLabel
)
</script>

<template>
  <div class="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
    <template v-if="props.isLoading">
      <span class="inline-flex items-center gap-1.5">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-[#1B9AAA] border-t-transparent" />
        Carregando...
      </span>
    </template>
    <template v-else>
      <span class="font-semibold text-[#1B9AAA] dark:text-[#22B8CC]">{{ props.count }}</span>
      {{ label }}
    </template>
  </div>
</template>

