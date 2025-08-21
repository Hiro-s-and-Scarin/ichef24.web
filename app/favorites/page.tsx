"use client"

import { useState } from "react"
import { FavoriteRecipeCard, Pagination } from "@/components/common"
import { useFavoriteRecipes } from "@/network/hooks"
import { RecipeParams } from "@/types/recipe"

export default function Favorites() {
  const [filters, setFilters] = useState<RecipeParams>({
    page: 1,
    limit: 10
  })

  const { data: recipesData, isLoading } = useFavoriteRecipes(filters)

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando favoritos...</p>
          </div>
        </div>
      </div>
    )
  }

  const recipes = recipesData?.data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Suas Receitas Favoritas
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Acesse rapidamente todas as receitas que você salvou para fazer depois
            </p>
          </div>

          {/* Recipes Grid */}
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {recipes.map((recipe: any) => (
                <FavoriteRecipeCard key={recipe.id} recipe={recipe.recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">❤️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma receita favoritada
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comece a explorar receitas e salve suas favoritas para acessar facilmente depois
              </p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Explorar Receitas
              </a>
            </div>
          )}

          {/* Pagination */}
          {recipesData && recipesData.pagination && recipesData.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={filters.page || 1}
                totalPages={recipesData.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}