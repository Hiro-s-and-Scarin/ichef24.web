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
import { ThemeToggle } from "@/components/theme-toggle"
import { Pagination } from "@/components/pagination"
import { FilterModal } from "@/components/filter-modal"
import { useGetFavoriteRecipes, useToggleFavoriteRecipe } from "@/network/hooks/recipes/useRecipes"
import { useTranslation } from "react-i18next"

export default function FavoritesPage() {
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
      id: 1,
      title: "Risotto de Frango com Limão",
      description: "Um risotto cremoso e aromático com frango suculento e ervas frescas",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop&crop=center",
      time: "35 min",
      servings: "4 pessoas",
      difficulty: "Médio",
      tags: ["Italiano", "Cremoso", "Proteína"],
      date: "Hoje",
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
      id: 3,
      title: "Salmão Grelhado com Aspargos",
      description: "Salmão perfeitamente grelhado com aspargos e molho de limão",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center",
      time: "25 min",
      servings: "2 pessoas",
      difficulty: "Médio",
      tags: ["Peixe", "Saudável", "Proteína"],
      date: "2 dias atrás",
      rating: 5,
      ingredients: ["2 filés de salmão", "500g de aspargos", "2 limões", "Azeite", "Alho", "Sal e pimenta"],
      instructions: [
        "Tempere o salmão com sal, pimenta e limão.",
        "Grelhe o salmão por 4-5 minutos de cada lado.",
        "Refogue os aspargos com alho.",
        "Sirva com molho de limão.",
      ],
    },
    {
      id: 5,
      title: "Curry de Grão-de-Bico",
      description: "Curry aromático e picante com grão-de-bico e leite de coco",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop&crop=center",
      time: "30 min",
      servings: "4 pessoas",
      difficulty: "Médio",
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
      id: 7,
      title: "Pasta Carbonara Autêntica",
      description: "Pasta carbonara tradicional com guanciale, ovos e queijo pecorino",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
      time: "25 min",
      servings: "2 pessoas",
      difficulty: "Médio",
      tags: ["Italiano", "Pasta", "Tradicional"],
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
      id: 9,
      title: "Tiramisu Clássico",
      description: "Sobremesa italiana com café, mascarpone e cacau",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center",
      time: "30 min",
      servings: "6 pessoas",
      difficulty: "Fácil",
      tags: ["Italiano", "Sobremesa", "Café"],
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
    {
      id: 11,
      title: "Pasta Carbonara Autêntica",
      description: "Pasta carbonara tradicional com guanciale, ovos e queijo pecorino",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
      time: "25 min",
      servings: "2 pessoas",
      difficulty: "Médio",
      tags: ["Italiano", "Pasta", "Tradicional"],
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
      id: 13,
      title: "Tiramisu Clássico",
      description: "Sobremesa italiana com café, mascarpone e cacau",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center",
      time: "30 min",
      servings: "6 pessoas",
      difficulty: "Fácil",
      tags: ["Italiano", "Sobremesa", "Café"],
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
    {
      id: 15,
      title: "Brigadeiro Gourmet",
      description: "Brigadeiro gourmet com chocolate belga e cobertura de chocolate",
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop&crop=center",
      time: "20 min",
      servings: "12 pessoas",
      difficulty: "Fácil",
      tags: ["Brasileiro", "Sobremesa", "Chocolate"],
      date: "3 semanas atrás",
      rating: 5,
      ingredients: [
        "395g de leite condensado",
        "30g de chocolate em pó",
        "15g de manteiga",
        "Chocolate granulado para decorar",
      ],
      instructions: [
        "Misture o leite condensado com o chocolate em pó.",
        "Adicione a manteiga e cozinhe em fogo baixo.",
        "Mexa até desgrudar do fundo da panela.",
        "Deixe esfriar e faça bolinhas.",
        "Passe no chocolate granulado.",
      ],
    },
  ])

  const { user } = useAuth()

  const removeFavorite = async (id: string) => {
    try {
      await removeFromFavorites.mutateAsync(id)
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
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Receitas Favoritas</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">Suas receitas salvas e favoritas</p>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar favoritos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          +{selectedFilters.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Filter Button */}
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  >
                    <Filter className="w-4 h-4" />
                    {t('favorites.filters')}
                    {selectedFilters.length > 0 && (
                      <Badge variant="secondary" className="ml-1 bg-orange-500 text-white text-xs">
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
                <p className="mt-2 text-gray-500">Carregando favoritos...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Favorites Grid/List */}
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto" : "space-y-4"}>
                {currentFavorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onFavorite={() => removeFavorite(recipe.id)}
                    isFavorite={true}
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
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('favorites.no.found')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('favorites.adjust.search')}{" "}
                  <Link href="/" className="text-orange-600 dark:text-orange-400 hover:underline">
                    {t('favorites.back.home')}
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        onFavorite={removeFavorite}
        isFavorite={true}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        selectedFilters={selectedFilters}
      />
    </div>
  )
}
