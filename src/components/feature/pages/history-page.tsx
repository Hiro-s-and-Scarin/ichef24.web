"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Share2, Clock, Users, Star, History, Filter, Trash2, Edit, ChefHat } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RecipeModal } from "@/components/common/recipe-modal";
import { CreateRecipeModal } from "@/components/forms/create-recipe-modal";
import { EditRecipeModal } from "@/components/forms/edit-recipe-modal";
import { EditRecipeAIModal } from "@/components/forms/edit-recipe-ai-modal";
import { CreateRecipeAIModal } from "@/components/forms/create-recipe-ai-modal";
import { useAuth } from "@/contexts/auth-context";
import { RecipeCard } from "@/components/common/recipe-card";
import { Pagination } from "@/components/common/pagination";
import { FilterModal } from "@/components/forms/filter-modal";
import { useMyRecipes, useDeleteRecipe } from "@/network/hooks/recipes/useRecipes";
import { useCurrentUser } from "@/network/hooks/users/useUsers";
import { useTranslation } from "react-i18next";
import { Recipe as RecipeType } from "@/types/recipe";
import { toast } from "sonner";
import { RecipeParams } from "@/types/recipe";

export function HistoryPageContent() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [recipeToEdit, setRecipeToEdit] = useState<RecipeType | null>(null);
  const [recipeToEditWithAI, setRecipeToEditWithAI] = useState<RecipeType | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditAIModalOpen, setIsEditAIModalOpen] = useState(false);
  const [isCreateAIModalOpen, setIsCreateAIModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Filtros para a API
  const [filters, setFilters] = useState<RecipeParams>({
    page: currentPage,
    limit: 6
  });

  const handleFiltersChange = (newFilters: Partial<RecipeParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    setCurrentPage(1);
  };

  // TanStack Query hooks
  const { data: recipesData, isLoading } = useMyRecipes({
    page: currentPage,
    limit: 6,
  })

  const recipes = recipesData?.data || []
  const pagination = recipesData?.pagination

  const deleteRecipeMutation = useDeleteRecipe();



  const { data: currentUser } = useCurrentUser()

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await deleteRecipeMutation.mutateAsync(recipeId)
      toast.success("Receita excluída com sucesso!")
    } catch (error) {
      console.error("Error deleting recipe:", error)
      toast.error("Erro ao excluir receita")
    }
  }

  const openRecipeModal = (recipe: RecipeType) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  // Função para adaptar RecipeType para o formato esperado pelo RecipeModal
  const adaptRecipeForModal = (recipe: RecipeType) => ({
    id: typeof recipe.id === 'string' ? parseInt(recipe.id) : recipe.id,
    title: recipe.title,
    description: recipe.description || "",
    image: recipe.image_url || "",
    time: `${recipe.cooking_time || 0} min`,
    servings: `${recipe.servings || 1} pessoas`,
    difficulty: `Nível ${recipe.difficulty_level || 1}`,
    tags: recipe.tags || [],
    rating: 0, // Não temos rating no tipo Recipe
    ingredients: recipe.ingredients?.map((ing: any) => `${ing.name} ${ing.amount}`) || [],
    instructions: recipe.steps?.map((step: any) => step.description) || [],
    nutrition: {
      calories: 0,
      protein: "0g",
      carbs: "0g",
      fat: "0g"
    }
  });


  const currentRecipes = recipes || [];
  const totalPages = Math.ceil((currentRecipes.length || 0) / 6);

  const handleApplyFilters = (filters: string[]) => {
    setSelectedFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const openEditModal = (recipe: RecipeType) => {
    setRecipeToEdit(recipe);
    setIsEditModalOpen(true);
  };

  const openEditAIModal = (recipe: RecipeType) => {
    setRecipeToEditWithAI(recipe);
    setIsEditAIModalOpen(true);
  };

  const handleCreateRecipe = (newRecipe: any) => {
    // Add logic to add new recipe to list or refetch
    console.log('Recipe created:', newRecipe);
  };

  const handleEditRecipe = (updatedRecipe: any) => {
    // Add logic to update recipe in list or refetch
    console.log('Recipe updated:', updatedRecipe);
  };

  const handleAIRecipeCreate = (newRecipe: any) => {
    console.log('AI Recipe created:', newRecipe);
  };

  const handleAIRecipeEdit = (updatedRecipe: any) => {
    console.log('AI Recipe updated:', updatedRecipe);
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
                Histórico de Receitas
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Suas criações culinárias organizadas por data</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Nova Receita
              </Button>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                onClick={() => setIsCreateAIModalOpen(true)}
              >
                Criar com IA
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Voltar ao Início</Link>
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{currentRecipes.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Receitas Criadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">4.9</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Nota Média</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">35min</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">267</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total de Visualizações</div>
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
                    placeholder="Buscar nas suas receitas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 dark:border-gray-600"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterModalOpen(true)}
                    className="border-gray-200 dark:border-gray-600"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                  <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-3"
                    >
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-3"
                    >
                      Lista
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
                <p className="mt-2 text-gray-500">Carregando receitas...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Recipes Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {currentRecipes.map((recipe) => (
                    <div key={recipe.id} className="relative">
                      <RecipeCard
                        recipe={recipe}
                      />
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
                  {currentRecipes.map((recipe) => (
                    <Card key={recipe.id} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden">
                      <div className="flex">
                        <div className="w-32 h-24 relative flex-shrink-0">
                          <Image
                            src={recipe.image_url || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop"}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">{recipe.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{recipe.description}</p>
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
                                  <span>👁️ {recipe.views_count}</span>
                                  <span>❤️ {recipe.likes_count}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRecipe(String(recipe.id))}
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

          {!isLoading && currentRecipes.length === 0 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                  <History className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Nenhuma receita encontrada</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Você ainda não criou nenhuma receita. Comece criando sua primeira obra-prima culinária!
                </p>
                <Button onClick={() => setIsCreateAIModalOpen(true)}>
                  Criar Receita com IA
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe ? adaptRecipeForModal(selectedRecipe) : null}
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        onFavorite={() => {}}
        isFavorite={false}
      />

      {/* Edit Recipe Modal */}
      <EditRecipeModal
        recipe={recipeToEdit ? {
          id: String(recipeToEdit.id),
          title: recipeToEdit.title,
          description: recipeToEdit.description || "",
          image: recipeToEdit.image_url,
          time: `${recipeToEdit.cooking_time || 0} min`,
          servings: `${recipeToEdit.servings || 1} pessoas`,
          difficulty: `Nível ${recipeToEdit.difficulty_level || 1}`,
          tags: recipeToEdit.tags || [],
          ingredients: recipeToEdit.ingredients || [],
          instructions: recipeToEdit.steps || []
        } : null}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditRecipe}
      />

      {/* Create Recipe Modal */}
      <CreateRecipeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRecipe}
      />

      {/* Create AI Recipe Modal */}
      <CreateRecipeAIModal
        isOpen={isCreateAIModalOpen}
        onClose={() => setIsCreateAIModalOpen(false)}
        onSave={handleAIRecipeCreate}
      />

      {/* Edit Recipe with AI Modal */}
      <EditRecipeAIModal
        isOpen={isEditAIModalOpen}
        onClose={() => setIsEditAIModalOpen(false)}
        onSave={handleAIRecipeEdit}
        recipe={recipeToEditWithAI}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}