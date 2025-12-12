<script setup lang="ts">
interface Props {
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

const props = defineProps<Props>()

const currentPage = defineModel<number>('currentPage', { required: true })

const startItem = computed(() => (currentPage.value - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(currentPage.value * props.itemsPerPage, props.totalItems))

const isFirstPage = computed(() => currentPage.value === 1)
const isLastPage = computed(() => currentPage.value === props.totalPages)

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = currentPage.value
  const MAX_VISIBLE = 5
  const EDGE = 3

  if (total <= MAX_VISIBLE) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= EDGE) {
    return [1, 2, 3, 4, '...', total]
  }

  if (current >= total - (EDGE - 1)) {
    return [1, '...', total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
})

const mobilePages = computed(() =>
  [currentPage.value - 1, currentPage.value, currentPage.value + 1]
    .filter(p => p >= 1 && p <= props.totalPages)
)

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    currentPage.value = page
  }
}

function previousPage() {
  goToPage(currentPage.value - 1)
}

function nextPage() {
  goToPage(currentPage.value + 1)
}
</script>

<template>
  <div class="hidden lg:flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 dark:border-slate-700 dark:bg-slate-800/80">
    <div class="text-sm text-slate-500 dark:text-slate-400">
      Mostrando
      <span class="font-medium text-slate-700 dark:text-slate-200">{{ startItem }}</span>
      a
      <span class="font-medium text-slate-700 dark:text-slate-200">{{ endItem }}</span>
      de
      <span class="font-medium text-slate-700 dark:text-slate-200">{{ props.totalItems }}</span>
      resultados
    </div>

    <nav class="flex items-center gap-1" aria-label="Paginação">
      <PaginationNavButton
        direction="prev"
        :disabled="isFirstPage"
        @click="previousPage"
      />

      <PaginationPageButton
        v-for="page in visiblePages"
        :key="page"
        :page="page"
        :is-active="currentPage === page"
        size="sm"
        @click="goToPage"
      />

      <PaginationNavButton
        direction="next"
        :disabled="isLastPage"
        @click="nextPage"
      />
    </nav>
  </div>

  <div class="flex lg:hidden flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
    <div class="text-center text-sm text-slate-500 sm:text-left dark:text-slate-400">
      Página
      <span class="font-semibold text-[#1B9AAA] dark:text-[#22B8CC]">{{ currentPage }}</span>
      de
      <span class="font-semibold text-slate-700 dark:text-slate-200">{{ props.totalPages }}</span>
    </div>

    <div class="flex items-center justify-center gap-2">
      <PaginationNavButton
        direction="prev"
        :disabled="isFirstPage"
        :show-label="true"
        @click="previousPage"
      />

      <div class="flex items-center gap-1" role="group" aria-label="Páginas">
        <PaginationPageButton
          v-for="page in mobilePages"
          :key="page"
          :page="page"
          :is-active="currentPage === page"
          size="md"
          @click="goToPage"
        />
      </div>

      <PaginationNavButton
        direction="next"
        :disabled="isLastPage"
        :show-label="true"
        @click="nextPage"
      />
    </div>
  </div>
</template>
