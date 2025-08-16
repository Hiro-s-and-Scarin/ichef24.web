"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Clock, Users, Star, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Recipe } from "@/types/recipe"
import { useAddToFavorites, useRemoveFromFavorites } from "@/network/hooks"

interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
  isFavorite?: boolean
}

export function RecipeCard({ recipe, onClick, isFavorite: initialIsFavorite = false }: RecipeCardProps) {
  // Debug temporário para verificar os dados
  console.log('=== RECIPE CARD DEBUG ===')
  console.log('Recipe recebido:', recipe)
  console.log('Recipe title:', recipe?.title)
  console.log('Recipe description:', recipe?.description)
  console.log('Recipe cooking_time:', recipe?.cooking_time)
  console.log('Recipe servings:', recipe?.servings)
  console.log('Recipe difficulty_level:', recipe?.difficulty_level)
  console.log('isFavorite prop:', initialIsFavorite)
  console.log('========================')
  
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const addToFavoritesMutation = useAddToFavorites()
  const removeFromFavoritesMutation = useRemoveFromFavorites()

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavoritesMutation.mutateAsync(recipe.id)
        setIsFavorite(false)
      } else {
        await addToFavoritesMutation.mutateAsync(recipe.id)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const getDifficultyText = (level?: number) => {
    if (!level) return "Não especificado"
    switch (level) {
      case 1: return "Muito Fácil"
      case 2: return "Fácil"
      case 3: return "Intermediário"
      case 4: return "Difícil"
      case 5: return "Muito Difícil"
      default: return "Não especificado"
    }
  }

  const getDifficultyColor = (level?: number) => {
    if (!level) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    switch (level) {
      case 1:
      case 2:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case 3:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case 4:
      case 5:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card 
      className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col cursor-pointer"
      onClick={onClick}
    >
      {/* Recipe Image */}
      <div className="relative h-48 w-full">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 flex items-center justify-center">
            <span className="text-4xl">🍳</span>
          </div>
        )}
        
        {/* Favorite Button - Moved to left side */}
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation() // Evitar que o clique do botão propague para o card
            handleToggleFavorite()
          }}
          className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full w-8 h-8"
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} 
          />
        </Button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Recipe Title */}
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Recipe Description */}
        {recipe.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Recipe Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {recipe.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Recipe Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          {recipe.cooking_time && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cooking_time}min</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} porções</span>
            </div>
          )}
        </div>

        {/* Difficulty Level */}
        {recipe.difficulty_level && (
          <Badge className={`mb-3 w-fit ${getDifficultyColor(recipe.difficulty_level)}`}>
            {getDifficultyText(recipe.difficulty_level)}
          </Badge>
        )}

        {/* View Recipe Button */}
        <div className="flex justify-end mt-auto">
          <Link href={`/recipe/${recipe.id}`}>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              Ver Receita
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 