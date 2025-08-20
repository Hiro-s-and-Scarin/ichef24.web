"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/api"
import { queryKeys } from "@/lib/config/query-keys"

import { RecipeParams } from "@/types/recipe"

export function useUserRecipes(params: RecipeParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.recipes.user, params],
    queryFn: async () => {
      // Usar a rota /recipes que retorna todas as receitas (incluindo as do usuário atual)
      const { data } = await api.get('/recipes', { params })
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
