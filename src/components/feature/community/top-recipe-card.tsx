"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Trophy,
  ChefHat,
  Heart,
  Eye,
  Clock,
  Users,
  TrendingUp,
  Image as ImageIcon,
  Copy,
} from "lucide-react";
import { Recipe } from "@/types/recipe";
import { getRecipeImageUrl, hasRecipeImage } from "@/lib/utils/recipe-image";

interface TopRecipeCardProps {
  recipe: Recipe;
  rank: number;
}

export function TopRecipeCard({ recipe, rank }: TopRecipeCardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-orange-600 text-white";
      default:
        return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5" />;
      case 2:
        return <Trophy className="w-5 h-5" />;
      case 3:
        return <Trophy className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case 2:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case 3:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case 4:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case 5:
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "Muito Fácil";
      case 2:
        return "Fácil";
      case 3:
        return "Médio";
      case 4:
        return "Difícil";
      case 5:
        return "Muito Difícil";
      default:
        return "Não definido";
    }
  };

  const formatTime = (minutes: number | undefined) => {
    if (!minutes) return "N/A";
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const recipeUrl = `${window.location.origin}/recipe/${recipe.id}`;
    
    try {
      await navigator.clipboard.writeText(recipeUrl);
      toast.success("Link da receita copiado para a área de transferência!");
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Ranking */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankColor(rank)}`}
          >
            {getRankIcon(rank)}
          </div>

          {/* Recipe Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1 line-clamp-2">
              {recipe.title}
            </h3>

            {recipe.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                {recipe.description}
              </p>
            )}

            {/* Chef Info */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={recipe.user?.avatar_url}
                  alt={recipe.user?.name}
                />
                <AvatarFallback className="text-xs bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  {recipe.user?.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {recipe.user?.name || "Chef"}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recipe Image */}
        <div className="relative h-32 w-full rounded-lg overflow-hidden">
          {hasRecipeImage(recipe) ? (
            <Image
              src={getRecipeImageUrl(recipe)!}
              alt={recipe.title || "Receita"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={rank <= 3}
            />
          ) : null}

          {/* Fallback sempre visível para quando não há imagem */}
          <div
            className={`image-fallback w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 flex items-center justify-center ${hasRecipeImage(recipe) ? "hidden" : ""}`}
          >
            <span className="text-3xl">🍳</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
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
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {recipe.servings || "N/A"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Porções
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <ChefHat className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {getDifficultyText(recipe.difficulty_level || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dificuldade
              </p>
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
            <Badge className="bg-yellow-500 text-white">🥇 Top Receita</Badge>
          )}
          {rank === 2 && (
            <Badge className="bg-gray-400 text-white">🥈 2ª Melhor</Badge>
          )}
          {rank === 3 && (
            <Badge className="bg-orange-600 text-white">🥉 3ª Melhor</Badge>
          )}

          {recipe.is_ai_generated && (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              IA Gerada
            </Badge>
          )}

          {recipe.likes_count >= 50 && (
            <Badge
              variant="secondary"
              className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            >
              <Heart className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}

          {recipe.views_count >= 500 && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <Eye className="w-3 h-3 mr-1" />
              Viral
            </Badge>
          )}
        </div>

        {/* Performance */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Performance:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-orange-500 font-medium">
                {recipe.likes_count} curtidas
              </span>
            </div>
          </div>

          <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, recipe.likes_count / 10)}%`,
              }}
            />
          </div>

          {/* Copy URL Button */}
          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyUrl}
              className="text-xs px-2 py-1.5 h-8 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Copiar link da receita"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
