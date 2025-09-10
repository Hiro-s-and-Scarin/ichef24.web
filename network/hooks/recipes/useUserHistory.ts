"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/api"
import { queryKeys } from "@/lib/config/query-keys"
import { RecipeParams } from "@/types/recipe"

export function useUserHistory(params: RecipeParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.recipes.history, params],
    queryFn: async () => {
      // Usar a rota /recipe-history/user que retorna apenas o histórico do usuário
      const { data } = await api.get('/recipe-history/user', { params })
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
