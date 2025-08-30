"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
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
  likeRecipe,
  postSaveAIRecipe,
  putUpdateAIRecipe
} from "@/network/actions/recipes/actionRecipes"
import { Recipe, RecipeParams, CreateRecipeData, AIRecipeRequest, FavoriteResponse } from "@/types/recipe"
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
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (body: CreateRecipeData) => {
      return await postRecipe(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.top, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      toast.success(t("success.recipe.created"))
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        const message = error.response.data?.message || t("error.recipe.limit.manual");
        toast.error(message);
      } else if (error.response?.status === 402) {
        const message = error.response.data?.message || t("error.plan.expired");
        toast.error(message);
      } else if (error.response?.status === 429) {
        toast.error(t("error.rate.limit"));
      } else {
        toast.error(error.response?.data?.message || t("error.create.recipe"));
      }
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string | number } & Partial<CreateRecipeData>) => {
      return await putRecipe(id, data)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.one(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.top, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      toast.success(t("success.recipe.updated"))
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        const message = error.response.data?.message || t("error.recipe.limit.manual");
        toast.error(message);
      } else if (error.response?.status === 402) {
        const message = error.response.data?.message || t("error.plan.expired");
        toast.error(message);
      } else if (error.response?.status === 429) {
        toast.error(t("error.rate.limit"));
      } else {
        toast.error(error.response?.data?.message || t("error.update.recipe"));
      }
    },
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (id: string | number) => {
      return await deleteRecipe(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.top, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      toast.success(t("success.recipe.deleted"))
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("error.delete.recipe"))
    },
  })
}

export function useFavoriteRecipes(params: RecipeParams = {}) {
  return useQuery<FavoriteResponse>({
    queryKey: [...queryKeys.recipes.favorites, params],
    queryFn: async () => await getFavoriteRecipes(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAddToFavorites() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (recipeId: string | number) => {
      return await postFavoriteRecipe(recipeId)
    },
    onSuccess: () => {
      // Invalidar todas as queries de favoritos (incluindo com parâmetros)
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.favorites,
        exact: false 
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.top, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      toast.success(t("success.recipe.favorited"))
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        const message = error.response.data?.message || t("error.plan.no.permission");
        toast.error(message);
      } else if (error.response?.status === 402) {
        const message = error.response.data?.message || t("error.plan.expired");
        toast.error(message);
      } else if (error.response?.status === 429) {
        toast.error(t("error.rate.limit"));
      } else {
        toast.error(error.response?.data?.message || t("error.add.favorite"));
      }
    },
  })
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (recipeId: string | number) => {
      return await deleteFavoriteRecipe(recipeId)
    },
    onSuccess: () => {
      // Invalidar todas as queries de favoritos (incluindo com parâmetros)
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.favorites,
        exact: false 
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.top, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      toast.success(t("success.recipe.unfavorited"))
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        const message = error.response.data?.message || t("error.plan.no.permission");
        toast.error(message);
      } else if (error.response?.status === 402) {
        const message = error.response.data?.message || t("error.plan.expired");
        toast.error(message);
      } else if (error.response?.status === 429) {
        toast.error(t("error.rate.limit"));
      } else {
        toast.error(error.response?.data?.message || t("error.remove.favorite"));
      }
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
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (body: AIRecipeRequest) => {
      return await postGenerateRecipeWithAI(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.top, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      toast.success(t("success.recipe.generated.ai"))
    },
    onError: (error: any) => {
      // Tratar erros específicos de limite de plano
      if (error.response?.status === 403) {
        const message = error.response.data?.message || t("error.recipe.limit.ai");
        toast.error(message);
      } else if (error.response?.status === 402) {
        const message = error.response.data?.message || t("error.plan.expired");
        toast.error(message);
      } else if (error.response?.status === 429) {
        toast.error(t("error.rate.limit"));
      } else {
        toast.error(error.response?.data?.message || t("error.generate.recipe.ai"));
      }
    },
  })
}

export function useSaveAIRecipe() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (recipeData: string) => {
      return await postSaveAIRecipe(recipeData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.top, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      toast.success(t("success.recipe.saved"))
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        const message = error.response.data?.message || t("error.recipe.limit.ai");
        toast.error(message);
      } else if (error.response?.status === 402) {
        const message = error.response.data?.message || t("error.plan.expired");
        toast.error(message);
      } else if (error.response?.status === 429) {
        toast.error(t("error.rate.limit"));
      } else {
        toast.error(error.response?.data?.message || t("error.save.recipe"));
      }
    },
  })
}

export function useUpdateAIRecipe() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async ({ id, recipeData }: { id: string | number, recipeData: string }) => {
      return await putUpdateAIRecipe(id, recipeData)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.one(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.top, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      toast.success(t("success.recipe.updated.ai"))
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        const message = error.response.data?.message || t("error.recipe.limit.ai");
        toast.error(message);
      } else if (error.response?.status === 402) {
        const message = error.response.data?.message || t("error.plan.expired");
        toast.error(message);
      } else if (error.response?.status === 404) {
        toast.error(t("error.recipe.not.found"));
      } else if (error.response?.status === 429) {
        toast.error(t("error.rate.limit"));
      } else {
        toast.error(error.response?.data?.message || t("error.update.recipe.ai"));
      }
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
  const { t } = useTranslation()

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
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.user,
        exact: false 
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.favorites,
        exact: false 
      })
      
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topRecipes })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.topChefs })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.community.posts, exact: false })
      
      toast.success(t("success.recipe.liked"))
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        const message = error.response.data?.message || t("error.plan.no.permission");
        toast.error(message);
      } else if (error.response?.status === 402) {
        const message = error.response.data?.message || t("error.plan.expired");
        toast.error(message);
      } else if (error.response?.status === 429) {
        toast.error(t("error.rate.limit"));
      } else {
        toast.error(error.response?.data?.message || t("error.like.recipe"));
      }
    },
  })
}

export function useIsFavorite(recipeId: string | number) {
  const { data: favorites } = useFavoriteRecipes()
  
  return useQuery({
    queryKey: [...queryKeys.recipes.favorites, 'isFavorite', recipeId],
    queryFn: async () => {
      if (!favorites?.data) return false
      return favorites.data.some(favorite => favorite.id === Number(recipeId))
    },
    enabled: !!favorites?.data,
    staleTime: 1000 * 60 * 5,
  })
}