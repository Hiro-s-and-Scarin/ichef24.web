"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Heart, Share2, Clock, Users, Utensils, BookOpen, ArrowLeft, Star, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

// Estado consolidado para a página de receita
interface RecipePageState {
  isFavorite: boolean
  rating: number
  userRating: number
  mounted: boolean
}

export default function RecipePage() {
  const params = useParams()
  // Estado consolidado
  const [recipeState, setRecipeState] = useState<RecipePageState>({
    isFavorite: false,
    rating: 0,
    userRating: 0,
    mounted: false,
  })

  // Desestruturação para facilitar o uso
  const { isFavorite, rating, userRating, mounted } = recipeState

  // Função helper para atualizar estado
  const updateRecipeState = (updates: Partial<RecipePageState>) => {
    setRecipeState(prev => ({ ...prev, ...updates }))
  }

  useEffect(() => {
    updateRecipeState({ mounted: true })
  }, [])

  // Mock recipe data - in a real app, this would be fetched based on the ID
  const recipe = {
    id: params.id,
    title: "Risotto de Frango com Limão e Ervas",
    description: "Um risotto cremoso e aromático com frango suculento, finalizado com limão fresco e ervas do jardim.",
    image: "/placeholder.svg?height=400&width=600&text=Risotto+de+Frango",
    time: "35 minutos",
    difficulty: "Médio",
    servings: "4 pessoas",
    tags: ["Italiano", "Cremoso", "Proteína", "Cítrico"],
    rating: 4.8,
    reviews: 127,
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
      fiber: "2g",
    },
    tips: [
      "Use caldo caseiro para um sabor mais rico",
      "Não pare de mexer o risotto para obter a cremosidade perfeita",
      "Adicione o limão apenas no final para preservar o sabor cítrico",
      "Sirva imediatamente para melhor textura",
    ],
  }

  const handleRating = (newRating: number) => {
    setUserRating(newRating)
    // In a real app, this would save to backend
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Carregando receita...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
      {/* Header */}
              <header className="border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/80 dark:bg-black/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">iChef24</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/generate" className="text-gray-600 hover:text-orange-600 transition-colors dark:text-gray-300 dark:hover:text-orange-400">
              Gerar Receita
            </Link>
            <Link href="/history" className="text-gray-600 hover:text-orange-600 transition-colors dark:text-gray-300 dark:hover:text-orange-400">
              Histórico
            </Link>
            <Link href="/favorites" className="text-gray-600 hover:text-orange-600 transition-colors dark:text-gray-300 dark:hover:text-orange-400">
              Favoritos
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700/50 bg-transparent"
            asChild
          >
            <Link href="/history">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Histórico
            </Link>
          </Button>

          {/* Recipe Header */}
          <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm overflow-hidden">
            <div className="relative h-80 bg-gradient-to-r from-[#f54703] to-[#ff7518]">
              <Image
                src={recipe.image || "/placeholder.svg"}
                alt={recipe.title}
                fill
                className="object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-white mb-3">{recipe.title}</h1>
                    <p className="text-white/90 text-lg mb-4">{recipe.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, index) => (
                        <Badge key={index} className="bg-white/20 text-white border-white/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-6">
                    <Button
                      variant="secondary"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`w-12 h-12 p-0 ${
                        isFavorite
                          ? "bg-[#ff7518] text-white hover:bg-[#f54703]"
                          : "bg-black/50 text-white hover:bg-black/70"
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="secondary" className="w-12 h-12 p-0 bg-black/50 text-white hover:bg-black/70">
                      <Share2 className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe Stats */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <Clock className="w-6 h-6 text-[#ff7518] mx-auto mb-2" />
                  <div className="text-white font-medium">{recipe.time}</div>
                  <div className="text-gray-400 text-sm">Tempo</div>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-[#ff7518] mx-auto mb-2" />
                  <div className="text-white font-medium">{recipe.servings}</div>
                  <div className="text-gray-400 text-sm">Porções</div>
                </div>
                <div className="text-center">
                  <Utensils className="w-6 h-6 text-[#ff7518] mx-auto mb-2" />
                  <div className="text-white font-medium">{recipe.difficulty}</div>
                  <div className="text-gray-400 text-sm">Dificuldade</div>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-[#ff7518] mx-auto mb-2 fill-current" />
                  <div className="text-white font-medium">{recipe.rating}</div>
                  <div className="text-gray-400 text-sm">Avaliação</div>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-6 h-6 text-[#ff7518] mx-auto mb-2" />
                  <div className="text-white font-medium">{recipe.reviews}</div>
                  <div className="text-gray-400 text-sm">Avaliações</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ingredients */}
              <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold text-white flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-[#ff7518]" />
                    Ingredientes
                  </h3>
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-[#ff7518] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold text-white flex items-center gap-3 mb-6">
                    <Utensils className="w-6 h-6 text-[#ff7518]" />
                    Modo de Preparo
                  </h3>
                  <ol className="space-y-6">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#f54703] to-[#ff7518] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-300 leading-relaxed text-lg pt-2">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Nutrition Info */}
              <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Informações Nutricionais</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Calorias</span>
                      <span className="text-white font-medium">{recipe.nutrition.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Proteína</span>
                      <span className="text-white font-medium">{recipe.nutrition.protein}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Carboidratos</span>
                      <span className="text-white font-medium">{recipe.nutrition.carbs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Gordura</span>
                      <span className="text-white font-medium">{recipe.nutrition.fat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Fibra</span>
                      <span className="text-white font-medium">{recipe.nutrition.fiber}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Dicas do Chef</h3>
                  <ul className="space-y-3">
                    {recipe.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-[#ff7518] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Rating */}
              <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Avalie esta receita</h3>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => handleRating(star)} className="transition-colors">
                        <Star
                          className={`w-8 h-8 ${
                            star <= userRating ? "fill-[#ff7518] text-[#ff7518]" : "text-gray-600 hover:text-[#ff7518]"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-gray-300">
                      Obrigado pela sua avaliação de {userRating} estrela{userRating > 1 ? "s" : ""}!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
