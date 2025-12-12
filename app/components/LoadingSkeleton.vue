<script setup lang="ts">
interface Props {
  rows?: number
  type?: 'table' | 'cards'
}

const props = withDefaults(defineProps<Props>(), {
  rows: 5,
  type: 'table',
})
</script>

<template>
  <section
    v-if="props.type === 'table'"
    class="hidden flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:flex"
  >
    <div class="max-h-[calc(100vh-380px)] min-h-[400px] overflow-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="sticky top-0 z-10 bg-slate-50">
          <tr>
            <th class="px-6 py-3.5 text-left">
              <div class="h-3 w-20 animate-pulse rounded bg-slate-200" />
            </th>
            <th class="px-6 py-3.5 text-left">
              <div class="h-3 w-16 animate-pulse rounded bg-slate-200" />
            </th>
            <th class="px-6 py-3.5 text-left">
              <div class="h-3 w-20 animate-pulse rounded bg-slate-200" />
            </th>
            <th class="px-6 py-3.5 text-left">
              <div class="h-3 w-24 animate-pulse rounded bg-slate-200" />
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="i in props.rows" :key="i">
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center">
                <div class="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
                <div class="ml-4 space-y-2">
                  <div class="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  <div class="h-3 w-16 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="h-4 w-28 animate-pulse rounded bg-slate-200" />
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="h-4 w-32 animate-pulse rounded bg-slate-200" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
      <div class="h-4 w-48 animate-pulse rounded bg-slate-200" />
      <div class="flex items-center gap-1">
        <div class="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />
        <div class="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />
        <div class="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />
        <div class="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  </section>

  <section v-if="props.type === 'cards'" class="space-y-3 lg:hidden">
    <article
      v-for="i in props.rows"
      :key="i"
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 animate-pulse rounded-full bg-slate-200 sm:h-10 sm:w-10" />
          <div class="space-y-2">
            <div class="h-4 w-28 animate-pulse rounded bg-slate-200" />
            <div class="h-3 w-16 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
        <div class="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div class="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4">
        <div class="space-y-2">
          <div class="h-2.5 w-12 animate-pulse rounded bg-slate-200" />
          <div class="h-4 w-24 animate-pulse rounded bg-slate-200" />
        </div>
        <div class="space-y-2">
          <div class="h-2.5 w-20 animate-pulse rounded bg-slate-200" />
          <div class="h-4 w-28 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </article>

    <div class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="mx-auto h-4 w-28 animate-pulse rounded bg-slate-200 sm:mx-0" />
      <div class="flex items-center justify-center gap-2">
        <div class="h-10 w-20 animate-pulse rounded-lg bg-slate-200" />
        <div class="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />
        <div class="h-10 w-20 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  </section>
</template>

