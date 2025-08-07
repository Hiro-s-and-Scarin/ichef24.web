"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Share2, Clock, Users, Star, History, Filter, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RecipeModal } from "@/components/recipe-modal";
import { CreateRecipeModal } from "@/components/create-recipe-modal";
import { EditRecipeModal } from "@/components/edit-recipe-modal";
import { EditRecipeAIModal } from "@/components/edit-recipe-ai-modal";
import { CreateRecipeAIModal } from "@/components/create-recipe-ai-modal";
import { useAuth } from "@/contexts/auth-context";
import { RecipeCard } from "@/components/recipe-card";
import { Pagination } from "@/components/pagination";
import { FilterModal } from "@/components/filter-modal";
import { useGetMyRecipes, useDeleteRecipe } from "@/network/hooks/recipes/useRecipes";
import { useTranslation } from "react-i18next";
import { Recipe as RecipeType } from "@/types/recipe";

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

  // TanStack Query hooks
  const { data: recipes, isLoading } = useGetMyRecipes({
    page: currentPage,
    limit: 6,
    search: searchTerm,
    tags: selectedFilters
  });
  const deleteRecipeMutation = useDeleteRecipe();

  const mockRecipes: RecipeType[] = [
    {
      id: "1",
      title: "Pasta Carbonara Italiana",
      description: "Receita autêntica de carbonara com ovos, queijo pecorino e guanciale",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d1e5?w=400&h=300&fit=crop",
      time: "30 min",
      servings: "4 pessoas",
      difficulty: "medium",
      tags: ["Italiano", "Massa", "Queijo"],
      ingredients: [
        { name: "Espaguete", amount: "400g" },
        { name: "Guanciale", amount: "200g" },
        { name: "Ovos inteiros", amount: "4" },
        { name: "Queijo pecorino romano", amount: "100g" },
        { name: "Pimenta preta moída", amount: "a gosto" },
        { name: "Sal", amount: "a gosto" }
      ],
      instructions: [
        { step: 1, description: "Corte o guanciale em cubos pequenos e frite até dourar." },
        { step: 2, description: "Cozinhe o espaguete al dente em água salgada." },
        { step: 3, description: "Misture ovos com queijo pecorino e pimenta." },
        { step: 4, description: "Combine tudo fora do fogo, mexendo rapidamente." },
        { step: 5, description: "Sirva imediatamente com mais queijo por cima." }
      ],
      userId: "1",
      isPublic: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      title: "Risotto de Cogumelos",
      description: "Risotto cremoso com mix de cogumelos frescos e parmesão",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop",
      time: "45 min",
      servings: "6 pessoas",
      difficulty: "hard",
      tags: ["Italiano", "Vegetariano", "Cremoso"],
      ingredients: [
        { name: "Arroz arbório", amount: "350g" },
        { name: "Mix de cogumelos", amount: "500g" },
        { name: "Caldo de legumes", amount: "1 litro" },
        { name: "Cebola média", amount: "1" },
        { name: "Vinho branco", amount: "100ml" },
        { name: "Manteiga", amount: "80g" },
        { name: "Parmesão ralado", amount: "100g" }
      ],
      instructions: [
        { step: 1, description: "Refogue a cebola picada na manteiga." },
        { step: 2, description: "Adicione os cogumelos e cozinhe até murcharem." },
        { step: 3, description: "Acrescente o arroz e mexa por 2 minutos." },
        { step: 4, description: "Adicione o vinho e deixe evaporar." },
        { step: 5, description: "Vá adicionando o caldo quente aos poucos." },
        { step: 6, description: "Finalize com parmesão e manteiga." }
      ],
      userId: "1",
      isPublic: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "3",
      title: "Brownie Fudge Duplo Chocolate",
      description: "Brownie ultra cremoso com pedaços de chocolate e cobertura fudge",
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop",
      time: "60 min",
      servings: "12 pessoas",
      difficulty: "easy",
      tags: ["Sobremesa", "Chocolate", "Americano"],
      ingredients: [
        { name: "Chocolate meio amargo", amount: "200g" },
        { name: "Manteiga", amount: "150g" },
        { name: "Açúcar", amount: "200g" },
        { name: "Ovos", amount: "3" },
        { name: "Farinha de trigo", amount: "100g" },
        { name: "Chocolate em pedaços", amount: "100g" },
        { name: "Sal", amount: "pitada" }
      ],
      instructions: [
        { step: 1, description: "Derreta o chocolate com a manteiga." },
        { step: 2, description: "Misture açúcar e ovos até esbranquiçar." },
        { step: 3, description: "Combine chocolate derretido com a mistura de ovos." },
        { step: 4, description: "Adicione farinha peneirada e sal." },
        { step: 5, description: "Acrescente pedaços de chocolate." },
        { step: 6, description: "Asse por 25-30 minutos." }
      ],
      userId: "1",
      isPublic: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ];

  const { user } = useAuth();

  const removeRecipe = async (id: string) => {
    try {
      await deleteRecipeMutation.mutateAsync(id);
    } catch (error) {
      console.error("Erro ao remover receita:", error);
    }
  };

  const openRecipeModal = (recipe: RecipeType) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  // Use real data from API or fallback to mock for development
  const currentRecipes = recipes || mockRecipes.slice(0, 6);
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

  // Função para adaptar RecipeType para o formato esperado pelos componentes
  const adaptRecipeForComponents = (recipe: RecipeType) => ({
    id: parseInt(recipe.id),
    title: recipe.title,
    description: recipe.description,
    image: recipe.image || "",
    time: recipe.time,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    tags: recipe.tags,
    rating: recipe.rating || 0,
    ingredients: recipe.ingredients.map(ing => `${ing.name} ${ing.amount}`),
    instructions: recipe.instructions.map(inst => inst.description),
    nutrition: recipe.nutrition
  });

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
                <Link href="/">Voltar ao Início</Link>
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
                        recipe={adaptRecipeForComponents(recipe)}
                        onFavorite={() => {}}
                        isFavorite={false}
                        onEdit={(adaptedRecipe) => openEditModal(recipe)}
                        onEditWithAI={(adaptedRecipe) => openEditAIModal(recipe)}
                      />
                      <button
                        onClick={() => removeRecipe(recipe.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                        title="Remover receita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                            src={recipe.image || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop"}
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
                                  <span>{recipe.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{recipe.servings}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400" />
                                  <span>{recipe.rating || 0}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                  <span>👁️ 0</span>
                                  <span>❤️ 0</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRecipe(recipe.id)}
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
                <Button asChild>
                  <Link href="/create-recipe">Criar Receita</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe ? adaptRecipeForComponents(selectedRecipe) : null}
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        onFavorite={() => {}}
        isFavorite={false}
      />

      {/* Create Recipe Modal */}
      <CreateRecipeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRecipe}
      />

      {/* Edit Recipe Modal */}
      <EditRecipeModal
        recipe={recipeToEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditRecipe}
      />

      {/* Edit Recipe with AI Modal */}
      <EditRecipeAIModal
        isOpen={isEditAIModalOpen}
        onClose={() => setIsEditAIModalOpen(false)}
        onSave={handleAIRecipeEdit}
        recipe={recipeToEditWithAI}
      />

      {/* Create Recipe with AI Modal */}
      <CreateRecipeAIModal
        isOpen={isCreateAIModalOpen}
        onClose={() => setIsCreateAIModalOpen(false)}
        onSave={handleAIRecipeCreate}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilters={selectedFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}