# Guia de Implementação - Páginas do iChefV2

## Como aplicar TanStack Query nas páginas existentes

### 1. Página de Login (`app/(auth)/login/page.tsx`)

**Antes:**
```typescript
const { login, isLoading } = useAuth()

const onSubmit = async (data: LoginFormData) => {
  const success = await login(data.email, data.password)
  if (success) {
    router.push("/")
  }
}
```

**Depois (Com TanStack Query):**
```typescript
import { useLogin } from "@/network/hooks/auth/useAuth"

const loginMutation = useLogin()

const onSubmit = async (data: LoginFormData) => {
  try {
    await loginMutation.mutateAsync(data)
    // Toast de sucesso e redirecionamento automático via hook
  } catch (error) {
    // Toast de erro automático via hook
  }
}

// No JSX
<Button
  disabled={loginMutation.isPending}
  onClick={handleSubmit(onSubmit)}
>
  {loginMutation.isPending ? "Entrando..." : "Entrar"}
</Button>
```

### 2. Página de Favoritos (`app/favorites/page.tsx`)

**Implementação com TanStack Query:**
```typescript
import { useGetFavoriteRecipes, useToggleFavoriteRecipe } from "@/network/hooks/recipes/useRecipes"

export default function FavoritesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Hook para buscar favoritos
  const { data: favorites, isLoading } = useGetFavoriteRecipes({
    page: currentPage,
    limit: 6,
    search: searchTerm
  })
  
  // Hook para toggle de favoritos
  const { removeFromFavorites } = useToggleFavoriteRecipe()
  
  const handleRemoveFavorite = async (recipeId: string) => {
    try {
      await removeFromFavorites.mutateAsync(recipeId)
      // Toast automático de sucesso
    } catch (error) {
      // Toast automático de erro
    }
  }

  if (isLoading) {
    return <FavoritesSkeleton />
  }

  return (
    <div>
      {/* Search and filters */}
      <SearchAndFilters onSearch={setSearchTerm} />
      
      {/* Favorites grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites?.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onFavorite={() => handleRemoveFavorite(recipe.id)}
            isFavorite={true}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {/* ... */}
    </div>
  )
}
```

### 3. Página de Histórico (`app/history/page.tsx`)

**Implementação com TanStack Query:**
```typescript
import { 
  useGetMyRecipes, 
  usePostRecipe, 
  usePutRecipe, 
  useDeleteRecipe,
  useGenerateRecipeWithAI 
} from "@/network/hooks/recipes/useRecipes"

export default function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Hook para buscar receitas do usuário
  const { data: recipes, isLoading } = useGetMyRecipes({
    page: currentPage,
    limit: 6,
    search: searchTerm
  })
  
  // Hooks para mutations
  const createRecipe = usePostRecipe()
  const updateRecipe = usePutRecipe()
  const deleteRecipe = useDeleteRecipe()
  const generateAIRecipe = useGenerateRecipeWithAI()
  
  const handleCreateRecipe = async (recipeData: CreateRecipeData) => {
    try {
      await createRecipe.mutateAsync(recipeData)
      setIsCreateModalOpen(false)
      // Toast automático de sucesso
    } catch (error) {
      // Toast automático de erro
    }
  }
  
  const handleEditRecipe = async (id: string, recipeData: Partial<CreateRecipeData>) => {
    try {
      await updateRecipe.mutateAsync({ id, ...recipeData })
      setIsEditModalOpen(false)
      // Toast automático de sucesso
    } catch (error) {
      // Toast automático de erro
    }
  }
  
  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteRecipe.mutateAsync(id)
      // Toast automático de sucesso
    } catch (error) {
      // Toast automático de erro
    }
  }
  
  const handleAIGenerate = async (prompt: string) => {
    try {
      await generateAIRecipe.mutateAsync({ prompt })
      setIsAIModalOpen(false)
      // Toast automático de sucesso
    } catch (error) {
      // Toast automático de erro
    }
  }

  if (isLoading) {
    return <HistorySkeleton />
  }

  return (
    <div>
      {/* Header with create buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1>Minhas Receitas</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Nova Receita
          </Button>
          <Button 
            onClick={() => setIsAIModalOpen(true)}
            disabled={generateAIRecipe.isPending}
          >
            {generateAIRecipe.isPending ? "Gerando..." : "IA"}
          </Button>
        </div>
      </div>
      
      {/* Recipes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes?.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={() => handleEditRecipe(recipe.id, recipe)}
            onDelete={() => handleDeleteRecipe(recipe.id)}
            showActions={true}
          />
        ))}
      </div>
      
      {/* Modals */}
      <CreateRecipeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRecipe}
        isLoading={createRecipe.isPending}
      />
    </div>
  )
}
```

