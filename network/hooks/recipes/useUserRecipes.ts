"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/api"
import { queryKeys } from "@/lib/config/query-keys"

export function useUserRecipes() {
  return useQuery({
    queryKey: [...queryKeys.recipes.user],
    queryFn: async () => {
      // Usar a rota /recipes que retorna todas as receitas (incluindo as do usuário atual)
      const { data } = await api.get('/recipes')
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
