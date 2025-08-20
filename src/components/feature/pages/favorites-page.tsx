"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, Share2, Clock, Users, Star, Trash2, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RecipeModal } from "@/components/common/recipe-modal"
import { useAuth } from "@/contexts/auth-context"
import { RecipeCard } from "@/components/common/recipe-card"
import { Pagination } from "@/components/common/pagination"
import { FilterModal } from "@/components/forms/filter-modal"
import { useFavoriteRecipes, useRemoveFromFavorites } from "@/network/hooks/recipes/useRecipes"
import { useCurrentUser } from "@/network/hooks/users/useUsers"
import { useTranslation } from "react-i18next"
import { CreateRecipeAIModal } from "@/components/forms/create-recipe-ai-modal"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/config/query-keys"
import { toast } from "sonner"

export function FavoritesPageContent() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  // Estado consolidado para modais
  const [modalState, setModalState] = useState({
    selectedRecipe: null as any,
    isRecipeModalOpen: false,
    isFilterModalOpen: false,
    isCreateAIModalOpen: false
  })

  // TanStack Query hooks
  const { data: favorites, isLoading, error } = useFavoriteRecipes({
    page: currentPage,
    limit: 12,
    title: searchTerm || undefined,
    tags: selectedFilters
  })
  const removeFromFavoritesMutation = useRemoveFromFavorites()

  const { data: currentUser } = useCurrentUser()

  const removeFavorite = async (id: string | number) => {
    try {
      await removeFromFavoritesMutation.mutateAsync(id)
    } catch (error) {
      toast.error("Erro ao remover dos favoritos")
    }
  }

  const openRecipeModal = (recipe: any) => {
    setModalState(prev => ({
      ...prev,
      selectedRecipe: recipe,
      isRecipeModalOpen: true
    }))
  }


  const currentFavorites = favorites?.data || []
  const totalPages = favorites?.pagination?.totalPages || 1

  const handleApplyFilters = (filters: string[]) => {
    setSelectedFilters(filters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Heart className="text-red-500 fill-red-500" />
                {t('favorites.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{t('favorites.subtitle')}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard">{t('common.back')}</Link>
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{favorites?.pagination?.total || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('favorites.title')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">4.8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('history.stats.rating')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">25min</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('history.stats.time')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('recipe.difficulty')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t('favorites.search.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 dark:border-gray-600"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModalState(prev => ({ ...prev, isFilterModalOpen: true }))}
                    className="border-gray-200 dark:border-gray-600"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {t('favorites.filters')}
                  </Button>
                  <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-3"
                    >
                      {t('history.view.mode.grid')}
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-3"
                    >
                      {t('history.view.mode.list')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">{t('common.loading')}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Favorites Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {currentFavorites.map((favorite: any) => {

                    
                    // Verificar se a receita existe antes de renderizar
                    if (!favorite.recipe) {
                      return null
                    }
                    
                    // Criar uma cópia limpa da receita para evitar problemas de referência
                    const cleanRecipe = {
                      id: favorite.recipe.id,
                      user_id: favorite.recipe.user_id,
                      title: favorite.recipe.title,
                      description: favorite.recipe.description,
                      cooking_time: favorite.recipe.cooking_time,
                      servings: favorite.recipe.servings,
                      difficulty_level: favorite.recipe.difficulty_level,
                      cuisine_type: favorite.recipe.cuisine_type,
                      tags: favorite.recipe.tags,
                      image_url: favorite.recipe.image_url,
                      ingredients: favorite.recipe.ingredients,
                      steps: favorite.recipe.steps,
                      is_ai_generated: favorite.recipe.is_ai_generated,
                      ai_prompt: favorite.recipe.ai_prompt,
                      ai_model_version: favorite.recipe.ai_model_version,
                      is_public: favorite.recipe.is_public,
                      views_count: favorite.recipe.views_count,
                      likes_count: favorite.recipe.likes_count,
                      user_is_liked: favorite.recipe.user_is_liked || [],
                      createdAt: favorite.recipe.createdAt,
                      updatedAt: favorite.recipe.updatedAt
                    }
                    

                    
                    return (
                      <RecipeCard
                        key={favorite.id}
                        recipe={cleanRecipe}
                        onClick={() => openRecipeModal(cleanRecipe)}
                        isFavorite={true}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {currentFavorites.map((favorite: any) => (
                    <Card key={favorite.id} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden">
                      <div className="flex">
                        <div className="w-32 h-24 relative flex-shrink-0">
                          <Image
                            src={favorite.recipe?.image_url || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop"}
                            alt={favorite.recipe?.title || "Receita"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">{favorite.recipe?.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{favorite.recipe?.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{favorite.recipe?.cooking_time} {t('recipe.time')}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{favorite.recipe?.servings} {t('recipe.servings')}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400" />
                                  <span>{favorite.recipe?.difficulty_level}/5</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFavorite(favorite.recipe?.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Heart className="w-4 h-4 fill-current" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {!isLoading && (!currentFavorites || currentFavorites.length === 0) && (
            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('favorites.no.favorites')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Você ainda não tem receitas favoritas. Comece explorando e salvando suas receitas preferidas!
                </p>
                <Button onClick={() => setModalState(prev => ({ ...prev, isCreateAIModalOpen: true }))}>
                  {t('dashboard.ai.button')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recipe Modal */}
      {modalState.selectedRecipe && (
        <RecipeModal
          recipe={modalState.selectedRecipe}
          isOpen={modalState.isRecipeModalOpen}
          onClose={() => setModalState(prev => ({ ...prev, isRecipeModalOpen: false }))}
          onFavorite={() => removeFavorite(modalState.selectedRecipe.id)}
          isFavorite={true}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={modalState.isFilterModalOpen}
        onClose={() => setModalState(prev => ({ ...prev, isFilterModalOpen: false }))}
        filters={{ tags: selectedFilters }}
        onFiltersChange={(newFilters: any) => handleApplyFilters(newFilters.tags || [])}
      />

      {/* Create Recipe AI Modal */}
      <CreateRecipeAIModal
        isOpen={modalState.isCreateAIModalOpen}
        onClose={() => setModalState(prev => ({ ...prev, isCreateAIModalOpen: false }))}
        onSave={(recipe) => {
          setModalState(prev => ({ ...prev, isCreateAIModalOpen: false }))
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites })
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user })
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my })
        }}
      />
    </div>
  )
}