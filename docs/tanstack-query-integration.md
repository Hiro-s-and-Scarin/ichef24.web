# Integração TanStack Query - iChefV2

## Visão Geral

Esta documentação descreve a integração completa do TanStack Query no projeto iChefV2, seguindo os padrões e arquitetura do ClinicPro.

## Estrutura de Arquivos

```
├── lib/
│   ├── api.ts                    # Cliente Axios configurado
│   ├── query-config.ts           # Configurações de query
│   ├── query-keys.ts             # Chaves centralizadas
│   ├── query-utils.ts            # Utilitários para queries
│   └── providers/
│       └── query-provider.tsx    # Provider do TanStack Query
├── network/
│   ├── actions/                  # Funções de API
│   │   ├── auth/
│   │   ├── recipes/
│   │   ├── users/
│   │   └── plans/
│   └── hooks/                    # Hooks customizados
│       ├── auth/
│       ├── recipes/
│       ├── users/
│       └── plans/
├── types/                        # Tipos TypeScript
│   ├── auth.ts
│   ├── recipe.ts
│   └── index.ts
└── components/examples/          # Exemplos de uso
    └── recipe-page-example.tsx
```

## Padrões de Nomenclatura

### Actions
- **GET**: `getRecipes`, `getUserById`
- **POST**: `postRecipe`, `postLogin`
- **PUT**: `putRecipe`, `putUser`
- **DELETE**: `deleteRecipe`, `deleteUser`

### Hooks
- **Query**: `useGetRecipes`, `useGetUserById`
- **Mutation**: `usePostRecipe`, `usePutUser`

## Configuração de Queries

### Tipos de Configuração
- **defaultQueries**: Para queries padrão (1min stale, 5min gc)
- **frequentQueries**: Para dados que mudam frequentemente (10s stale, 2min gc)
- **staticQueries**: Para dados estáticos (5min stale, 10min gc)

### Query Keys Centralizadas
```typescript
const queryKeys = {
  auth: {
    me: ["me"] as const,
    session: ["auth", "session"] as const,
  },
  recipes: {
    all: ["recipes"] as const,
    list: (params?: any) => ["recipes", "list", params] as const,
    detail: (id: string) => ["recipes", "detail", id] as const,
  },
}
```

## Hooks de Query (Padrão de Retorno)

Todos os hooks de query seguem o padrão simplificado:

```typescript
export function useGetRecipes(params: RecipeParams = {}) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.recipes.list(params),
    queryFn: async () => await getRecipes(params),
    retry: 0,
  })

  return {
    data: data?.data,  // Apenas os dados essenciais
    isLoading,         // Estado de carregamento
  }
}
```

## Hooks de Mutation (Com Toasts)

Todas as mutations incluem feedback de toast:

```typescript
export function usePostRecipe() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (body: CreateRecipeData) => {
      return await postRecipe(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      toast.success("Receita criada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar receita")
      console.error("Error creating recipe:", error)
    },
  })

  return mutate
}
```

## Gerenciamento de Estado

### Invalidação de Cache
- **Automática**: Após mutations bem-sucedidas
- **Manual**: Usando `queryClient.invalidateQueries()`
- **Utilitários**: Através da classe `QueryUtils`

### Tratamento de Erros
- **API**: Interceptors no cliente Axios
- **UI**: Toasts para feedback ao usuário
- **Console**: Logs de erro para debugging

## Exemplos de Uso

### 1. Listar Receitas
```typescript
function RecipesList() {
  const { data: recipes, isLoading } = useGetRecipes({ page: 1, limit: 10 })

  if (isLoading) return <div>Carregando...</div>

  return (
    <div>
      {recipes?.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
```

### 2. Criar Receita
```typescript
function CreateRecipeForm() {
  const createRecipe = usePostRecipe()

  const handleSubmit = async (data: CreateRecipeData) => {
    try {
      await createRecipe.mutateAsync(data)
      // Toast de sucesso será exibido automaticamente
    } catch (error) {
      // Toast de erro será exibido automaticamente
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulário */}
      <button disabled={createRecipe.isPending}>
        {createRecipe.isPending ? "Criando..." : "Criar"}
      </button>
    </form>
  )
}
```

### 3. Detalhes de Receita
```typescript
function RecipeDetails({ id }: { id: string }) {
  const { data: recipe, isLoading } = useGetRecipeById(id)

  if (isLoading) return <div>Carregando...</div>
  if (!recipe) return <div>Receita não encontrada</div>

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      {/* Outros detalhes */}
    </div>
  )
}
```

## Integração com Autenticação

O contexto de autenticação foi atualizado para usar os hooks do TanStack Query:

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: userData, isLoading: isUserLoading } = useMe()
  
  // Mapeia os dados do usuário para o formato esperado
  // Integra com mutations de login/logout
}
```

## Toasts e Feedback

Seguindo o padrão do ClinicPro, todos os toasts usam a biblioteca `sonner`:

```typescript
import { toast } from "sonner"

// Sucesso
toast.success("Operação realizada com sucesso!")

// Erro
toast.error(error.response?.data?.message || "Erro genérico")

// Loading (se necessário)
toast.loading("Processando...")
```

## Boas Práticas

### 1. Query Keys
- Use sempre o objeto `queryKeys` centralizado
- Inclua parâmetros relevantes nas chaves
- Mantenha consistência na nomenclatura

### 2. Error Handling
- Sempre trate erros nas mutations
- Use mensagens de erro significativas
- Log erros no console para debugging

### 3. Cache Management
- Invalide queries relacionadas após mutations
- Use prefetch para dados críticos
- Configure staleTime adequadamente

### 4. Performance
- Limite o número de queries simultâneas
- Use enabled conditions para queries condicionais
- Implemente skeleton loading adequado

### 5. Tipagem
- Mantenha tipos TypeScript atualizados
- Use interfaces específicas para cada recurso
- Valide dados de entrada nas functions

## Configuração do Provider

No `app/layout.tsx`:

```typescript
export default function RootLayout({ children }) {
  return (
    <QueryProvider>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryProvider>
  )
}
```

## Testabilidade

A estrutura permite fácil testabilidade:
- Actions isoladas podem ser testadas individualmente
- Hooks podem ser testados com react-query test utils
- Mocks podem ser aplicados facilmente nas actions

## Migration Path

Para migrar páginas existentes:
1. Substitua chamadas diretas de API pelos hooks
2. Remova gerenciamento de estado local para dados de servidor
3. Adicione loading states usando `isLoading`
4. Implemente error handling com toasts
5. Configure invalidação de cache adequada