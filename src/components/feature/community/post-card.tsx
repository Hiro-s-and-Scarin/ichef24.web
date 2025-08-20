"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Eye,
  Send,
  Calendar,
  Image as ImageIcon,
  User
} from "lucide-react"
import * as yup from "yup"
import { CommunityPost, PostComment } from "@/types/community"
import { usePostComments } from "@/network/hooks/community/useCommunity"
import { useLikeCommunityPost } from "@/network/hooks/community/useCommunity"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

// Schema para comentários
const commentSchema = yup.object({
  content: yup.string().required("Comentário é obrigatório").min(1, "Comentário deve ter pelo menos 1 caractere"),
})

type CommentFormData = yup.InferType<typeof commentSchema>

interface PostCardProps {
  post: CommunityPost
  onCreateComment: (postId: number, content: string) => Promise<void>
  onLikePost: (postId: number) => Promise<void>
}

export function PostCard({ post, onCreateComment, onLikePost }: PostCardProps) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  
  const { data: commentsData, isLoading: commentsLoading } = usePostComments(post.id)
  const comments = commentsData?.data || []

  const likePostMutation = useLikeCommunityPost()

  // Verificar se o usuário já deu like - sincronizar com backend
  useEffect(() => {
    if (user && post.user_is_liked) {
      const userHasLiked = post.user_is_liked.includes(Number(user.id))
      setIsLiked(userHasLiked)
    }
  }, [user, post.user_is_liked])

  // Sincronizar likes count com o post atualizado
  useEffect(() => {
    setLikesCount(post.likes_count || 0)
  }, [post.likes_count])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CommentFormData>({
    resolver: yupResolver(commentSchema)
  })

  const handleCommentSubmit = async (data: CommentFormData) => {
    setIsSubmittingComment(true)
    try {
      await onCreateComment(post.id, data.content)
      reset()
    } catch (error) {
      console.error("Erro ao criar comentário:", error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para curtir posts")
      return
    }

    // Verificar se já deu like
    if (isLiked) {
      toast.info("Você já curtiu este post")
      return
    }

    try {
      const result = await likePostMutation.mutateAsync(post.id)
      
      // Atualizar estado local com dados do backend
      if (result) {
        setIsLiked(true)
        setLikesCount(result.likes_count || likesCount + 1)
      }
    } catch (error) {
      console.error("Erro ao curtir post:", error)
      toast.error("Erro ao curtir post")
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

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.user?.avatar_url} alt={post.user?.name} />
            <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              {post.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {post.user?.name || 'Usuário'}
              </h3>
              {post.is_featured && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  Destaque
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.createdAt || new Date().toISOString())}
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

      <CardContent className="space-y-4">
        {/* Título e Conteúdo */}
        {post.title && (
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
            {post.title}
          </h4>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {post.content}
        </p>

        {/* Imagem do Post */}
        {post.image_url && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={post.image_url} 
              alt={post.title || 'Imagem do post'}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {post.recipe_tags && post.recipe_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.recipe_tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Estatísticas e Ações */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {post.views_count || 0}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {post.comments_count || 0}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {post.shares_count || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              disabled={likePostMutation.isPending}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Comentar</span>
            </Button>
          </div>
        </div>

        {/* Seção de Comentários */}
        {showComments && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <h5 className="font-semibold text-gray-800 dark:text-white">
              Comentários ({comments.length})
            </h5>
            
            {/* Formulário de Comentário */}
            <form onSubmit={handleSubmit(handleCommentSubmit)} className="flex gap-2">
              <Input
                {...register("content")}
                placeholder="Adicione um comentário..."
                className="flex-1"
                disabled={isSubmittingComment}
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={isSubmittingComment}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}

            {/* Lista de Comentários */}
            {commentsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment: PostComment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.user?.avatar_url} alt={comment.user?.name} />
                      <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs">
                        {comment.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-800 dark:text-white">
                          {comment.user?.name || 'Usuário'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt || new Date().toISOString())}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
