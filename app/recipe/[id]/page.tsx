"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Heart, Share2, Clock, Users, Utensils, BookOpen, ArrowLeft, Star, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { translateDynamicData } from "@/lib/config/i18n"
import { useRecipe } from "@/network/hooks/recipes/useRecipe"

interface RecipePageState {
  isFavorite: boolean
  rating: number
  userRating: number
  mounted: boolean
}

export default function RecipePage() {
  const { t, i18n } = useTranslation()
  const params = useParams()
  const [recipeState, setRecipeState] = useState<RecipePageState>({
    isFavorite: false,
    rating: 0,
    userRating: 0,
    mounted: false,
  })

  const { isFavorite, rating, userRating, mounted } = recipeState
  const { data: recipe, isLoading, error } = useRecipe(params.id as string)

  const updateRecipeState = (updates: Partial<RecipePageState>) => {
    setRecipeState(prev => ({ ...prev, ...updates }))
  }

  useEffect(() => {
    updateRecipeState({ mounted: true })
  }, [])

  const handleRating = (newRating: number) => {
    updateRecipeState({ userRating: newRating })
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">{t('common.loading')} receita...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Erro ao carregar receita</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {error instanceof Error ? error.message : 'Receita não encontrada'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
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
              {t('common.back')} ao {t('header.history')}
            </Link>
          </Button>

          {/* Recipe Header */}
          <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm overflow-hidden">
            <div className="relative h-80 bg-gradient-to-r from-[#f54703] to-[#ff7518]">
              <Image
                src={recipe.image_url || "/placeholder.svg"}
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
                      {recipe.tags?.map((tag: string, index: number) => (
                        <Badge key={index} className="bg-white/20 text-white border-white/30">
                          {translateDynamicData.recipeTag(tag, i18n.language)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-6">
                    <Button
                      variant="secondary"
                      onClick={() => updateRecipeState({ isFavorite: !isFavorite })}
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
                  <div className="text-white font-medium">{recipe.cooking_time || 'N/A'} min</div>
                  <div className="text-gray-400 text-sm">{t('form.time')}</div>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-[#ff7518] mx-auto mb-2" />
                  <div className="text-white font-medium">{recipe.servings || 'N/A'}</div>
                  <div className="text-gray-400 text-sm">{t('form.servings')}</div>
                </div>
                <div className="text-center">
                  <Utensils className="w-6 h-6 text-[#ff7518] mx-auto mb-2" />
                  <div className="text-white font-medium">{recipe.difficulty_level || 'N/A'}</div>
                  <div className="text-gray-400 text-sm">{t('form.difficulty')}</div>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-[#ff7518] mx-auto mb-2 fill-current" />
                  <div className="text-white font-medium">{recipe.likes_count || 0}</div>
                  <div className="text-gray-400 text-sm">{t('recipe.rating')}</div>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-6 h-6 text-[#ff7518] mx-auto mb-2" />
                  <div className="text-white font-medium">{recipe.views_count || 0}</div>
                  <div className="text-gray-400 text-sm">{t('recipe.reviews')}</div>
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
                    {t('form.ingredients')}
                  </h3>
                  <ul className="space-y-4">
                    {Array.isArray(recipe.ingredients) ? recipe.ingredients.map((ingredient, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-[#ff7518] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">
                          {ingredient.name ? `${ingredient.amount} ${ingredient.name}` : ingredient}
                        </span>
                      </li>
                    )) : (
                      <li className="text-gray-400">Ingredientes não disponíveis</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold text-white flex items-center gap-3 mb-6">
                    <Utensils className="w-6 h-6 text-[#ff7518]" />
                    {t('recipe.instructions')}
                  </h3>
                  <ol className="space-y-6">
                    {Array.isArray(recipe.steps) ? recipe.steps.map((step, index: number) => (
                      <li key={index} className="flex gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#f54703] to-[#ff7518] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-300 leading-relaxed text-lg pt-2">
                          {step.description || step}
                        </span>
                      </li>
                    )) : (
                      <li className="text-gray-400">Instruções não disponíveis</li>
                    )}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recipe Info */}
              <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Informações da Receita</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tipo de Cozinha</span>
                      <span className="text-white font-medium">{recipe.cuisine_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Gerada por IA</span>
                      <span className="text-white font-medium">{recipe.is_ai_generated ? 'Sim' : 'Não'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Pública</span>
                      <span className="text-white font-medium">{recipe.is_public ? 'Sim' : 'Não'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rating */}
              <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{t('recipe.rate')}</h3>
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
                      {t('recipe.rating.thank.you', { rating: userRating, stars: userRating > 1 ? t('recipe.rating.stars') : t('recipe.rating.star') })}
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
