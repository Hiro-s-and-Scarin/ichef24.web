"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  ChefHat,
  Copy,
} from "lucide-react";
import { CommunityPost } from "@/types/community";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

interface PostCardCompactProps {
  post: CommunityPost;
  onLikePost: (postId: number, isLiked: boolean) => Promise<void>;
}

export function PostCardCompact({ post, onLikePost }: PostCardCompactProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count || 0);

  useEffect(() => {
    if (user && post.user_is_liked) {
      const userHasLiked = post.user_is_liked.includes(Number(user.id));
      setIsLiked(userHasLiked);
    }
  }, [user, post.user_is_liked]);

  useEffect(() => {
    setLocalLikesCount(post.likes_count || 0);
  }, [post.likes_count]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Você precisa estar logado para curtir posts");
      return;
    }

    // Verificar se já deu like
    if (isLiked) {
      toast.info("Você já curtiu este post");
      return;
    }

    try {
      const newIsLiked = true;
      setIsLiked(newIsLiked);

      // Atualizar contador local imediatamente para feedback visual
      setLocalLikesCount((prev) => prev + 1);

      await onLikePost(post.id, newIsLiked);
    } catch (error) {
      toast.error("Erro ao curtir post");
      // Reverter o estado em caso de erro
      setIsLiked(false);
      setLocalLikesCount(post.likes_count || 0);
    }
  };

  const handleViewDetails = () => {
    router.push(`/community/post/${post.id}`);
  };

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const postUrl = `${window.location.origin}/community/post/${post.id}`;
    
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Link do post copiado para a área de transferência!");
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card
      className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={handleViewDetails}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.user?.avatar_url} alt={post.user?.name} />
            <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-sm">
              {post.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                {post.user?.name || "Usuário"}
              </h3>
              {post.is_featured && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs"
                >
                  Destaque
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.createdAt)}
              </div>

              {post.difficulty_level && (
                <Badge variant="outline" className="text-xs">
                  {post.difficulty_level}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Título */}
        {post.title && (
          <h4 className="font-semibold text-gray-800 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 break-words">
            {truncateText(post.title, 50)}
          </h4>
        )}

        {/* Conteúdo truncado */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 break-words overflow-hidden text-ellipsis max-w-full">
          {truncateText(post.content, 80)}
        </p>

        {/* Imagem do Post (se houver) */}
        {post.image_url && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title || "Imagem do post"}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        {/* Tags */}
        {post.recipe_tags && post.recipe_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.recipe_tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {truncateText(tag, 15)}
              </Badge>
            ))}
            {post.recipe_tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.recipe_tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Receita Vinculada */}
        {post.recipe && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/recipe/${post?.recipe?.id}`);
            }}
            className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <ChefHat className="w-4 h-4 text-green-600 dark:text-green-400" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-green-800 dark:text-green-200 truncate">
                Receita: {truncateText(post.recipe.title, 60)}
              </div>
              {post.recipe.description && (
                <div className="text-xs text-green-600 dark:text-green-400 truncate">
                  {truncateText(post.recipe.description, 80)}
                </div>
              )}
            </div>
            {post.recipe.image_url && (
              <img
                src={post.recipe.image_url}
                alt={post.recipe.title}
                className="w-8 h-8 rounded object-cover"
              />
            )}
          </div>
        )}

        {/* Estatísticas e Ações */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views_count || 0}
            </div>

            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {post.comments_count || 0}
            </div>

            <div className="flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              {post.shares_count || 0}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-1 p-2 h-8 ${
                isLiked
                  ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/20"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "text-red-500 fill-current" : "text-gray-500"}`}
              />
              <span className="text-xs">{localLikesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyUrl}
              className="flex items-center gap-1 p-2 h-8 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/20"
              title="Copiar link do post"
            >
              <Copy className="w-3 h-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex items-center gap-1 p-2 h-8 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ExternalLink className="w-3 h-3" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
