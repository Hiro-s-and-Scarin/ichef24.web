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
  postRecipeReview,
  postGenerateRecipeWithAI,
  postImproveRecipeWithAI
} from "@/network/actions/recipes/actionRecipes"
import { queryKeys } from "@/lib/query-keys"
import { RecipeParams, CreateRecipeData, AIRecipeRequest } from "@/types/recipe"

export function useGetRecipes(params: RecipeParams = {}) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.recipes.list(params),
    queryFn: async () => await getRecipes(params),
    retry: 0,
  })

  return {
    data: data?.data,
    isLoading,
  }
}

export function useGetRecipeById(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.recipes.detail(id),
    queryFn: async () => await getRecipeById(id),
    enabled: !!id,
    retry: 0,
  })

  return {
    data,
    isLoading,
  }
}

export function useGetFavoriteRecipes(params: RecipeParams = {}) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.recipes.favorites(),
    queryFn: async () => await getFavoriteRecipes(params),
    retry: 0,
  })

  return {
    data: data?.data,
    isLoading,
  }
}

export function useGetMyRecipes(params: RecipeParams = {}) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.recipes.history(),
    queryFn: async () => await getMyRecipes(params),
    retry: 0,
  })

  return {
    data: data?.data,
    isLoading,
  }
}

export function useGetRecipeTags() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.recipes.tags,
    queryFn: async () => await getRecipeTags(),
    retry: 0,
  })

  return {
    data,
    isLoading,
  }
}

export function useGetRecipeCategories() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.recipes.categories,
    queryFn: async () => await getRecipeCategories(),
    retry: 0,
  })

  return {
    data,
    isLoading,
  }
}

export function usePostRecipe() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (body: CreateRecipeData) => {
      return await postRecipe(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.history() })
      toast.success("Receita criada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar receita")
      console.error("Error creating recipe:", error)
    },
  })

  return mutate
}

export function usePutRecipe(id: string) {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (body: Partial<CreateRecipeData>) => {
      return await putRecipe(id, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.history() })
      toast.success("Receita atualizada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar receita")
      console.error("Error updating recipe:", error)
    },
  })

  return mutate
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (id: string) => {
      return await deleteRecipe(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.history() })
      toast.success("Receita excluída com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao excluir receita")
      console.error("Error deleting recipe:", error)
    },
  })

  return mutate
}

export function useToggleFavoriteRecipe() {
  const queryClient = useQueryClient()

  const addToFavorites = useMutation({
    mutationFn: async (recipeId: string) => {
      return await postFavoriteRecipe(recipeId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites() })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      toast.success("Receita adicionada aos favoritos!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao adicionar aos favoritos")
      console.error("Error adding to favorites:", error)
    },
  })

  const removeFromFavorites = useMutation({
    mutationFn: async (recipeId: string) => {
      return await deleteFavoriteRecipe(recipeId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites() })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      toast.success("Receita removida dos favoritos!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao remover dos favoritos")
      console.error("Error removing from favorites:", error)
    },
  })

  return { addToFavorites, removeFromFavorites }
}

export function usePostRecipeReview() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async ({ recipeId, ...body }: { recipeId: string; rating: number; comment?: string }) => {
      return await postRecipeReview(recipeId, body)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.detail(variables.recipeId) })
      toast.success("Avaliação enviada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao enviar avaliação")
      console.error("Error posting review:", error)
    },
  })

  return mutate
}

export function useGenerateRecipeWithAI() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async (body: AIRecipeRequest) => {
      return await postGenerateRecipeWithAI(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.history() })
      toast.success("Receita gerada com IA com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao gerar receita com IA")
      console.error("Error generating recipe with AI:", error)
    },
  })

  return mutate
}

export function useImproveRecipeWithAI() {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: async ({ recipeId, prompt }: { recipeId: string; prompt: string }) => {
      return await postImproveRecipeWithAI(recipeId, { prompt })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.detail(variables.recipeId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.history() })
      toast.success("Receita melhorada com IA com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao melhorar receita com IA")
      console.error("Error improving recipe with AI:", error)
    },
  })

  return mutate
}