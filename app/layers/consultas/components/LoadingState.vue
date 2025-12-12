<script setup lang="ts">
interface Props {
  isLoading: boolean
  variant?: 'list' | 'detail'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'list',
})
</script>

<template>
  <template v-if="props.isLoading">
    <template v-if="props.variant === 'list'">
      <LoadingSkeleton
        type="table"
        :rows="5"
      />
      <LoadingSkeleton
        type="cards"
        :rows="3"
      />
    </template>

    <template v-else-if="props.variant === 'detail'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3/80">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 animate-pulse rounded-full bg-slate-200 sm:h-10 sm:w-10" />
            <div class="space-y-2">
              <div class="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div class="h-3 w-16 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
          <div class="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>

        <div class="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4">
          <div class="space-y-2">
            <div class="h-2.5 w-12 animate-pulse rounded bg-slate-200" />
            <div class="h-4 w-28 animate-pulse rounded bg-slate-200" />
          </div>
          <div class="space-y-2">
            <div class="h-2.5 w-20 animate-pulse rounded bg-slate-200" />
            <div class="h-4 w-32 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </template>
  </template>
</template>
