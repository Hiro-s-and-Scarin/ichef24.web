"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Trophy, 
  ChefHat, 
  Heart, 
  Eye,
  Star,
  Clock,
  Users,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react"
import { Recipe } from "@/types/recipe"

interface TopRecipeCardProps {
  recipe: Recipe
  rank: number
}

export function TopRecipeCard({ recipe, rank }: TopRecipeCardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white"
      case 2:
        return "bg-gray-400 text-white"
      case 3:
        return "bg-orange-600 text-white"
      default:
        return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5" />
      case 2:
        return <Trophy className="w-5 h-5" />
      case 3:
        return <Trophy className="w-5 h-5" />
      default:
        return <Star className="w-5 h-5" />
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case 2:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case 3:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case 4:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case 5:
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "Muito Fácil"
      case 2:
        return "Fácil"
      case 3:
        return "Médio"
      case 4:
        return "Difícil"
      case 5:
        return "Muito Difícil"
      default:
        return "Não definido"
    }
  }

  const formatTime = (minutes: number | undefined) => {
    if (!minutes) return 'N/A'
    if (minutes < 60) {
      return `${minutes}min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Ranking */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankColor(rank)}`}>
            {getRankIcon(rank)}
          </div>
          
          {/* Imagem da Receita */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              {recipe.image_url ? (
                <img 
                  src={recipe.image_url} 
                  alt={recipe.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              {/* Badge de Ranking */}
              <div className="absolute top-2 right-2">
                <Badge className={`${getRankColor(rank)} text-xs font-bold`}>
                  #{rank}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Título e Chef */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-2">
            {recipe.title}
          </h3>
          
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={recipe.user?.avatar_url} alt={recipe.user?.name} />
              <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs">
                {recipe.user?.name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              por {recipe.user?.name || 'Chef'}
            </span>
          </div>
        </div>

        {/* Descrição */}
        {recipe.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              {recipe.likes_count || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Likes
            </p>
          </div>
          
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {recipe.views_count || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Visualizações
            </p>
          </div>
          
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {recipe.servings ? recipe.servings.toString() : 'N/A'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Porções
            </p>
          </div>
        </div>

        {/* Detalhes da Receita */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white">
              {formatTime(recipe.cooking_time)}
            </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tempo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <ChefHat className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {getDifficultyText(recipe.difficulty_level || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dificuldade</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
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

        {/* Badges de Conquistas */}
        <div className="flex flex-wrap gap-2">
          {rank === 1 && (
            <Badge className="bg-yellow-500 text-white">
              🥇 Top Receita
            </Badge>
          )}
          {rank === 2 && (
            <Badge className="bg-gray-400 text-white">
              🥈 2ª Melhor
            </Badge>
          )}
          {rank === 3 && (
            <Badge className="bg-orange-600 text-white">
              🥉 3ª Melhor
            </Badge>
          )}
          
          {recipe.is_ai_generated && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              IA Gerada
            </Badge>
          )}
          
          {recipe.likes_count >= 50 && (
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <Heart className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          
          {recipe.views_count >= 500 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <Eye className="w-3 h-3 mr-1" />
              Viral
            </Badge>
          )}
        </div>

        {/* Performance */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Avaliação:</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.min(5, Math.floor(recipe.likes_count / 10))
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, (recipe.likes_count / Math.max(1, recipe.views_count)) * 1000)}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
