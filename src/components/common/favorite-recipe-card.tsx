"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { translateDynamicData } from "@/lib/config/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Users, Star, Eye, ThumbsUp, Trash2, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { useRemoveFromFavorites } from "@/network/hooks/recipes/useRecipes";
import { useLikeRecipe } from "@/network/hooks/recipes/useRecipes";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys";
import { getRecipeImageUrl, hasRecipeImage } from "@/lib/utils/recipe-image";

interface FavoriteRecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export function FavoriteRecipeCard({
  recipe,
  onClick,
}: FavoriteRecipeCardProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Estados para curtidas (igual ao detalhe do post)
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const likeRecipeMutation = useLikeRecipe();

  // useEffect para inicializar curtidas (igual ao detalhe do post)
  useEffect(() => {
    if (recipe) {
      setLikesCount(recipe.likes_count || 0)
      if (user && recipe.user_is_liked) {
        setIsLiked(recipe.user_is_liked.includes(Number(user.id)))
      }
    }
  }, [recipe, user])

  const getDifficultyText = (level?: number | string) => {
    if (!level) return t("recipe.card.difficulty.not.specified");
    return translateDynamicData.difficulty(level, i18n.language);
  };

  const getDifficultyColor = (level?: number) => {
    if (!level)
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    switch (level) {
      case 1:
      case 2:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 3:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case 4:
      case 5:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleRemoveFromFavorites = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeFromFavoritesMutation.mutateAsync(recipe.id);
      toast.success("Receita removida dos favoritos!");
    } catch (error) {
      toast.error("Erro ao remover dos favoritos");
    }
  };

  // Função de curtir igual ao detalhe do post
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Você precisa estar logado para curtir receitas");
      return;
    }

    if (!recipe?.id) {
      toast.error("Receita não encontrada");
      return;
    }

    if (isLiked) {
      toast.info("Você já curtiu esta receita");
      return;
    }

    try {
      const result = await likeRecipeMutation.mutateAsync(recipe.id);
      
      if (result) {
        // Atualizar estado local
        setLikesCount(result.likes_count || likesCount + 1);
        setIsLiked(true);
        toast.success("Receita curtida com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao curtir receita");
    }
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
    <Card
      className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col cursor-pointer min-h-[480px] w-full max-w-md mx-auto relative"
      onClick={onClick}
    >
      {/* Recipe Image */}
      <div className="relative h-48 w-full">
        {hasRecipeImage(recipe) ? (
          <Image
            src={getRecipeImageUrl(recipe)!}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 flex items-center justify-center">
            <span className="text-4xl">🍳</span>
          </div>
        )}

        {/* Remove from Favorites Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleRemoveFromFavorites}
          className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-8 h-8 z-10"
          disabled={removeFromFavoritesMutation.isPending}
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        {/* Favorite Icon (Always filled since it's in favorites) */}
        <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 rounded-full w-8 h-8 flex items-center justify-center">
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
        </div>
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
              <span>
                {recipe.servings} {t("recipe.servings")}
              </span>
            </div>
          )}
        </div>

        {/* Difficulty Level */}
        {recipe.difficulty_level && (
          <Badge
            className={`mb-3 w-fit ${getDifficultyColor(recipe.difficulty_level)}`}
          >
            {getDifficultyText(recipe.difficulty_level)}
          </Badge>
        )}

        {/* View Recipe Button and Like Button */}
        <div className="flex justify-between items-center mt-auto pt-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ThumbsUp className="w-4 h-4" />
            <span>{likesCount}</span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyUrl}
              className="text-xs px-2 py-1.5 h-8 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Copiar link da receita"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleLike}
              disabled={likeRecipeMutation.isPending || isLiked}
              className={`text-xs px-3 py-1.5 h-8 ${
                isLiked 
                  ? 'bg-orange-200 text-orange-800 border-orange-400 cursor-not-allowed dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-600' 
                  : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700'
              }`}
            >
              <ThumbsUp
                className={`w-3.5 h-3.5 mr-1.5 ${isLiked ? "fill-current" : ""}`}
              />
              {isLiked ? "Curtido" : "Curtir"}
            </Button>

            <Link href={`/recipe/${recipe.id}`}>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 h-8"
              >
                {t("recipe.view")}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


