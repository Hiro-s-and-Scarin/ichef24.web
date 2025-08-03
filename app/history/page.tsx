"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Heart,
  Share2,
  Clock,
  Users,
  Star,
  Plus,
  Edit,
  Sparkles,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RecipeModal } from "@/components/recipe-modal";
import { CreateRecipeModal } from "@/components/create-recipe-modal";
import { useAuth } from "@/contexts/auth-context";
import { EditRecipeModal } from "@/components/edit-recipe-modal";
import { EditRecipeAIModal } from "@/components/edit-recipe-ai-modal";
import { CreateRecipeAIModal } from "@/components/create-recipe-ai-modal";
import { RecipeCard } from "@/components/recipe-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Pagination } from "@/components/pagination";
import { FilterModal } from "@/components/filter-modal";
import { 
  useGetMyRecipes, 
  usePostRecipe, 
  usePutRecipe, 
  useDeleteRecipe,
  useToggleFavoriteRecipe,
  useGenerateRecipeWithAI,
  useImproveRecipeWithAI
} from "@/network/hooks/recipes/useRecipes";
import { useTranslation } from "react-i18next";
// Estado consolidado para a página de histórico
interface HistoryPageState {
  searchTerm: string;
  viewMode: "grid" | "list";
  currentPage: number;
  selectedFilters: string[];
  favoriteIds: number[];
  selectedRecipe: any | null;
  isRecipeModalOpen: boolean;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  recipeToEdit: any | null;
  isEditAIModalOpen: boolean;
  isCreateAIModalOpen: boolean;
  recipeToEditWithAI: any | null;
  isFilterModalOpen: boolean;
}

