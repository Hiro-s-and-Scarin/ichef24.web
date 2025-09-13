"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Heart,
  History,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { EditRecipeModal } from "@/components/forms/edit-recipe-modal";

import { RecipeCard } from "@/components/common/recipe-card";
import { Pagination } from "@/components/common/pagination";
import {
  useRecipes,
  useMyRecipes,
  useFavoriteRecipes,
  useRemoveFromFavorites,
  useDeleteRecipe,
} from "@/network/hooks/recipes/useRecipes";
import { useCurrentUser } from "@/network/hooks/users/useUsers";
import { useTranslation } from "react-i18next";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys";
import { toast } from "sonner";
import { Recipe } from "@/types/recipe";

export function FavoritesPageContent() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { hasRecipeBookAccess, isFreePlan } = usePlanAccess();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"recipes" | "favorites">("recipes");

  const [modalState, setModalState] = useState({
    recipeToEdit: null as any,
    isEditModalOpen: false,
  });

  // TanStack Query hooks
  const {
    data: userRecipes,
    isLoading: isLoadingRecipes,
  } = useMyRecipes({
    title: searchTerm || undefined,
    page: currentPage,
    limit: 8,
  });

  const {
    data: favoritesData,
    isLoading: isLoadingFavorites,
  } = useFavoriteRecipes({
    page: currentPage,
    limit: 8,
    title: searchTerm || undefined,
  });

  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const deleteRecipeMutation = useDeleteRecipe();



  const removeFavorite = async (id: string | number) => {
    try {
      await removeFromFavoritesMutation.mutateAsync(id);
    } catch (error) {
      toast.error("Erro ao remover dos favoritos");
    }
  };

  const openEditModal = (recipe: Recipe) => {
    setModalState({
      ...modalState,
      recipeToEdit: recipe,
      isEditModalOpen: true,
    });
  };

  const closeEditModal = () => {
    setModalState({
      ...modalState,
      recipeToEdit: null,
      isEditModalOpen: false,
    });
  };

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

  const openRecipeModal = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  const currentData = activeTab === "recipes" ? userRecipes : favoritesData;
  const isLoading = activeTab === "recipes" ? isLoadingRecipes : isLoadingFavorites;
  const currentRecipes = (currentData as any)?.data || [];
  
  const totalPages = activeTab === "recipes" 
    ? ((currentData as any)?.totalPages || 1)
    : ((currentData as any)?.pagination?.totalPages || 1);



  if (isFreePlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Heart className="text-red-500 fill-red-500" />
                  {t("myRecipeBook.title")}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("myRecipeBook.subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/home">{t("common.back")}</Link>
                </Button>
              </div>
            </div>

            {/* Upgrade Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-white fill-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {t("myRecipeBook.upgrade.title")}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t("myRecipeBook.upgrade.description")}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{t("myRecipeBook.upgrade.feature1")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{t("myRecipeBook.upgrade.feature2")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{t("myRecipeBook.upgrade.feature3")}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
                      <Link href="/plans">
                        {t("myRecipeBook.upgrade.button")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
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
                Meu livro de Receitas
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Suas receitas salvas no livro
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/history">{t("common.back")}</Link>
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "recipes" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("recipes");
                setCurrentPage(1);
                setSearchTerm("");
                // Invalidar queries para garantir dados atualizados
                queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false });
              }}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              {t("myRecipeBook.tabs.myRecipes")}
            </Button>
            <Button
              variant={activeTab === "favorites" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("favorites");
                setCurrentPage(1);
                setSearchTerm("");
                // Invalidar queries para garantir dados atualizados
                queryClient.invalidateQueries({ queryKey: queryKeys.recipes.favorites, exact: false });
              }}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              {t("myRecipeBook.tabs.favorites")}
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={
                      activeTab === "recipes" 
                        ? t("myRecipeBook.search.myRecipes.placeholder")
                        : t("myRecipeBook.search.favorites.placeholder")
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 dark:border-gray-600"
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
                <p className="mt-2 text-gray-500">{t("common.loading")}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Recipes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {activeTab === "recipes" ? (
                  // Receitas do usuário
                  currentRecipes.map((recipe: Recipe) => (
                    <div key={recipe.id} className="relative group">
                      <RecipeCard
                        recipe={recipe}
                        onClick={() => openRecipeModal(recipe)}
                        isFavorite={false}
                        showActions={true}
                        onEdit={() => openEditModal(recipe)}
                        onDelete={() => handleDeleteRecipe(String(recipe.id))}
                        isDeleting={deleteRecipeMutation.isPending}
                      />
                    </div>
                  ))
                ) : (
                  // Receitas favoritas
                  currentRecipes.map((recipe: Recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => openRecipeModal(recipe)}
                      isFavorite={true}
                    />
                  ))
                )}
              </div>
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

          {!isLoading &&
            (!currentRecipes || currentRecipes.length === 0) && (
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {activeTab === "recipes" ? t("myRecipeBook.no.myRecipes") : t("myRecipeBook.no.favorites")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {activeTab === "recipes" 
                      ? t("myRecipeBook.no.myRecipes.desc")
                      : t("myRecipeBook.no.favorites.desc")
                    }
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      </div>


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
                is_ai_generated: modalState.recipeToEdit.is_ai_generated || false,
                ai_prompt: modalState.recipeToEdit.ai_prompt || "",
                ai_model_version: modalState.recipeToEdit.ai_model_version || "",
                is_public: modalState.recipeToEdit.is_public ?? true,
                views_count: modalState.recipeToEdit.views_count || 0,
                likes_count: modalState.recipeToEdit.likes_count || 0,
                createdAt: modalState.recipeToEdit.createdAt || "",
                updatedAt: modalState.recipeToEdit.updatedAt || "",
              }
            : null
        }
        isOpen={modalState.isEditModalOpen}
        onClose={closeEditModal}
        onSave={() => {
          closeEditModal();
          // Invalidar queries para atualizar a lista
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all, exact: false });
          queryClient.invalidateQueries({ queryKey: queryKeys.recipes.my, exact: false });
        }}
      />

    </div>
  );
}
