"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  MessageSquare, 
  Share2, 
  Eye,
  Send,
  Calendar,
  ChefHat,
  ThumbsUp
} from "lucide-react"
import { useCommunityPost, usePostComments, useCreatePostComment } from "@/network/hooks/community/useCommunity"
import { useIncrementPostViews } from "@/network/hooks/community/useCommunity"
import { useLikeRecipe } from "@/network/hooks/recipes/useRecipes"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function PostDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  const queryClient = useQueryClient()
  
  const [commentContent, setCommentContent] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [viewsIncremented, setViewsIncremented] = useState(false)
  const [recipeLikesCount, setRecipeLikesCount] = useState(0)
  const [isRecipeLiked, setIsRecipeLiked] = useState(false)
  
  const { data: postData, isLoading: postLoading } = useCommunityPost(postId)
  const { data: commentsData, isLoading: commentsLoading } = usePostComments(postId)
  const createCommentMutation = useCreatePostComment()
  const incrementViewsMutation = useIncrementPostViews()
  const likeRecipeMutation = useLikeRecipe()
  const { user } = useAuth()
  
  const post = postData
  const comments = commentsData?.data || []

  useEffect(() => {
    if (post?.recipe) {
      setRecipeLikesCount(post.recipe.likes_count || 0)
      if (user && post.recipe.user_is_liked) {
        setIsRecipeLiked(post.recipe.user_is_liked.includes(Number(user.id)))
      }
    }
  }, [post?.recipe, user])

  useEffect(() => {
    if (postId && !viewsIncremented) {
      incrementViewsMutation.mutate(postId)
      setViewsIncremented(true)
    }
  }, [postId, viewsIncremented, incrementViewsMutation])

  const handleGoBack = () => {
    router.push('/community')
  }

  const handleLikeRecipe = async () => {
    if (!user) {
              toast.error(t("recipe.like.login.required"))
      return
    }

    if (!post?.recipe?.id) {
      toast.error(t("community.post.recipe.not.found"))
      return
    }

    if (isRecipeLiked) {
      toast.info(t("community.post.recipe.already.liked"))
      return
    }

    try {
      const result = await likeRecipeMutation.mutateAsync(post.recipe.id)
      
      if (result) {
        // Atualizar estado local
        setRecipeLikesCount(result.likes_count || recipeLikesCount + 1)
        setIsRecipeLiked(true)
        toast.success(t("community.post.recipe.liked.success"))
        

      }
    } catch (error) {
              toast.error(t("recipe.like.error"))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return
    
    setIsSubmittingComment(true)
    try {
      await createCommentMutation.mutateAsync({ postId: postId, content: commentContent })
      setCommentContent("")
      // O hook useCreatePostComment já faz a invalidação necessária

    } catch (error) {
      toast.error(t("community.post.comment.error"))
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">{t("common.loading")}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t("community.post.not.found")}</h1>
            <Button onClick={handleGoBack} className="bg-orange-500 hover:bg-orange-600">
              {t("community.post.back.to.community")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button 
              variant="ghost" 
              onClick={handleGoBack}
              className="p-2 sm:p-2 hover:bg-orange-100 dark:hover:bg-orange-900/20"
            >
              <ArrowLeft className="w-5 h-5 sm:w-5 sm:h-5" />
            </Button>
            <h1 className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
              {t("community.post.title")}
            </h1>
          </div>

          {/* Post Principal */}
          <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <CardHeader className="p-6 sm:p-6">
              <div className="space-y-4 sm:space-y-4">
                {/* Header do Post */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 sm:gap-4">
                    <Avatar className="w-12 h-12 sm:w-12 sm:h-12">
                      <AvatarImage src={post.user?.avatar_url} alt={post.user?.name} />
                      <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-lg sm:text-lg font-semibold">
                        {post.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-lg sm:text-lg">
                        {post.user?.name || t("community.post.user.default")}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-sm sm:text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 sm:w-4 sm:h-4" />
                        <span>{post?.createdAt ? formatDate(post.createdAt) : t("community.post.date.not.available")}</span>
                      </div>
                      
                      {post.difficulty_level && (
                        <Badge variant="secondary" className="mt-2 sm:mt-2 text-sm">
                          {post.difficulty_level}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Título e Conteúdo */}
              {post.title && (
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                  {post.title}
                </h2>
              )}
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                {post.content}
              </p>

              {/* Imagem do Post */}
              {post.image_url && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt={post.title || t("community.post.image.alt")}
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Receita Vinculada */}
              {post.recipe && (
                <div 
                  onClick={() => router.push(`/recipe/${post.recipe.id}`)}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <ChefHat className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                        {t("community.post.recipe.linked")}
                      </h3>
                    </div>
                    
                    {/* Botão de Like da Receita */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{recipeLikesCount}</span>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLikeRecipe}
                        disabled={likeRecipeMutation.isPending || isRecipeLiked}
                        className={`text-xs px-3 py-1.5 h-8 ${
                          isRecipeLiked 
                            ? 'bg-green-200 text-green-800 border-green-400 cursor-not-allowed' 
                            : 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 mr-1.5 ${isRecipeLiked ? 'fill-current' : ''}`} />
                        {isRecipeLiked ? t("recipe.like.liked") : t("recipe.like.like.recipe")}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    {post.recipe.image_url && (
                      <img 
                        src={post.recipe.image_url} 
                        alt={post.recipe.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 text-lg mb-2">
                        {post.recipe.title}
                      </h4>
                      {post.recipe.description && (
                        <p className="text-green-600 dark:text-green-400 text-sm leading-relaxed">
                          {post.recipe.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.recipe_tags && post.recipe_tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.recipe_tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Estatísticas e Ações */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {post.views_count || 0} {t("community.post.views")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {post.comments_count || 0} {t("community.post.comments")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {post.shares_count || 0} {t("community.post.shares")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção de Comentários */}
          <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <CardHeader className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Comentários ({comments.length})
              </h3>
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Formulário de Comentário */}
              <form onSubmit={handleCreateComment} className="flex gap-2 sm:gap-3">
                <Input
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder={t("community.post.add.comment.placeholder")}
                  className="flex-1 text-sm sm:text-base"
                  disabled={isSubmittingComment}
                />
                <Button 
                  type="submit" 
                  disabled={isSubmittingComment || !commentContent.trim()}
                  className="bg-orange-500 hover:bg-orange-600 px-3 sm:px-4"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </form>

              {/* Lista de Comentários */}
              {commentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {t("community.post.no.comments")}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("community.post.no.comments.desc")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {comments.map((comment: { id: number; user?: { name?: string; avatar_url?: string }; content: string; createdAt: string }) => (
                    <div key={comment.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                        <AvatarImage src={comment.user?.avatar_url} alt={comment.user?.name} />
                        <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs sm:text-sm">
                          {comment.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                          <span className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">
                            {comment.user?.name || t("community.post.user.default")}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
