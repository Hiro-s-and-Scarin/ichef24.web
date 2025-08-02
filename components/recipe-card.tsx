"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, Heart, Eye, ChefHat, Edit, Sparkles, Share2 } from "lucide-react"
import Image from "next/image"
import { RecipeModal } from "./recipe-modal"
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

interface RecipeCardProps {
  recipe: Recipe
  onFavorite?: (id: number) => void
  isFavorite?: boolean
  onEdit?: (recipe: Recipe) => void
  onEditWithAI?: (recipe: Recipe) => void
}

export function RecipeCard({ recipe, onFavorite, isFavorite = false, onEdit, onEditWithAI }: RecipeCardProps) {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Card className="group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02]">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={recipe.image || "/placeholder.jpg"}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFavorite?.(recipe.id)}
            className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>

          {/* Tags */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {recipe.tags.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                className="bg-white/90 text-gray-800 text-xs font-medium backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
            {recipe.tags.length > 2 && (
              <Badge className="bg-white/90 text-gray-800 text-xs font-medium backdrop-blur-sm">
                +{recipe.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {recipe.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {recipe.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < recipe.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
                    {t('common.view')}
            </Button>
            
            {onEdit && (
              <Button
                onClick={() => onEdit(recipe)}
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-gray-600 dark:text-orange-400 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            
            {onEditWithAI && (
              <Button
                onClick={() => onEditWithAI(recipe)}
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-gray-600 dark:text-orange-400 dark:hover:bg-gray-700"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={recipe}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onFavorite={onFavorite}
        isFavorite={isFavorite}
      />
    </>
  )
} 