import { api } from "@/lib/api/api"
import { Recipe, RecipeParams, RecipeResponse, CreateRecipeData, AIRecipeRequest } from "@/types/recipe"

export async function getRecipes(params: RecipeParams = {}): Promise<RecipeResponse> {
  const { data } = await api.get("/recipes", { params })
  return data
}

export async function getRecipeById(id: string | number): Promise<Recipe> {
  const { data } = await api.get(`/recipes/${id}`)
  return data.data
}

export async function postRecipe(body: CreateRecipeData): Promise<Recipe> {
  const { data } = await api.post("/recipes", body)
  return data
}

export async function putRecipe(id: string | number, body: Partial<CreateRecipeData>): Promise<Recipe> {
  const { data } = await api.put(`/recipes/${id}`, body)
  return data
}

export async function deleteRecipe(id: string | number): Promise<{ message: string }> {
  const { data } = await api.delete(`/recipes/${id}`)
  return data
}

export async function getFavoriteRecipes(params: RecipeParams = {}): Promise<{
  data: Array<{
    id: number;
    user_id: number;
    recipe_id: number;
    recipe: Recipe;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const { data } = await api.get("/favorites", { params })
  return data
}

export async function postFavoriteRecipe(recipeId: string | number): Promise<{ message: string }> {
  const { data } = await api.post(`/favorites/${recipeId}`)
  return data
}

export async function deleteFavoriteRecipe(recipeId: string | number): Promise<{ message: string }> {
  const { data } = await api.delete(`/favorites/${recipeId}`)
  return data
}

export async function getMyRecipes(params: RecipeParams = {}): Promise<RecipeResponse> {
  // Usar a rota /recipes com filtros para buscar receitas do usuário atual
  const { data } = await api.get("/recipes", { params })
  return data
}

export async function getRecipeTags(): Promise<string[]> {
  // Esta rota não existe no backend, vamos retornar tags padrão
  return ['Italiana', 'Brasileira', 'Japonesa', 'Mexicana', 'Indiana', 'Francesa', 'Chinesa', 'Tailandesa']
}

export async function getRecipeCategories(): Promise<string[]> {
  // Esta rota não existe no backend, vamos retornar categorias padrão
  return ['Sobremesas', 'Prato Principal', 'Entrada', 'Sopa', 'Salada', 'Bebidas', 'Pães', 'Massas']
}

export async function postRecipeReview(recipeId: string, body: { rating: number; comment?: string }): Promise<{ message: string }> {
  // Esta funcionalidade não existe no backend ainda
  throw new Error("Funcionalidade de reviews não implementada")
}

export async function postGenerateRecipeWithAI(body: AIRecipeRequest): Promise<Recipe> {
  const { data } = await api.post("/openai", body)
  return data.data
}

export async function postSaveAIRecipe(recipeData: string): Promise<Recipe> {
  const { data } = await api.post("/recipes/ai-recipe", { recipeData })
  return data.data
}

export async function putUpdateAIRecipe(id: string | number, recipeData: string): Promise<Recipe> {
  const { data } = await api.put(`/recipes/ai-recipe/${id}`, { recipeData })
  return data.data
}

export async function postImproveRecipeWithAI(recipeId: string, body: { prompt: string }): Promise<Recipe> {
  // Esta funcionalidade não existe no backend ainda
  throw new Error("Funcionalidade de melhoria de receitas não implementada")
}

export async function getTopRecipes(): Promise<RecipeResponse> {
  const { data } = await api.get("/recipes/top")
  return data
}

export async function likeRecipe(id: string): Promise<Recipe> {
  const { data } = await api.post(`/recipes/${id}/like`)
  return data.data
}