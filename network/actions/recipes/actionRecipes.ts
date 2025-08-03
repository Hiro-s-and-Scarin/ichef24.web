import { api } from "@/lib/api"
import { Recipe, RecipeParams, RecipeResponse, CreateRecipeData, AIRecipeRequest } from "@/types/recipe"

export async function getRecipes(params: RecipeParams = {}): Promise<RecipeResponse> {
  const { data } = await api.get("/recipes", { params })
  return data
}

export async function getRecipeById(id: string): Promise<Recipe> {
  const { data } = await api.get(`/recipes/${id}`)
  return data.recipe
}

export async function postRecipe(body: CreateRecipeData): Promise<Recipe> {
  const { data } = await api.post("/recipes", body)
  return data.recipe
}

export async function putRecipe(id: string, body: Partial<CreateRecipeData>): Promise<Recipe> {
  const { data } = await api.put(`/recipes/${id}`, body)
  return data.recipe
}

export async function deleteRecipe(id: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/recipes/${id}`)
  return data
}

export async function getFavoriteRecipes(params: RecipeParams = {}): Promise<RecipeResponse> {
  const { data } = await api.get("/recipes/favorites", { params })
  return data
}

export async function postFavoriteRecipe(recipeId: string): Promise<{ message: string }> {
  const { data } = await api.post(`/recipes/${recipeId}/favorite`)
  return data
}

export async function deleteFavoriteRecipe(recipeId: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/recipes/${recipeId}/favorite`)
  return data
}

export async function getMyRecipes(params: RecipeParams = {}): Promise<RecipeResponse> {
  const { data } = await api.get("/recipes/my-recipes", { params })
  return data
}

export async function getRecipeTags(): Promise<string[]> {
  const { data } = await api.get("/recipes/tags")
  return data.tags
}

export async function getRecipeCategories(): Promise<string[]> {
  const { data } = await api.get("/recipes/categories")
  return data.categories
}

export async function postRecipeReview(recipeId: string, body: { rating: number; comment?: string }): Promise<{ message: string }> {
  const { data } = await api.post(`/recipes/${recipeId}/reviews`, body)
  return data
}

export async function postGenerateRecipeWithAI(body: AIRecipeRequest): Promise<Recipe> {
  const { data } = await api.post("/recipes/ai/generate", body)
  return data.recipe
}

export async function postImproveRecipeWithAI(recipeId: string, body: { prompt: string }): Promise<Recipe> {
  const { data } = await api.post(`/recipes/${recipeId}/ai/improve`, body)
  return data.recipe
}