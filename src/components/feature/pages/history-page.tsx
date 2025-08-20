"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Share2,
  Clock,
  Users,
  Star,
  History,
  Trash2,
  Edit,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RecipeModal } from "@/components/common/recipe-modal";
import { CreateRecipeModal } from "@/components/forms/create-recipe-modal";
import { EditRecipeModal } from "@/components/forms/edit-recipe-modal";
import { EditRecipeAIModal } from "@/components/forms/edit-recipe-ai-modal";
import { CreateRecipeAIModal } from "@/components/forms/create-recipe-ai-modal";
import { RecipeCard } from "@/components/common/recipe-card";
import { Pagination } from "@/components/common/pagination";
import { useDeleteRecipe } from "@/network/hooks/recipes/useRecipes";
import { useUserRecipes } from "@/network/hooks/recipes/useUserRecipes";
import { Recipe as RecipeType } from "@/types/recipe";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys";

export function HistoryPageContent() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado consolidado para modais
  const [modalState, setModalState] = useState({
    selectedRecipe: null as RecipeType | null,
    recipeToEdit: null as RecipeType | null,
    recipeToEditWithAI: null as RecipeType | null,
    isRecipeModalOpen: false,
    isCreateModalOpen: false,
    isEditModalOpen: false,
    isEditAIModalOpen: false,
    isCreateAIModalOpen: false,
  });

  // TanStack Query hooks
  const { data: recipesData, isLoading } = useUserRecipes({
    title: searchTerm || undefined,
    page: currentPage,
    limit: 12,
  });

  const recipes = recipesData?.data || [];

  const deleteRecipeMutation = useDeleteRecipe();

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await deleteRecipeMutation.mutateAsync(recipeId);
      toast.success("Receita excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
    } catch (error) {
      toast.error("Erro ao excluir receita");
    }
  };

  const openRecipeModal = (recipe: RecipeType) => {
    setModalState((prev) => ({
      ...prev,
      selectedRecipe: recipe,
      isRecipeModalOpen: true,
    }));
  };

  const adaptRecipeForModal = (recipe: RecipeType) => ({
    id: typeof recipe.id === "string" ? parseInt(recipe.id) : recipe.id,
    title: recipe.title,
    description: recipe.description || "",
    image: recipe.image_url || "",
    time: `${recipe.cooking_time || 0} min`,
    servings: `${recipe.servings || 1} pessoas`,
    difficulty: `Nível ${recipe.difficulty_level || 1}`,
    tags: recipe.tags || [],
    rating: 0,
    ingredients:
      recipe.ingredients?.map(
        (ing: { name: string; amount: string }) => `${ing.name} ${ing.amount}`
      ) || [],
    instructions:
      recipe.steps?.map(
        (step: { step: number; description: string }) => step.description
      ) || [],
    nutrition: {
      calories: 0,
      protein: "0g",
      carbs: "0g",
      fat: "0g",
    },
  });

  const currentRecipes = recipes || [];

  const openEditModal = (recipe: RecipeType) => {
    setModalState((prev) => ({
      ...prev,
      recipeToEdit: recipe,
      isEditModalOpen: true,
    }));
  };

  const openEditAIModal = (recipe: RecipeType) => {
    setModalState((prev) => ({
      ...prev,
      recipeToEditWithAI: recipe,
      isEditAIModalOpen: true,
    }));
  };

    const handleCreateRecipe = (newRecipe: unknown) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
    
    setModalState((prev) => ({
      ...prev,
      isCreateModalOpen: false,
    }));
  };

    const handleEditRecipe = (updatedRecipe: unknown) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
    
    setModalState((prev) => ({
      ...prev,
      isEditModalOpen: false,
    }));
  };

  const handleAIRecipeCreate = (newRecipe: unknown) => {

    // Invalidar queries para atualizar o histórico
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
  };

  const handleAIRecipeEdit = (updatedRecipe: unknown) => {

    // Invalidar queries para atualizar o histórico
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <History className="text-orange-500" />
                {t("history.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t("history.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() =>
                  setModalState((prev) => ({
                    ...prev,
                    isCreateModalOpen: true,
                  }))
                }
              >
                {t("history.create.new")}
              </Button>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                onClick={() =>
                  setModalState((prev) => ({
                    ...prev,
                    isCreateAIModalOpen: true,
                  }))
                }
              >
                {t("history.create.ai")}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">{t("history.back.home")}</Link>
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {currentRecipes.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("history.stats.created")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">4.9</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("history.stats.rating")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">35min</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("history.stats.time")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">267</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("history.stats.views")}
                  </div>
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
                    placeholder={t("history.search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 dark:border-gray-600"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {/* Botão de filtros removido para evitar problemas de validação */}
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterModalOpen(true)}
                    className="border-gray-200 dark:border-gray-600"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {t('history.filters')}
                  </Button> */}
                  <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-3"
                    >
                      {t("history.view.mode.grid")}
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-3"
                    >
                      {t("history.view.mode.list")}
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
                <p className="mt-2 text-gray-500">{t("history.loading")}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Recipes Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {currentRecipes.map((recipe: RecipeType) => (
                    <div key={recipe.id} className="relative">
                      <RecipeCard recipe={recipe} />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(recipe)}
                          className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteRecipe(String(recipe.id))}
                          disabled={deleteRecipeMutation.isPending}
                          className="bg-white/90 dark:bg-gray-800/90 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {currentRecipes.map((recipe: RecipeType) => (
                    <Card
                      key={recipe.id}
                      className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden"
                    >
                      <div className="flex">
                        <div className="w-32 h-24 relative flex-shrink-0">
                          <Image
                            src={
                              recipe.image_url ||
                              "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop"
                            }
                            alt={recipe.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">
                                {recipe.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                                {recipe.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{recipe.cooking_time} min</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{recipe.servings} pessoas</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4" />
                                  <span>Nível {recipe.difficulty_level}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                  <span>
                                    {t("history.views")} {recipe.views_count}
                                  </span>
                                  <span>
                                    {t("history.likes")} {recipe.likes_count}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteRecipe(String(recipe.id))
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="w-4 h-4" />
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

          {/* Pagination - removido para evitar problemas de validação */}

          {!isLoading && currentRecipes.length === 0 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                  <History className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {t("history.no.recipes")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("history.no.recipes.desc")}
                </p>
                <Button
                  onClick={() =>
                    setModalState((prev) => ({
                      ...prev,
                      isCreateAIModalOpen: true,
                    }))
                  }
                >
                  {t("dashboard.ai.button")}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={
          modalState.selectedRecipe
            ? adaptRecipeForModal(modalState.selectedRecipe)
            : null
        }
        isOpen={modalState.isRecipeModalOpen}
        onClose={() =>
          setModalState((prev) => ({ ...prev, isRecipeModalOpen: false }))
        }
        onFavorite={() => {}}
        isFavorite={false}
      />

      {/* Edit Recipe Modal */}
      <EditRecipeModal
        recipe={
          modalState.recipeToEdit
            ? {
                id: Number(modalState.recipeToEdit.id),
                user_id: modalState.recipeToEdit.user_id || 0,
                title: modalState.recipeToEdit.title,
                description: modalState.recipeToEdit.description || "",
                ingredients: modalState.recipeToEdit.ingredients || [],
                steps: modalState.recipeToEdit.steps || [],
                cooking_time: modalState.recipeToEdit.cooking_time,
                servings: modalState.recipeToEdit.servings,
                difficulty_level: modalState.recipeToEdit.difficulty_level,
                cuisine_type: modalState.recipeToEdit.cuisine_type || "",
                tags: modalState.recipeToEdit.tags || [],
                image_url: modalState.recipeToEdit.image_url,
                is_ai_generated:
                  modalState.recipeToEdit.is_ai_generated || false,
                ai_prompt: modalState.recipeToEdit.ai_prompt || "",
                ai_model_version:
                  modalState.recipeToEdit.ai_model_version || "",
                is_public: modalState.recipeToEdit.is_public ?? true,
                views_count: modalState.recipeToEdit.views_count || 0,
                likes_count: modalState.recipeToEdit.likes_count || 0,
                createdAt: modalState.recipeToEdit.createdAt || "",
                updatedAt: modalState.recipeToEdit.updatedAt || "",
              }
            : null
        }
        isOpen={modalState.isEditModalOpen}
        onClose={() =>
          setModalState((prev) => ({ ...prev, isEditModalOpen: false }))
        }
        onSave={handleEditRecipe}
      />

      {/* Create Recipe Modal */}
      <CreateRecipeModal
        isOpen={modalState.isCreateModalOpen}
        onClose={() =>
          setModalState((prev) => ({ ...prev, isCreateModalOpen: false }))
        }
        onSave={handleCreateRecipe}
      />

      {/* Create AI Recipe Modal */}
      <CreateRecipeAIModal
        isOpen={modalState.isCreateAIModalOpen}
        onClose={() =>
          setModalState((prev) => ({ ...prev, isCreateAIModalOpen: false }))
        }
        onSave={handleAIRecipeCreate}
      />

      {/* Edit Recipe with AI Modal */}
      <EditRecipeAIModal
        isOpen={modalState.isEditAIModalOpen}
        onClose={() =>
          setModalState((prev) => ({ ...prev, isEditAIModalOpen: false }))
        }
        onSave={handleAIRecipeEdit}
        recipe={modalState.recipeToEditWithAI}
      />

      {/* Filter Modal - removido para evitar problemas de validação */}
      {/* <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={{} as RecipeParams}
        onFiltersChange={() => {}}
      /> */}

      {/* Paginação */}
      {recipesData?.pagination && recipesData.pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={recipesData.pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
