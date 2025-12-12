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
  <div class="text-xs text-slate-500 sm:text-sm">
    <template v-if="props.isLoading">
      <span class="inline-flex items-center gap-1.5">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-finx-text border-t-transparent" />
        <span class="text-finx-text-secondary ml-1">
          Carregando...
        </span>
      </span>
    </template>
    <template v-else>
      <span class="font-semibold text-finx-text">{{ props.count }}</span>
      <span class="text-finx-text-secondary ml-1"> {{ label }} </span>
    </template>
  </div>
</template>

