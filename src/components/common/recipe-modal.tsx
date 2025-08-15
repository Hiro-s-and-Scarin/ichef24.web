"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { X, Heart, Share2, Star, Clock, Users, ChefHat, Utensils, BookOpen, ThumbsUp } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "react-i18next"

interface Recipe {
  id: number
  title: string
  description: string
  image: string
  time: string
  servings: string
  difficulty: string
  tags: string[]
  rating: number
  ingredients: string[]
  instructions: string[]
  nutrition?: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
}

interface RecipeModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
  onFavorite: (recipeId: number) => void
  isFavorite: boolean
}

export function RecipeModal({ recipe, isOpen, onClose, onFavorite, isFavorite }: RecipeModalProps) {
  const { t } = useTranslation()
  if (!recipe) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-orange-50 to-yellow-50 dark:from-black dark:via-gray-900 dark:to-black border-2 border-orange-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-2xl">
        <DialogHeader className="relative pb-8">
          <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            {recipe.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Recipe Header */}
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-100 dark:border-orange-900/30">
            <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute top-6 right-6 flex gap-3">
              <Button
                onClick={() => onFavorite(recipe.id)}
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 rounded-full shadow-lg"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 rounded-full shadow-lg"
              >
                <Share2 className="w-6 h-6" />
              </Button>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-orange-500 text-white px-4 py-2 text-sm font-medium rounded-full shadow-lg">
                  ⭐ {recipe.difficulty}
                </Badge>
                <div className="flex items-center gap-2 text-white">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{recipe.rating}/5</span>
                </div>
              </div>
              <p className="text-white text-lg leading-relaxed max-w-2xl">
                {recipe.description}
              </p>
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-600 shadow-xl">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Tempo</h3>
                <p className="text-gray-600 dark:text-gray-300">{recipe.time}</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-600 shadow-xl">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('form.servings')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{recipe.servings}</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-600 shadow-xl">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('form.difficulty')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{recipe.difficulty}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3">
            {recipe.tags.map((tag, index) => (
              <Badge key={index} className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border-2 border-orange-200 dark:from-orange-900/30 dark:to-yellow-900/30 dark:text-orange-300 dark:border-orange-700 rounded-full px-4 py-2 text-sm font-medium shadow-sm">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Ingredients */}
            <Card className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-600 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('form.ingredients')}</h3>
                </div>
                <div className="space-y-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl shadow-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300 text-lg">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-600 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('form.instructions')}</h3>
                </div>
                <div className="space-y-6">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed flex-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition & Rating */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Nutrition */}
            {recipe.nutrition && (
              <Card className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-600 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('recipe.nutrition')}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('recipe.calories')}</h4>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{recipe.nutrition.calories}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('recipe.protein')}</h4>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{recipe.nutrition.protein}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('recipe.carbs')}</h4>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{recipe.nutrition.carbs}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('recipe.fat')}</h4>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{recipe.nutrition.fat}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rating */}
            <Card className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-600 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <ThumbsUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('recipe.rate')}</h3>
                </div>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded-full"
                    >
                      <Star className={`w-6 h-6 ${star <= recipe.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </Button>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {recipe.rating === 5 ? "Excelente!" : 
                     recipe.rating === 4 ? "Muito bom!" : 
                     recipe.rating === 3 ? "Bom!" : 
                     recipe.rating === 2 ? "Regular" : "Pode melhorar"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