### 4. Página de Planos (`app/plans/page.tsx`)

**Implementação com TanStack Query:**
```typescript
import { useGetPlans, useSubscribeToPlan } from "@/network/hooks/plans/usePlans"
import { useAuth } from "@/contexts/auth-context"

export default function PlansPage() {
  const { user } = useAuth()
  
  // Hook para buscar planos disponíveis
  const { data: plans, isLoading } = useGetPlans()
  
  // Hook para assinar plano
  const subscribeToPlan = useSubscribeToPlan()
  
  const handleSubscribe = async (planId: string) => {
    try {
      await subscribeToPlan.mutateAsync({ planId })
      // Toast automático de sucesso
      router.push("/dashboard")
    } catch (error) {
      // Toast automático de erro
    }
  }

  if (isLoading) {
    return <PlansSkeleton />
  }

  return (
    <div>
      <h1>Escolha seu Plano</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={user?.subscription?.plan}
            onSubscribe={() => handleSubscribe(plan.id)}
            isLoading={subscribeToPlan.isPending}
          />
        ))}
      </div>
    </div>
  )
}
```

### 5. Página Principal (`app/page.tsx`)

**Implementação com TanStack Query:**
```typescript
import { useGetRecipes, useGetRecipeTags } from "@/network/hooks/recipes/useRecipes"

export default function HomePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Hook para buscar receitas públicas
  const { data: recipes, isLoading: recipesLoading } = useGetRecipes({
    page: 1,
    limit: 12,
    search: searchTerm,
    tags: selectedTags,
    sortBy: "newest"
  })
  
  // Hook para buscar tags disponíveis
  const { data: tags, isLoading: tagsLoading } = useGetRecipeTags()
  
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Search and Filters */}
      <SearchSection 
        onSearch={handleSearch}
        tags={tags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        isLoading={tagsLoading}
      />
      
      {/* Recipes Grid */}
      <RecipesGrid 
        recipes={recipes}
        isLoading={recipesLoading}
      />
    </div>
  )
}
```

## Componentes Reutilizáveis

### Skeleton Loading Components

```typescript
// components/skeletons/RecipeCardSkeleton.tsx
export function RecipeCardSkeleton() {
  return (
    <Card>
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </Card>
  )
}
```

### Error Boundary Component

```typescript
// components/ErrorBoundary.tsx
export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="p-6 text-center">
              <h2>Algo deu errado!</h2>
              <p>{error.message}</p>
              <Button onClick={resetErrorBoundary}>Tentar novamente</Button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

## Hooks Personalizados para Páginas

### Hook para Gerenciar Estado de Página

```typescript
// hooks/usePageState.ts
export function usePageState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  
  const updateState = useCallback((updates: Partial<T>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])
  
  return [state, updateState] as const
}
```

### Hook para Debounced Search

```typescript
// hooks/useSearch.ts
export function useSearch(initialValue = "", delay = 300) {
  const [value, setValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return [debouncedValue, setValue] as const
}
```

## Checklist de Migração

Para cada página, siga este checklist:

- [ ] Identificar todas as chamadas de API
- [ ] Substituir por hooks do TanStack Query
- [ ] Adicionar loading states
- [ ] Configurar error handling
- [ ] Remover gerenciamento de estado local para dados de servidor
- [ ] Adicionar skeleton loading
- [ ] Configurar invalidação de cache
- [ ] Testar todos os cenários (sucesso, erro, loading)
- [ ] Verificar toasts de feedback
- [ ] Otimizar performance com configurações de cache

## Dicas de Performance

1. **Prefetch dados críticos**:
```typescript
// Em componentes pai, prefetch dados que serão usados
const queryClient = useQueryClient()

const prefetchRecipe = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.recipes.detail(id),
    queryFn: () => getRecipeById(id)
  })
}
```

2. **Use React.memo para componentes pesados**:
```typescript
const RecipeCard = React.memo(({ recipe, onFavorite }) => {
  // Componente otimizado
})
```

3. **Configure staleTime adequadamente**:
```typescript
// Para dados que não mudam frequentemente
const { data } = useQuery({
  queryKey: ['static-data'],
  queryFn: fetchStaticData,
  staleTime: 10 * 60 * 1000, // 10 minutos
})
```

4. **Use suspense para melhor UX**:
```typescript
// Wrap páginas com Suspense
<Suspense fallback={<PageSkeleton />}>
  <RecipesPage />
</Suspense>
```