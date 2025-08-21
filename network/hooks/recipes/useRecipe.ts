import { useQuery } from "@tanstack/react-query";
import { getRecipeById } from "@/network/actions/recipes/actionRecipes";

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => await getRecipeById(id),
    enabled: !!id,
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
