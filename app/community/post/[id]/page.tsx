"use client"

import { useState } from "react"
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
  ChefHat
} from "lucide-react"
import { useCommunityPost, usePostComments, useCreatePostComment } from "@/network/hooks/community/useCommunity"
import { toast } from "sonner"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  
  const [commentContent, setCommentContent] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  
  // Hooks para dados
  const { data: postData, isLoading: postLoading } = useCommunityPost(postId)
  const { data: commentsData, isLoading: commentsLoading } = usePostComments(postId)
  const createCommentMutation = useCreatePostComment()
  
  const post = postData
  const comments = commentsData?.data || []

  const handleGoBack = () => {
    router.push('/community')
  }

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return
    
    setIsSubmittingComment(true)
    try {
      await createCommentMutation.mutateAsync({ postId: parseInt(postId), content: commentContent })
      setCommentContent("")
      toast.success("Comentário adicionado com sucesso!")
    } catch (error) {
      console.error("Error creating comment:", error)
    } finally {
      setIsSubmittingComment(false)
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

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Post não encontrado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              O post que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={handleGoBack} className="bg-orange-500 hover:bg-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Comunidade
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
          {/* Header com botão voltar */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Comunidade
            </Button>
          </div>

          {/* Post Principal */}
          <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={post.user?.avatar_url} alt={post.user?.name} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-lg">
                    {post.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {post.user?.name || 'Usuário'}
                    </h1>
                    {post.is_featured && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                        Destaque
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.createdAt)}
                    </div>
                    
                    {post.difficulty_level && (
                      <Badge variant="outline">
                        {post.difficulty_level}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Título e Conteúdo */}
              {post.title && (
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {post.title}
                </h2>
              )}
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {post.content}
              </p>

              {/* Imagem do Post */}
              {post.image_url && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt={post.title || 'Imagem do post'}
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Receita Vinculada */}
              {post.recipe && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <ChefHat className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      Receita Vinculada
                    </h3>
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
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {post.views_count || 0} visualizações
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {post.comments_count || 0} comentários
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {post.shares_count || 0} compartilhamentos
                    </span>
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>

          {/* Seção de Comentários */}
          <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Comentários ({comments.length})
              </h3>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Formulário de Comentário */}
              <form onSubmit={handleCreateComment} className="flex gap-3">
                <Input
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="flex-1"
                  disabled={isSubmittingComment}
                />
                <Button 
                  type="submit" 
                  disabled={isSubmittingComment || !commentContent.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="w-4 h-4" />
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
                    Nenhum comentário ainda
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Seja o primeiro a comentar neste post!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {comments.map((comment: { id: number; user?: { name?: string; avatar_url?: string }; content: string; createdAt: string }) => (
                    <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.user?.avatar_url} alt={comment.user?.name} />
                        <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-sm">
                          {comment.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-800 dark:text-white">
                            {comment.user?.name || 'Usuário'}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
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
