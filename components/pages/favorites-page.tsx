"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, Share2, Clock, Users, Star, Trash2, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RecipeModal } from "@/components/recipe-modal"
import { useAuth } from "@/contexts/auth-context"
import { RecipeCard } from "@/components/recipe-card"

import { Pagination } from "@/components/pagination"
import { FilterModal } from "@/components/filter-modal"
import { useGetFavoriteRecipes, useToggleFavoriteRecipe } from "@/network/hooks/recipes/useRecipes"
import { useTranslation } from "react-i18next"

export function FavoritesPageContent() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // TanStack Query hooks
  const { data: favorites, isLoading } = useGetFavoriteRecipes({
    page: currentPage,
    limit: 6,
    search: searchTerm,
    tags: selectedFilters
  })
  const { removeFromFavorites } = useToggleFavoriteRecipe()

  const mockFavorites = [
    {
      id: "1",
      title: "Risotto de Frango com Limão",
      description: "Um risotto cremoso e aromático com frango suculento e ervas frescas",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop&crop=center",
      time: "35 min",
      servings: "4 pessoas",
      difficulty: "medium" as const,
      tags: ["Italiano", "Cremoso", "Proteína"],
      rating: 5,
      ingredients: [
        "400g de arroz arbório",
        "500g de peito de frango cortado em cubos",
        "1 litro de caldo de galinha",
        "1 cebola pequena picada",
        "2 dentes de alho",
        "100ml de vinho branco",
        "80g de manteiga",
        "80g de queijo parmesão ralado",
        "Suco de 1 limão",
        "Sal e pimenta a gosto",
        "Salsa fresca picada"
      ],
      instructions: [
        "Tempere o frango com sal, pimenta e suco de limão.",
        "Em uma panela, refogue a cebola e o alho na manteiga.",
        "Adicione o frango e cozinhe até dourar.",
        "Acrescente o arroz e mexa por 2 minutos.",
        "Adicione o vinho branco e deixe evaporar.",
        "Vá adicionando o caldo quente aos poucos, mexendo sempre.",
        "Cozinhe por cerca de 18-20 minutos até o arroz estar cremoso.",
        "Finalize com queijo parmesão e salsa."
      ],
      userId: "user1",
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "Brigadeiro Gourmet",
      description: "Brigadeiro gourmet com chocolate belga e cobertura de chocolate",
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop&crop=center",
      time: "20 min",
      servings: "12 pessoas",
      difficulty: "easy" as const,
      tags: ["Brasileiro", "Sobremesa", "Chocolate"],
      rating: 5,
      ingredients: [
        "395g de leite condensado",
        "30g de chocolate em pó",
        "15g de manteiga",
        "Chocolate granulado para decorar"
      ],
      instructions: [
        "Misture o leite condensado com o chocolate em pó.",
        "Adicione a manteiga e cozinhe em fogo baixo.",
        "Mexa até desgrudar do fundo da panela.",
        "Deixe esfriar e faça bolinhas.",
        "Passe no chocolate granulado."
      ],
      userId: "user1",
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // const { user } = useAuth(); // Comentado temporariamente

  // Usuário mock temporário para desenvolvimento
  const user = {
    id: "1",
    name: "Usuário Teste",
    email: "teste@ichef24.com",
    plan: "free" as const,
    avatar: undefined
  }

  const removeFavorite = async (id: string | number) => {
    try {
      await removeFromFavorites.mutateAsync(String(id))
    } catch (error) {
      console.error("Erro ao remover dos favoritos:", error)
    }
  }

  const openRecipeModal = (recipe: any) => {
    setSelectedRecipe(recipe)
    setIsRecipeModalOpen(true)
  }

  // Use real data from API or fallback to mock for development
  const currentFavorites = favorites || mockFavorites.slice(0, 6)
  const totalPages = Math.ceil((currentFavorites.length || 0) / 6)

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
                Receitas Favoritas
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Suas receitas mais queridas em um só lugar</p>
            </div>
            <div className="flex items-center gap-4">
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
                  <div className="text-2xl font-bold text-red-500">{currentFavorites.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Favoritos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">4.8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Nota Média</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">25min</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Dificuldade Média</div>
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
                    placeholder="Buscar nas suas receitas favoritas..."
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
                <p className="mt-2 text-gray-500">Carregando favoritos...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Favorites Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {currentFavorites.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe as any}
                      onFavorite={() => removeFavorite(recipe.id)}
                      isFavorite={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {currentFavorites.map((recipe) => (
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
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
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
                                  <span>{recipe.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFavorite(recipe.id)}
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

          {!isLoading && currentFavorites.length === 0 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Nenhum favorito encontrado</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Você ainda não tem receitas favoritas. Comece explorando e salvando suas receitas preferidas!
                </p>
                <Button asChild>
                  <Link href="/">Explorar Receitas</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={isRecipeModalOpen}
          onClose={() => setIsRecipeModalOpen(false)}
          onFavorite={() => removeFavorite(selectedRecipe.id)}
          isFavorite={true}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilters={selectedFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  )
}