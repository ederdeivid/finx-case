
## 🧱 Decisões Técnicas e Arquiteturais

### Configuração Inicial

Inicialmente configurei os critérios básicos para o app: definição das versões de **Node**, **npm** e suporte a **nvm**, garantindo que todos os desenvolvedores trabalhem com o mesmo ambiente.

### Por que Nuxt?

A escolha do **Nuxt** foi baseada em dois motivos principais:

1. **Convention over Configuration:** É essencialmente Vue, porém com padrões já definidos (rotas, estrutura de pastas, etc.), reduzindo a necessidade de configurações manuais e acelerando o desenvolvimento.

2. **SSR e Performance:** Com base nos requisitos do teste, onde otimização e velocidade são pontos importantes, o **Server-Side Rendering (SSR)** resolve boa parte dos problemas de lentidão, já que o processamento é feito do lado do servidor. Isso também permite trabalhar com **BFF (Backend for Frontend)** e **cache no front-end** utilizando o **Nuxt Nitro**.

### Estrutura por Domínios com Nuxt Layers

Para estruturar o projeto por **domínios** ao invés da estrutura de pastas padrão, optei por utilizar o **Nuxt Layers**. Esta abordagem pode ser facilmente implementada tanto em aplicações Nuxt quanto em aplicações Vue puras.

**Motivação:** Quando a aplicação cresce, pastas genéricas como `components/`, `stores/` e `services/` acabam acumulando muitos arquivos soltos. Com Layers, o projeto fica **organizado por domínio**, facilitando a manutenção e escalabilidade.

```
app/
├── layers/
│   └── consultas/          # Domínio de consultas
│       ├── components/
│       ├── composables/
│       └── pages/
├── components/             # Componentes compartilhados
├── composables/            # Lógica reutilizável
└── types/                  # Interfaces TypeScript
```

### BFF e Manipulação de Dados

Na parte de busca pelas informações, eu poderia simplesmente fazer um `filter` com RegExp no front buscando dados do JSON, mas isso quebraria a finalidade do **BFF**.

**Abordagem escolhida:** O front-end **não faz manipulação e tratamento de dados**, apenas chama a request (seja para o Mock ou para uma API externa). Dessa forma:

- O servidor processa e filtra os dados
- Mesmo com MUITOS dados na request, o front-end não sente sobrecarga
- A separação de responsabilidades fica clara

### Reatividade com defineModel

Na reatividade dos componentes com props para componentes filhos, ao invés de usar o padrão com `emit` e `update:algumaCoisa`, optei por uma abordagem mais moderna utilizando o **`defineModel`**.

Por trás dos panos faz a mesma coisa, porém de maneira **muito menos verbosa e mais intuitiva**:

```typescript
// Antes (verboso)
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// Depois (com defineModel)
const model = defineModel<string>({ required: true })
```

### Nomenclatura de Variáveis

Optei por manter o **nome das regras de domínio em português** (ex: `medico`, `paciente`, `convenio`, `dataNascimento`), enquanto variáveis de código e lógica permanecem em inglês (ex: `filteredRequests`, `currentPage`).

Isso facilita a comunicação com a equipe de negócio e mantém a consistência com os modelos de dados.

---

## 🛠️ Qualidade de Código

Para garantir consistência e qualidade no desenvolvimento, este projeto utiliza as seguintes ferramentas:

### ✅ Conventional Commits

- Padroniza mensagens de commit com base em [conventionalcommits.org](https://www.conventionalcommits.org/)
- Facilita a geração automática de changelogs e melhora a rastreabilidade de mudanças
- Commits bem descritos fazem parte dos critérios de avaliação

### 🐶 Husky

- Executa hooks de Git para prevenir erros antes que o código seja commitado
- Garante que o commit **não suba com problemas** de lint ou testes

### 🎯 lint-staged

- Executa o ESLint apenas nos arquivos que foram modificados e estão staged
- Otimiza o tempo de validação e evita que arquivos não alterados sejam reprocessados

---

## 📐 Princípios e Padrões Aplicados

### SOLID - Single Responsibility Principle (SRP)

Cada módulo, composable ou componente tem **uma única responsabilidade**:

| Composable | Responsabilidade |
|------------|------------------|
| `usePatientAge` | Apenas cálculo de idade |
| `useDateFormat` | Apenas formatação de datas |
| `useConsultasApi` | Apenas comunicação com a API de consultas |

Isso facilita testes, manutenção e reutilização do código.

### Clean Code

- **Nomes significativos:** Variáveis e funções com nomes que descrevem claramente seu propósito
- **Funções pequenas:** Cada função faz apenas uma coisa
- **Código auto-documentado:** O código é legível sem necessidade de comentários excessivos

### Programação Estruturada

Onde foi possível, apliquei o conceito de **programação estruturada**, onde o código segue uma **linha racional**, como se fosse a leitura de um livro.

Isso facilita entender o que vem depois, sem saltos imprevisíveis no código.

---

## 📦 Stack Tecnológica

- **Framework:** Nuxt 4 com Vue 3
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS v4
- **Estado:** Vue Composition API com Composables
- **Testes:** Vitest
- **Linting:** ESLint
- **Gerenciamento de estado:** Aplicação simples, não houve necessidade
