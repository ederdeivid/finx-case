<script setup lang="ts">
interface Option {
  id: number | string
  nome: string
}

interface Props {
  options: Option[]
  label?: string
  placeholder?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Selecione...',
  id: 'multi-select',
})

const model = defineModel<(number | string)[]>({ required: true })

const isOpen = ref(false)

const selectedLabels = computed(() => {
  if (model.value.length === 0) {
    return props.placeholder
  }
  if (hasSelectedOptions.value.length === 1 && hasSelectedOptions.value[0]) {
    return hasSelectedOptions.value[0].nome
  }
  return `${hasSelectedOptions.value.length} selecionados`
})

const hasSelectedOptions = computed(() => {
  return props.options.filter(option => model.value.includes(option.id))
})

function toggle(id: number | string) {
  const modelValueToggle = new Set(model.value)

  if (modelValueToggle.has(id)) {
    modelValueToggle.delete(id)
  } else {
    modelValueToggle.add(id)
  }

  model.value = [...modelValueToggle]
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('.multi-select-dropdown')) return
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative multi-select-dropdown w-full">
    <label
      v-if="props.label"
      :for="props.id"
      class="mb-1 block text-xs font-medium text-slate-600 sm:mb-1.5 sm:text-sm"
    >
      {{ props.label }}
    </label>
    <button
      :id="props.id"
      type="button"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-label="props.label ? `${props.label}: ${selectedLabels}` : selectedLabels"
      class="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-700 focus:border-finx-text focus:outline-none focus:ring-2 focus:ring-finx-text/20 sm:px-4 sm:py-2.5"
      @click="isOpen = !isOpen"
    >
      <span class="truncate text-sm">{{ selectedLabels }}</span>
      <IconsArrowDownIcon class="h-4 w-4" :is-open="isOpen" />
    </button>

    <div
      v-show="isOpen"
      class="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg sm:left-auto sm:right-0 sm:w-64"
    >
      <ul
        class="max-h-60 overflow-auto py-1"
        role="listbox"
        :aria-label="props.label || 'Opções'"
        aria-multiselectable="true"
      >
        <li
          v-for="option in props.options"
          :key="option.id"
          class="cursor-pointer px-3 py-2 hover:bg-finx-text/20 focus-within:bg-finx-text/20 sm:px-4"
          role="option"
          :aria-selected="model.includes(option.id)"
          @click.prevent="toggle(option.id)"
        >
          <label
            class="flex cursor-pointer items-center"
          >
            <input
              id="checkbox-convenio"
              type="checkbox"
              :checked="model.includes(option.id)"
              :aria-label="option.nome"
              class="h-4 w-4 rounded border-slate-300 text-finx-text focus:ring-finx-text focus:ring-offset-0"
              @click.stop
              @change="toggle(option.id)"
            >
            <span class="ml-3 text-sm text-slate-700">
              {{ option.nome }}
            </span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>
