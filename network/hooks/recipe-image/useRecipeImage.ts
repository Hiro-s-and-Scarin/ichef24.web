import { useMutation } from "@tanstack/react-query"
import { searchImageByTitle } from "@/network/actions/recipe-image/actionRecipeImage"

export function useSearchImageByTitle() {
  return useMutation({
    mutationFn: async (title: string) => {
      return await searchImageByTitle(title)
    },
  })
}
