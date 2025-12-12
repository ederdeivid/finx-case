<script setup lang="ts">
import type { Consulta } from '~/types/consultasResponse'

interface Props {
  consultas: Consulta[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'card-click': [consulta: Consulta]
}>()

function handleCardClick(consulta: Consulta) {
  emit('card-click', consulta)
}
</script>

<template>
  <section class="space-y-3 lg:hidden" aria-label="Lista de consultas">
    <ConsultasConsultaCard
      v-for="consulta in props.consultas"
      :key="consulta.id"
      :consulta="consulta"
      :clickable="true"
      @click="handleCardClick"
    />

    <slot name="pagination" />
  </section>
</template>
