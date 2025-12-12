# Componentes do Layer Consultas

## Visão Geral

Este layer contém todos os componentes, composables e páginas relacionados à funcionalidade de consultas médicas.

---

## Composables

### `useConsultasFilters`

Gerencia os filtros de busca e sincronização com a URL.

```typescript
const { filters, updateFilters, clearFilters } = useConsultasFilters()
```

**Retorno:**
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `filters` | `Ref<ConsultasRequestParams>` | Estado atual dos filtros |
| `updateFilters` | `(newFilters: Partial<ConsultasRequestParams>) => void` | Atualiza filtros (reseta página para 1) |
| `clearFilters` | `() => void` | Limpa todos os filtros |

**Comportamento:**
- Lê filtros iniciais da URL
- Sincroniza automaticamente filtros com a URL
- Remove parâmetros vazios da URL

---

### `useConsultasApi`

Gerencia a comunicação com a API de consultas.

```typescript
const {
  consultas,
  paginacao,
  isLoading,
  error,
  filters,
  updateFilters,
  clearFilters,
  goToPage,
  toggleSortOrder,
  fetchConsultas
} = useConsultasApi()
```

**Retorno:**
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `consultas` | `ComputedRef<Consulta[]>` | Lista de consultas |
| `paginacao` | `ComputedRef<Paginacao \| null>` | Dados de paginação |
| `isLoading` | `ComputedRef<boolean>` | Estado de carregamento |
| `error` | `Ref<Error \| null>` | Erro da requisição |
| `filters` | `Ref<ConsultasRequestParams>` | Filtros atuais |
| `goToPage` | `(page: number) => void` | Navega para página específica |
| `toggleSortOrder` | `() => void` | Alterna ordenação asc/desc |

---

## Componentes

### `ConsultaCard`

Card individual para exibir uma consulta.

```vue
<ConsultaCard
  :consulta="consulta"
  :clickable="true"
  @click="handleClick"
/>
```

**Props:**
| Prop | Tipo | Obrigatório | Default | Descrição |
|------|------|-------------|---------|-----------|
| `consulta` | `Consulta` | ✅ | - | Dados da consulta |
| `clickable` | `boolean` | ❌ | `true` | Se o card é clicável |

**Eventos:**
| Evento | Payload | Descrição |
|--------|---------|-----------|
| `click` | `Consulta` | Emitido ao clicar no card |

**Caso de Uso:**
- Listagem mobile de consultas
- Página de detalhes de consulta (com `clickable=false`)

---

### `ConsultaCards`

Lista de cards para exibição mobile.

```vue
<ConsultaCards
  :consultas="consultas"
  @card-click="navigateToDetail"
>
  <template #pagination>
    <PaginationItem ... />
  </template>
</ConsultaCards>
```

**Props:**
| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `consultas` | `Consulta[]` | ✅ | Lista de consultas |

**Eventos:**
| Evento | Payload | Descrição |
|--------|---------|-----------|
| `card-click` | `Consulta` | Emitido ao clicar em um card |

**Slots:**
| Slot | Descrição |
|------|-----------|
| `pagination` | Componente de paginação |

---

### `ConsultaTable`

Tabela para exibição desktop.

```vue
<ConsultaTable
  :consultas="consultas"
  @row-click="navigateToDetail"
>
  <template #pagination>
    <PaginationItem ... />
  </template>
</ConsultaTable>
```

**Props:**
| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `consultas` | `Consulta[]` | ✅ | Lista de consultas |

**Eventos:**
| Evento | Payload | Descrição |
|--------|---------|-----------|
| `row-click` | `Consulta` | Emitido ao clicar em uma linha |

**Slots:**
| Slot | Descrição |
|------|-----------|
| `pagination` | Componente de paginação |

---

### `ConsultaFilters`

Componente de filtros de busca.

```vue
<ConsultaFilters
  v-model:nome-medico="nomeMedico"
  v-model:nome-paciente="nomePaciente"
  v-model:nome-convenio="nomeConvenio"
  :convenios="convenios"
  :total-results="totalItems"
  :is-loading="isLoading"
  :sort-order="sortOrder"
  @clear="handleClear"
  @toggle-sort="toggleSortOrder"
/>
```

**Props:**
| Prop | Tipo | Obrigatório | Default | Descrição |
|------|------|-------------|---------|-----------|
| `convenios` | `Convenio[]` | ✅ | - | Lista de convênios disponíveis |
| `totalResults` | `number` | ✅ | - | Total de resultados |
| `isLoading` | `boolean` | ❌ | `false` | Estado de carregamento |
| `sortOrder` | `'asc' \| 'desc'` | ❌ | `'desc'` | Ordem atual |

