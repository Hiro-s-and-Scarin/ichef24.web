"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Heart,
  History,
  Trash2,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RecipeModal } from "@/components/common/recipe-modal";
import { CreateRecipeModal } from "@/components/forms/create-recipe-modal";
import { EditRecipeModal } from "@/components/forms/edit-recipe-modal";
import { EditRecipeAIModal } from "@/components/forms/edit-recipe-ai-modal";
import { RecipeCard } from "@/components/common/recipe-card";
import { Pagination } from "@/components/common/pagination";
import { useDeleteRecipe, useFavoriteRecipes } from "@/network/hooks/recipes/useRecipes";
import { useUserHistory } from "@/network/hooks/recipes/useUserHistory";
import { Recipe as RecipeType } from "@/types/recipe";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys";

export function HistoryPageContent() {
  const { t, ready } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"history">("history");

  const [modalState, setModalState] = useState({
    selectedRecipe: null as RecipeType | null,
    recipeToEdit: null as RecipeType | null,
    recipeToEditWithAI: null as RecipeType | null,
    isRecipeModalOpen: false,
    isCreateModalOpen: false,
    isEditModalOpen: false,
    isEditAIModalOpen: false,
  });

  const { data: historyData, isLoading: isHistoryLoading } = useUserHistory({
    title: searchTerm || undefined,
    page: currentPage,
    limit: 8,
  });

  // Buscar favoritos para verificar se as receitas estão favoritadas
  const { data: favoritesData } = useFavoriteRecipes({
    page: 1,
    limit: 999, // Buscar todos os favoritos para verificar
  });

  // Extrair as receitas do histórico
  const recipes = historyData?.data?.map((historyItem: any) => historyItem.recipe).filter(Boolean) || [];

  // Função para verificar se uma receita está favoritada
  const isRecipeFavorited = (recipeId: number) => {
    if (!favoritesData) return false;
    const data = (favoritesData as any)?.data;
    if (!data || !Array.isArray(data)) return false;
    return data.some((recipe: any) => recipe.id === recipeId);
  };

  const isLoading = isHistoryLoading;

  const deleteRecipeMutation = useDeleteRecipe();

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await deleteRecipeMutation.mutateAsync(recipeId);
      toast.success(t("notification.deleted"));
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.history });
    } catch (error) {
      toast.error(t("error.general"));
    }
  };

  const openRecipeModal = (recipe: RecipeType) => {
    router.push(`/recipe/${recipe.id}`);
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
        (ing: { name: string; amount: string }) => `${ing.name} ${ing.amount}`,
      ) || [],
    instructions:
      recipe.steps?.map(
        (step: { step: number; description: string }) => step.description,
      ) || [],
    nutrition: {
      calories: 0,
      protein: "0g",
      carbs: "0g",
      fat: "0g",
    },
  });

  if (!ready || !t) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  const currentRecipes = Array.isArray(recipes) ? recipes : [];

  // Calcular estatísticas baseadas nas receitas reais
  const totalRecipes = currentRecipes.length;
  const totalLikes = currentRecipes.reduce((acc: number, recipe: RecipeType) => acc + (recipe.likes_count || 0), 0);
  const averageTime = currentRecipes.length > 0
    ? Math.round(currentRecipes.reduce((acc: number, recipe: RecipeType) => acc + (recipe.cooking_time || 0), 0) / currentRecipes.length)
    : 0;

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
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.history });

    setModalState((prev) => ({
      ...prev,
      isCreateModalOpen: false,
    }));
  };

  const handleEditRecipe = (updatedRecipe: unknown) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.history });

    setModalState((prev) => ({
      ...prev,
      isEditModalOpen: false,
    }));
  };


  const handleAIRecipeEdit = (updatedRecipe: unknown) => {
    // Invalidar queries para atualizar o histórico
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.user });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes.history });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <History className="text-orange-500 w-6 h-6 sm:w-8 sm:h-8" />
                {t("history.title")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t("history.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
                <Link href="/">{t("common.back")}</Link>
              </Button>
            </div>
          </div>

          

          {/* Search and Filters */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t("history.search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 dark:border-gray-600 text-sm sm:text-base"
                  />
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
              {/* Recipes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {currentRecipes.map((recipe: RecipeType) => (
                   <div key={recipe.id} className="relative">
                     <RecipeCard 
                       recipe={recipe} 
                       onClick={() => openRecipeModal(recipe)}
                       isFavorite={isRecipeFavorited(recipe.id)}
                     />
                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(recipe);
                        }}
                        className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecipe(String(recipe.id));
                        }}
                        disabled={deleteRecipeMutation.isPending}
                        className="bg-white/90 dark:bg-gray-800/90 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination - removido para evitar problemas de validação */}

          {!isLoading && currentRecipes.length === 0 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                  {activeTab === "history" ? (
                    <History className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Heart className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {t("history.no.recipes")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("history.no.recipes.desc")}
                </p>
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


      {/* Edit Recipe with AI Modal */}
      {modalState.recipeToEditWithAI && (
        <EditRecipeAIModal
          isOpen={modalState.isEditAIModalOpen}
          onClose={() =>
            setModalState((prev) => ({ ...prev, isEditAIModalOpen: false }))
          }
          onSave={handleAIRecipeEdit}
          recipe={modalState.recipeToEditWithAI}
        />
      )}

      {/* Filter Modal - removido para evitar problemas de validação */}
      {/* <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={{} as RecipeParams}
        onFiltersChange={() => {}}
      /> */}

      {/* Paginação */}
      {historyData && historyData.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={historyData.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
