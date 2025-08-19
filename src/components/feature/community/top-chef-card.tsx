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
  TrendingUp
} from "lucide-react"

interface TopChef {
  id: number
  name: string
  email?: string
  avatar_url?: string
  totalLikes: number
  totalViews: number
  recipeCount: number
}

interface TopChefCardProps {
  chef: TopChef
  rank: number
}

export function TopChefCard({ chef, rank }: TopChefCardProps) {
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

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          {/* Ranking */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankColor(rank)}`}>
            {getRankIcon(rank)}
          </div>
          
          {/* Avatar e Nome */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-16 h-16">
                <AvatarImage src={chef.avatar_url} alt={chef.name} />
                <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-lg font-semibold">
                  {chef.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="min-w-0">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
                  {chef.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  #{rank} Top Chef
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <ChefHat className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {chef.recipeCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Receitas
            </p>
          </div>
          
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {chef.totalLikes}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Likes
            </p>
          </div>
          
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {chef.totalViews}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Visualizações
            </p>
          </div>
        </div>

        {/* Badges de Conquistas */}
        <div className="flex flex-wrap gap-2">
          {rank === 1 && (
            <Badge className="bg-yellow-500 text-white">
              🥇 1º Lugar
            </Badge>
          )}
          {rank === 2 && (
            <Badge className="bg-gray-400 text-white">
              🥈 2º Lugar
            </Badge>
          )}
          {rank === 3 && (
            <Badge className="bg-orange-600 text-white">
              🥉 3º Lugar
            </Badge>
          )}
          
          {chef.recipeCount >= 10 && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <ChefHat className="w-3 h-3 mr-1" />
              Chef Experiente
            </Badge>
          )}
          
          {chef.totalLikes >= 100 && (
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <Heart className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          
          {chef.totalViews >= 1000 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              Viral
            </Badge>
          )}
        </div>

        {/* Performance */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Performance:</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.min(5, Math.floor(chef.totalLikes / 20))
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
                width: `${Math.min(100, (chef.totalLikes / Math.max(1, chef.recipeCount)) * 10)}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
