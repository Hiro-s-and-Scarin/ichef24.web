"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { 
  getRecipes, 
  getRecipeById, 
  postRecipe, 
  putRecipe, 
  deleteRecipe,
  getFavoriteRecipes,
  postFavoriteRecipe,
  deleteFavoriteRecipe,
  getMyRecipes,
  getRecipeTags,
  getRecipeCategories,
  postGenerateRecipeWithAI,
  getTopRecipes,
  likeRecipe
} from "@/network/actions/recipes/actionRecipes"
import { Recipe, RecipeParams, CreateRecipeData, AIRecipeRequest } from "@/types/recipe"
import { queryKeys } from "@/lib/config/query-keys"

export function useRecipes(params: RecipeParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.recipes.all, params],
    queryFn: async () => await getRecipes(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useRecipe(id: string | number) {
  return useQuery({
    queryKey: queryKeys.recipes.one(id),
    queryFn: async () => await getRecipeById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateRecipeData) => {
      return await postRecipe(body)
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas às receitas
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
      toast.success("Receita criada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar receita")
      console.error("Error creating recipe:", error)
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string | number } & Partial<CreateRecipeData>) => {
      return await putRecipe(id, data)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.one(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
      toast.success("Receita atualizada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar receita")
      console.error("Error updating recipe:", error)
    },
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string | number) => {
      return await deleteRecipe(id)
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas às receitas
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites })
      toast.success("Receita deletada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao deletar receita")
      console.error("Error deleting recipe:", error)
    },
  })
}

export function useFavoriteRecipes(params: RecipeParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.recipes.favorites, params],
    queryFn: async () => await getFavoriteRecipes(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAddToFavorites() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (recipeId: string | number) => {
      return await postFavoriteRecipe(recipeId)
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas às receitas
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
      toast.success("Receita adicionada aos favoritos!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao adicionar aos favoritos")
      console.error("Error adding to favorites:", error)
    },
  })
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (recipeId: string | number) => {
      return await deleteFavoriteRecipe(recipeId)
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas às receitas
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
      toast.success("Receita removida dos favoritos!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao remover dos favoritos")
      console.error("Error removing from favorites:", error)
    },
  })
}

export function useMyRecipes(params: RecipeParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.recipes.my, params],
    queryFn: async () => await getMyRecipes(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useRecipeTags() {
  return useQuery({
    queryKey: queryKeys.recipes.tags,
    queryFn: async () => await getRecipeTags(),
    staleTime: 1000 * 60 * 60, // Tags don't change often
  })
}

export function useRecipeCategories() {
  return useQuery({
    queryKey: queryKeys.recipes.categories,
    queryFn: async () => await getRecipeCategories(),
    staleTime: 1000 * 60 * 60, // Categories don't change often
  })
}

export function useGenerateRecipeWithAI() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: AIRecipeRequest) => {
      return await postGenerateRecipeWithAI(body)
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas às receitas
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites })
      toast.success("Receita gerada com IA com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao gerar receita com IA")
      console.error("Error generating recipe with AI:", error)
    },
  })
}

export function useTopRecipes() {
  return useQuery({
    queryKey: [...queryKeys.recipes.top],
    queryFn: async () => await getTopRecipes(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useLikeRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (recipeId: string | number) => {
      return await likeRecipe(recipeId.toString())
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.all,
        exact: false 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.my,
        exact: false 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.top,
        exact: false 
      })
      
      toast.success("Receita curtida com sucesso!")
    },
    onError: (error: any) => {
      toast.error("Erro ao curtir receita")
      console.error("Error liking recipe:", error)
    },
  })
}