export default function HistoryPage() {
  const { t } = useTranslation();
  
  // Estado consolidado para toda a página
  const [pageState, setPageState] = useState<HistoryPageState>({
    searchTerm: "",
    viewMode: "grid",
    currentPage: 1,
    selectedFilters: [],
    favoriteIds: [1, 3, 5],
    selectedRecipe: null,
    isRecipeModalOpen: false,
    isCreateModalOpen: false,
    isEditModalOpen: false,
    recipeToEdit: null,
    isEditAIModalOpen: false,
    isCreateAIModalOpen: false,
    recipeToEditWithAI: null,
    isFilterModalOpen: false,
  });

  // Desestruturação para facilitar o uso
  const {
    searchTerm,
    viewMode,
    currentPage,
    selectedFilters,
    favoriteIds,
    selectedRecipe,
    isRecipeModalOpen,
    isCreateModalOpen,
    isEditModalOpen,
    recipeToEdit,
    isEditAIModalOpen,
    isCreateAIModalOpen,
    recipeToEditWithAI,
    isFilterModalOpen,
  } = pageState;

  // TanStack Query hooks
  const { data: recipes, isLoading } = useGetMyRecipes({
    page: currentPage,
    limit: 6,
    search: searchTerm,
    tags: selectedFilters
  })
  
  const createRecipe = usePostRecipe()
  const updateRecipe = usePutRecipe("")
  const deleteRecipe = useDeleteRecipe()
  const { addToFavorites, removeFromFavorites } = useToggleFavoriteRecipe()
  const generateAIRecipe = useGenerateRecipeWithAI()
  const improveRecipeWithAI = useImproveRecipeWithAI()

  const [mockRecipes, setMockRecipes] = useState([
    {
      id: 1,
      title: "Risotto de Frango com Limão",
      description:
        "Um risotto cremoso e aromático com frango suculento e ervas frescas",
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop&crop=center",
      time: t('recipes.risotto.time'),
      servings: "4 pessoas",
      difficulty: t('common.medium'),
      tags: [t('recipe.tags.italian'), t('recipe.tags.creamy'), t('recipe.tags.protein')],
      date: t('recipes.date.today'),
      rating: 5,
      ingredients: [
        "400g de arroz arbóreo",
        "500g de peito de frango em cubos",
        "1 litro de caldo de galinha",
        "1 cebola média picada",
        "2 dentes de alho picados",
        "1/2 xícara de vinho branco",
        "Suco de 1 limão",
        "Raspas de 1 limão",
        "50g de parmesão ralado",
        "2 colheres de sopa de manteiga",
        "Salsinha e tomilho frescos",
        "Sal e pimenta a gosto",
      ],
      instructions: [
        "Aqueça o caldo de galinha em uma panela e mantenha em fogo baixo.",
        "Em uma panela grande, refogue a cebola e o alho na manteiga até ficarem dourados.",
        "Adicione o frango e cozinhe até dourar por todos os lados.",
        "Acrescente o arroz e mexa por 2 minutos até os grãos ficarem nacarados.",
        "Adicione o vinho branco e mexa até evaporar.",
        "Adicione o caldo quente, uma concha por vez, mexendo sempre até ser absorvido.",
        "Continue o processo por cerca de 18-20 minutos até o arroz ficar cremoso.",
        "Finalize com parmesão, suco e raspas de limão, ervas frescas.",
        "Tempere com sal e pimenta. Sirva imediatamente.",
      ],
      nutrition: {
        calories: 420,
        protein: "28g",
        carbs: "45g",
        fat: "12g",
      },
    },
    {
      id: 2,
      title: "Salada Mediterrânea com Quinoa",
      description: "Salada nutritiva com quinoa, tomates, pepino e queijo feta",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center",
      time: "15 min",
      servings: "2 pessoas",
      difficulty: t('common.easy'),
      tags: ["Saudável", "Vegetariano", "Rápido"],
      date: t('recipes.date.yesterday'),
      rating: 4,
      ingredients: [
        "1 xícara de quinoa cozida",
        "2 tomates médios em cubos",
        "1 pepino em fatias",
        "100g de queijo feta",
        "Azeitonas pretas",
        "Azeite extra virgem",
        "Limão",
        "Orégano",
      ],
      instructions: [
        "Cozinhe a quinoa conforme instruções da embalagem.",
        "Corte os tomates e pepino em cubos pequenos.",
        "Misture todos os ingredientes em uma tigela.",
        "Tempere com azeite, limão e orégano.",
        "Sirva gelado.",
      ],
    },
    {
      id: 3,
      title: "Salmão Grelhado com Aspargos",
      description:
        "Salmão perfeitamente grelhado com aspargos e molho de limão",
      image:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center",
      time: "25 min",
      servings: "2 pessoas",
      difficulty: t('common.medium'),
      tags: ["Peixe", "Saudável", "Proteína"],
      date: "2 dias atrás",
      rating: 5,
      ingredients: [
        "2 filés de salmão",
        "500g de aspargos",
        "2 limões",
        "Azeite",
        "Alho",
        "Sal e pimenta",
      ],
      instructions: [
        "Tempere o salmão com sal, pimenta e limão.",
        "Grelhe o salmão por 4-5 minutos de cada lado.",
        "Refogue os aspargos com alho.",
        "Sirva com molho de limão.",
      ],
    },
    {
      id: 4,
      title: "Brownie de Chocolate Vegano",
      description:
        "Brownie fudgy e delicioso feito com ingredientes 100% vegetais",
      image:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&crop=center",
      time: "45 min",
      servings: "8 pessoas",
      difficulty: t('common.easy'),
      tags: ["Vegano", "Sobremesa", "Chocolate"],
      date: "3 dias atrás",
      rating: 4,
      ingredients: [
        "200g de chocolate amargo",
        "150g de açúcar demerara",
        "100ml de óleo de coco",
        "2 ovos de linhaça",
        "100g de farinha",
      ],
      instructions: [
        "Derreta o chocolate com óleo de coco.",
        "Misture açúcar e ovos de linhaça.",
        "Adicione a farinha gradualmente.",
        "Asse por 25-30 minutos a 180°C.",
      ],
    },
    {
      id: 5,
      title: "Curry de Grão-de-Bico",
      description: "Curry aromático e picante com grão-de-bico e leite de coco",
      image:
        "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop&crop=center",
      time: "30 min",
      servings: "4 pessoas",
      difficulty: t('common.medium'),
      tags: ["Indiano", "Vegano", "Picante"],
      date: "1 semana atrás",
      rating: 5,
      ingredients: [
        "2 xícaras de grão-de-bico cozido",
        "400ml de leite de coco",
        "1 cebola grande",
        "3 dentes de alho",
        "Gengibre fresco",
        "Curry em pó",
        "Cúrcuma",
        "Tomates pelados",
      ],
      instructions: [
        "Refogue cebola, alho e gengibre.",
        "Adicione as especiarias e cozinhe por 1 minuto.",
        "Acrescente tomates e grão-de-bico.",
        "Adicione leite de coco e cozinhe por 15 minutos.",
        "Sirva com arroz basmati.",
      ],
    },
    {
      id: 6,
      title: "Tacos de Peixe com Molho de Abacate",
      description:
        "Tacos frescos com peixe grelhado e cremoso molho de abacate",
      image:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop&crop=center",
      time: "20 min",
      servings: "3 pessoas",
      difficulty: t('common.easy'),
      tags: ["Mexicano", "Peixe", "Rápido"],
      date: "1 semana atrás",
      rating: 4,
      ingredients: [
        "500g de filé de peixe branco",
        "6 tortillas de milho",
        "2 abacates maduros",
        "1 limão",
        "Coentro fresco",
        "Repolho roxo",
      ],
      instructions: [
        "Tempere e grelhe o peixe.",
        "Prepare o molho de abacate.",
        "Aqueça as tortillas.",
        "Monte os tacos com todos os ingredientes.",
      ],
    },
    {
      id: 7,
      title: "Pasta Carbonara Autêntica",
      description:
        "Pasta carbonara tradicional com guanciale, ovos e queijo pecorino",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
      time: "25 min",
      servings: "2 pessoas",
      difficulty: t('common.medium'),
      tags: ["Italiano", "Pasta", "Tradicional", "Cremoso"],
      date: "2 semanas atrás",
      rating: 5,
      ingredients: [
        "400g de spaghetti",
        "200g de guanciale",
        "4 gemas de ovo",
        "50g de queijo pecorino",
        "Pimenta preta moída",
        "Sal",
      ],
      instructions: [
        "Cozinhe a pasta em água salgada.",
        "Frite o guanciale até ficar crocante.",
        "Misture as gemas com queijo e pimenta.",
        "Combine pasta com guanciale e molho de ovos.",
        "Sirva imediatamente.",
      ],
    },
    {
      id: 8,
      title: "Tiramisu Clássico",
      description: "Sobremesa italiana com café, mascarpone e cacau",
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center",
      time: "30 min",
      servings: "6 pessoas",
      difficulty: t('common.easy'),
      tags: [t('recipe.tags.italian'), t('recipe.tags.dessert'), t('recipe.tags.coffee'), t('common.easy')],
      date: "2 semanas atrás",
      rating: 5,
      ingredients: [
        "6 gemas de ovo",
        "150g de açúcar",
        "500g de mascarpone",
        "200ml de café forte",
        "Biscoitos tipo champagne",
        "Cacau em pó",
      ],
      instructions: [
        "Bata as gemas com açúcar até ficar claro.",
        "Misture com mascarpone.",
        "Monte camadas de biscoitos e creme.",
        "Polvilhe com cacau e leve à geladeira.",
      ],
    },
  ]);

  const { user } = useAuth();

  // Função helper para atualizar estado da página
  const updatePageState = (updates: Partial<HistoryPageState>) => {
    setPageState((prev) => ({ ...prev, ...updates }));
  };

  const toggleFavorite = async (id: string) => {
    const isFavorite = favoriteIds.includes(Number(id))
    try {
      if (isFavorite) {
        await removeFromFavorites.mutateAsync(id)
        updatePageState({
          favoriteIds: favoriteIds.filter((fId: number) => fId !== Number(id)),
        });
      } else {
        await addToFavorites.mutateAsync(id)
        updatePageState({
          favoriteIds: [...favoriteIds, Number(id)],
        });
      }
    } catch (error) {
      console.error("Erro ao alterar favorito:", error)
    }
  };

  const openRecipeModal = (recipe: any) => {
    updatePageState({
      selectedRecipe: recipe,
      isRecipeModalOpen: true,
    });
  };

  const openEditModal = (recipe: any) => {
    updatePageState({
      recipeToEdit: recipe,
      isEditModalOpen: true,
    });
  };

  const handleCreateRecipe = async (newRecipe: any) => {
    try {
      await createRecipe.mutateAsync(newRecipe)
      updatePageState({ isCreateModalOpen: false })
    } catch (error) {
      console.error("Erro ao criar receita:", error)
    }
  };

  const handleEditRecipe = async (updatedRecipe: any) => {
    try {
      await updateRecipe.mutateAsync(updatedRecipe)
      updatePageState({ isEditModalOpen: false })
    } catch (error) {
      console.error("Erro ao editar receita:", error)
    }
  };

  const openEditAIModal = (recipe: any) => {
    updatePageState({
      recipeToEditWithAI: recipe,
      isEditAIModalOpen: true,
    });
  };

  const handleAIRecipeEdit = async (recipeId: string, prompt: string) => {
    try {
      await improveRecipeWithAI.mutateAsync({ recipeId, prompt })
      updatePageState({ isEditAIModalOpen: false })
    } catch (error) {
      console.error("Erro ao melhorar receita com IA:", error)
    }
  };

  const handleAIRecipeCreate = async (aiRequest: any) => {
    try {
      await generateAIRecipe.mutateAsync(aiRequest)
      updatePageState({ isCreateAIModalOpen: false })
    } catch (error) {
      console.error("Erro ao gerar receita com IA:", error)
    }
  };

  // Use real data from API or fallback to mock for development
  const currentRecipes = recipes || mockRecipes.slice(0, 6)
  const totalPages = Math.ceil((currentRecipes.length || 0) / 6)

  const handleApplyFilters = (filters: string[]) => {
    updatePageState({
      selectedFilters: filters,
      currentPage: 1, // Reset to first page when filters change
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                {t('history.title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t('history.subtitle')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => updatePageState({ isCreateModalOpen: true })}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50 bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('history.create.new')}
              </Button>
              <Button
                onClick={() => {
                  console.log("Botão Crie Receita com IA clicado");
                  updatePageState({ isCreateAIModalOpen: true });
                }}
                className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('history.create.ai')}
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t('history.search.placeholder')}
                    value={searchTerm}
                    onChange={(e) =>
                      updatePageState({ searchTerm: e.target.value })
                    }
                    className="pl-10 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {/* Active Filters Display */}
                  {selectedFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedFilters.slice(0, 3).map((filter) => (
                        <Badge
                          key={filter}
                          variant="secondary"
                          className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                        >
                          {filter}
                        </Badge>
                      ))}
                      {selectedFilters.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          +{selectedFilters.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Filter Button */}
                  <Button
                    variant="outline"
                    onClick={() => updatePageState({ isFilterModalOpen: true })}
                    className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  >
                    <Filter className="w-4 h-4" />
                    {t('history.filters')}
                    {selectedFilters.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 bg-orange-500 text-white text-xs"
                      >
                        {selectedFilters.length}
                      </Badge>
                    )}
                  </Button>
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
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto"
                    : "space-y-4"
                }
              >
                {currentRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onFavorite={() => toggleFavorite(recipe.id)}
                    isFavorite={favoriteIds.includes(Number(recipe.id))}
                    onEdit={openEditModal}
                    onEditWithAI={openEditAIModal}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updatePageState({ currentPage: page })}
              />
            </div>
          )}

          {!isLoading && currentRecipes.length === 0 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {t('history.no.recipes')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('history.adjust.search')}{" "}
                  <Link
                    href="/"
                    className="text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    {t('history.back.home')}
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe as any}
        isOpen={isRecipeModalOpen}
        onClose={() => updatePageState({ isRecipeModalOpen: false })}
        onFavorite={toggleFavorite}
        isFavorite={
          selectedRecipe
            ? favoriteIds.includes((selectedRecipe as any).id)
            : false
        }
      />

      {/* Create Recipe Modal */}
      <CreateRecipeModal
        isOpen={isCreateModalOpen}
        onClose={() => updatePageState({ isCreateModalOpen: false })}
        onSave={handleCreateRecipe}
      />

      {/* Edit Recipe Modal */}
      <EditRecipeModal
        recipe={recipeToEdit as any}
        isOpen={isEditModalOpen}
        onClose={() => updatePageState({ isEditModalOpen: false })}
        onSave={handleEditRecipe}
      />

      {/* Edit Recipe with AI Modal */}
      <EditRecipeAIModal
        isOpen={isEditAIModalOpen}
        onClose={() => updatePageState({ isEditAIModalOpen: false })}
        onSave={handleAIRecipeEdit}
        recipe={recipeToEditWithAI}
      />

      {/* Create Recipe with AI Modal */}
      <CreateRecipeAIModal
        isOpen={isCreateAIModalOpen}
        onClose={() => updatePageState({ isCreateAIModalOpen: false })}
        onSave={handleAIRecipeCreate}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => updatePageState({ isFilterModalOpen: false })}
        onApplyFilters={handleApplyFilters}
        selectedFilters={selectedFilters as string[]}
      />
    </div>
  );
}
