"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { translateDynamicData } from "@/lib/config/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Users, Star, Eye, ThumbsUp, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { useAddToFavorites, useRemoveFromFavorites } from "@/network/hooks";
import { useLikeRecipe } from "@/network/hooks/recipes/useRecipes";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys";
import { getRecipeImageUrl, hasRecipeImage } from "@/lib/utils/recipe-image";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  isFavorite?: boolean;
}

export function RecipeCard({
  recipe,
  onClick,
  isFavorite: initialIsFavorite = false,
}: RecipeCardProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(recipe.likes_count || 0);

  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const likeRecipeMutation = useLikeRecipe();

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  useEffect(() => {
    if (user && recipe.user_is_liked) {
      const userHasLiked = recipe.user_is_liked.includes(Number(user.id));
      setIsLiked(userHasLiked);
    }
  }, [user, recipe.user_is_liked]);

  useEffect(() => {
    setLikesCount(recipe.likes_count || 0);
  }, [recipe.likes_count]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavoritesMutation.mutateAsync(String(recipe.id));
        setIsFavorite(false);
      } else {
        await addToFavoritesMutation.mutateAsync(String(recipe.id));
        setIsFavorite(true);
      }
      
      // Invalidar todas as queries relacionadas a favoritos
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.favorites,
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.user,
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.recipes.all,
        exact: false 
      });
    } catch (error) {
      toast.error("Erro ao alterar favoritos");
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error(t("recipe.like.login.required"));
      return;
    }

    if (isLiked) {
      toast.info("Você já curtiu esta receita");
      return;
    }

    try {
      const result = await likeRecipeMutation.mutateAsync(recipe.id);

      if (result) {
        setIsLiked(true);
        setLikesCount(result.likes_count || likesCount + 1);
      }
    } catch (error) {
      toast.error(t("recipe.like.error"));
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

  return (
    <Card
      className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col cursor-pointer min-h-[480px] w-full max-w-md mx-auto"
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

        {/* Favorite Button - Moved to left side */}
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite();
          }}
          disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
          className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full w-8 h-8"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400"}`}
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
              <span>{recipe.cooking_time} {t("recipe.time")}</span>
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
              disabled={isLiked}
              className={`text-xs px-3 py-1.5 h-8 ${isLiked ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-600" : "hover:bg-blue-50 dark:hover:bg-blue-900/30"}`}
            >
              <ThumbsUp
                className={`w-3.5 h-3.5 mr-1.5 ${isLiked ? "fill-current" : ""}`}
              />
                              {isLiked ? t("recipe.like.liked") : t("recipe.like.like")}
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
