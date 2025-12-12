<script setup lang="ts">
interface Props {
  placeholder?: string
  label?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar...',
  label: '',
  id: 'search-input',
})

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="flex-1">
    <label
      v-if="props.label"
      :for="props.id"
      class="mb-1 block text-xs font-medium text-slate-600 sm:mb-1.5 sm:text-sm"
    >
      {{ props.label }}
    </label>
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <IconsSearchIcon class="h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />
      </div>
      <input
        :id="props.id"
        v-model="model"
        type="search"
        autocomplete="off"
        :placeholder="props.placeholder"
        :aria-label="props.label || props.placeholder"
        class="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-finx-text focus:outline-none focus:ring-2 focus:ring-finx-text/20 sm:py-2.5 sm:pl-10 sm:pr-4"
      >
    </div>
  </div>
</template>