**Models (v-model):**
| Model | Tipo | Descrição |
|-------|------|-----------|
| `nomeMedico` | `string` | Filtro por nome do médico |
| `nomePaciente` | `string` | Filtro por nome do paciente |
| `nomeConvenio` | `string[]` | Filtro por convênios (múltipla seleção) |

**Eventos:**
| Evento | Descrição |
|--------|-----------|
| `clear` | Limpar todos os filtros |
| `toggle-sort` | Alternar ordenação |

---

### `LoadingState`

Skeleton de carregamento.

```vue
<LoadingState
  :is-loading="isLoading"
  variant="list"
/>
```

**Props:**
| Prop | Tipo | Obrigatório | Default | Descrição |
|------|------|-------------|---------|-----------|
| `isLoading` | `boolean` | ✅ | - | Se deve exibir o skeleton |
| `variant` | `'list' \| 'detail'` | ❌ | `'list'` | Tipo de skeleton |

**Variantes:**
- `list`: Exibe skeleton de tabela + cards
- `detail`: Exibe skeleton de card único

---

### `ConsultaErrorState`

Estado de erro com botão de retry.

```vue
<ConsultaErrorState
  :is-loading="isLoading"
  :error-message="error?.message"
  title="Erro ao carregar"
  button-text="Tentar novamente"
  @on-try-again="retry"
/>
```

**Props:**
| Prop | Tipo | Obrigatório | Default | Descrição |
|------|------|-------------|---------|-----------|
| `isLoading` | `boolean` | ❌ | `false` | Estado de carregamento |
| `errorMessage` | `string \| null` | ❌ | `''` | Mensagem de erro |
| `title` | `string` | ❌ | `'Erro ao carregar consultas'` | Título do erro |
| `buttonText` | `string` | ❌ | `'Tentar novamente'` | Texto do botão |

**Eventos:**
| Evento | Descrição |
|--------|-----------|
| `on-try-again` | Emitido ao clicar no botão |

---

## Exemplo de Uso Completo

```vue
<script setup lang="ts">
const { data: convenios } = await useFetch<Convenio[]>('/api/convenios')

const {
  consultas,
  paginacao,
  isLoading,
  error,
  filters,
  updateFilters,
  clearFilters,
  goToPage,
  toggleSortOrder,
} = useConsultasApi()

const nomeMedico = ref(filters.value.nomeMedico || '')
const nomePaciente = ref(filters.value.nomePaciente || '')
const nomeConvenio = ref<string[]>(filters.value.nomeConvenio || [])

// Debounce nos inputs de texto
watch(nomeMedico, useDebounceFn((val) => {
  updateFilters({ nomeMedico: val || undefined })
}, 400))

watch(nomePaciente, useDebounceFn((val) => {
  updateFilters({ nomePaciente: val || undefined })
}, 400))

watch(nomeConvenio, (val) => {
  updateFilters({ nomeConvenio: val.length ? val : undefined })
})
</script>

<template>
  <main>
    <ConsultaFilters
      v-model:nome-medico="nomeMedico"
      v-model:nome-paciente="nomePaciente"
      v-model:nome-convenio="nomeConvenio"
      :convenios="convenios || []"
      :total-results="paginacao?.totalDeItens || 0"
      :is-loading="isLoading"
      :sort-order="filters.ordem"
      @clear="clearFilters"
      @toggle-sort="toggleSortOrder"
    />

    <LoadingState :is-loading="isLoading" variant="list" />

    <ConsultaErrorState
      :is-loading="isLoading"
      :error-message="error?.message"
      @on-try-again="() => updateFilters({})"
    />

    <template v-if="!isLoading && !error && consultas.length">
      <ConsultaTable :consultas="consultas" @row-click="navigate">
        <template #pagination>
          <PaginationItem
            v-model:current-page="filters.paginaAtual"
            :total-pages="paginacao?.totalDePaginas || 1"
            :total-items="paginacao?.totalDeItens || 0"
            :items-per-page="15"
          />
        </template>
      </ConsultaTable>

      <ConsultaCards :consultas="consultas" @card-click="navigate">
        <template #pagination>
          <PaginationItem ... />
        </template>
      </ConsultaCards>
    </template>
  </main>
</template>
```


