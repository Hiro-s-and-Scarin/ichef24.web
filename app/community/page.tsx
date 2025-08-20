"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  MessageSquare, 
  Users, 
  ChefHat, 
  Heart, 
  Share2, 
  Eye,
  Plus,
  Send,
  Calendar,
  Star,
  Search,
  X
} from "lucide-react"
import { useCommunityPosts, useCreateCommunityPost, usePostComments, useCreatePostComment, useLikeCommunityPost } from "@/network/hooks/community/useCommunity"
import { useRecipes, useTopRecipes } from "@/network/hooks/recipes/useRecipes"
import { useUsers } from "@/network/hooks/users/useUsers"
import { getTopChefs } from "@/network/actions/users/actionUsers"
import { CreateCommunityPostData, CommunityPost } from "@/types/community"
import { Recipe } from "@/types/recipe"
import { toast } from "sonner"

// Dynamic imports para evitar problemas de hidratação
const CreatePostModal = dynamic(() => import("@/components/feature/community").then(mod => ({ default: mod.CreatePostModal })), { ssr: false })
const PostCardCompact = dynamic(() => import("@/components/feature/community").then(mod => ({ default: mod.PostCardCompact })), { ssr: false })
const TopChefCard = dynamic(() => import("@/components/feature/community").then(mod => ({ default: mod.TopChefCard })), { ssr: false })
const TopRecipeCard = dynamic(() => import("@/components/feature/community").then(mod => ({ default: mod.TopRecipeCard })), { ssr: false })

type CommunitySection = 'posts' | 'top-chefs' | 'top-recipes'

export default function Community() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<CommunitySection>('posts')
  const [searchQuery, setSearchQuery] = useState("")
  
  // Estado consolidado
  const [state, setState] = useState({
    isCreatingPost: false,
    topChefs: [] as any[],
    isLoadingTopChefs: false
  })
  
  // Hooks para dados
  const { data: postsData, isLoading: postsLoading } = useCommunityPosts()
  const { data: recipesData, isLoading: recipesLoading } = useRecipes({ sortBy: 'newest', limit: 50 })
  const { data: topRecipesData, isLoading: topRecipesLoading } = useTopRecipes()
  const { data: usersData, isLoading: usersLoading } = useUsers({ limit: 50 })

  // Hooks para mutações
  const createPostMutation = useCreateCommunityPost()
  const createCommentMutation = useCreatePostComment()
  const likePostMutation = useLikeCommunityPost()

  const posts = postsData?.data || []
  const recipes = recipesData?.data || []
  const topRecipes = topRecipesData?.data || []
  const users = usersData?.data || []



  // Filtrar posts por pesquisa
  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      (post.title && post.title.toLowerCase().includes(query)) ||
      post.content.toLowerCase().includes(query) ||
      (post.recipe_tags && post.recipe_tags.some(tag => tag.toLowerCase().includes(query)))
    )
  })

  // Top receitas ordenadas por likes
  const topRecipesSorted = topRecipes
    .sort((a: Recipe, b: Recipe) => b.likes_count - a.likes_count)
    .slice(0, 3)

  // Atualizar URL quando mudar seção ou pesquisa
  useEffect(() => {
    const params = new URLSearchParams()
    if (activeSection !== 'posts') params.set('section', activeSection)
    if (searchQuery.trim()) params.set('search', searchQuery.trim())
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/community${newUrl}`, { scroll: false })
  }, [activeSection, searchQuery, router])

  // Ler parâmetros da URL ao carregar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const section = urlParams.get('section') as CommunitySection
      const search = urlParams.get('search')
      
      if (section && ['posts', 'top-chefs', 'top-recipes'].includes(section)) {
        setActiveSection(section)
      }
      
      if (search) {
        setSearchQuery(search)
      }
    }
  }, [])

  // Buscar top chefs quando a seção for ativada
  useEffect(() => {
    if (activeSection === 'top-chefs') {
      setState(prev => ({ ...prev, isLoadingTopChefs: true }))
      getTopChefs()
        .then((data) => {
          if (data && Array.isArray(data)) {
            setState(prev => ({ ...prev, topChefs: data }))
          }
        })
        .catch((error) => {
          toast.error('Erro ao carregar top chefs')
        })
        .finally(() => {
          setState(prev => ({ ...prev, isLoadingTopChefs: false }))
        })
    }
  }, [activeSection])



  const handleCreatePost = async (data: CreateCommunityPostData) => {
    try {
      await createPostMutation.mutateAsync(data)
      setState(prev => ({ ...prev, isCreatingPost: false }))
    } catch (error) {
      toast.error("Erro ao criar post. Tente novamente.")
    }
  }

  const handleCreateComment = async (postId: number, content: string) => {
    try {
      await createCommentMutation.mutateAsync({ postId, content })
    } catch (error) {
      toast.error("Erro ao criar comentário")
    }
  }

  const handleLikePost = async (postId: number) => {
    try {
      await likePostMutation.mutateAsync(postId)
    } catch (error) {
      toast.error("Erro ao curtir post")
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'posts':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Posts da Comunidade
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredPosts.length} de {posts.length} posts
                </p>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Pesquisar posts..."
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <Button 
                  onClick={() => setState(prev => ({ ...prev, isCreatingPost: true }))}
                  className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Post
                </Button>
              </div>
            </div>
            
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {searchQuery ? 'Nenhum post encontrado' : 'Nenhum post ainda'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchQuery 
                      ? `Nenhum post encontrado para "${searchQuery}". Tente uma busca diferente.`
                      : 'Seja o primeiro a compartilhar algo com a comunidade!'
                    }
                  </p>
                 
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCardCompact
                    key={post.id}
                    post={post}
                    onLikePost={handleLikePost}
                  />
                ))}
              </div>
            )}
          </div>
        )

      case 'top-chefs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Top Chefs da Comunidade
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Chefs com as receitas mais curtidas
              </p>
            </div>
            
            {state.isLoadingTopChefs ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando chefs...</p>
              </div>
            ) : state.topChefs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Nenhum chef encontrado
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Ainda não há chefs com receitas na comunidade.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {state.topChefs.map((chef, index) => (
                  <TopChefCard
                    key={chef.user_id}
                    chef={{
                      id: chef.user_id,
                      name: chef.name || 'Chef',
                      email: chef.email,
                      avatar_url: chef.avatar_url,
                      totalLikes: parseInt(chef.totallikes) || 0,
                      recipeCount: parseInt(chef.recipecount) || 0
                    }}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )

      case 'top-recipes':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Top Receitas da Comunidade
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Receitas mais bem avaliadas e curtidas
              </p>
            </div>
            
            {topRecipesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando receitas...</p>
              </div>
            ) : topRecipesSorted.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Nenhuma receita encontrada
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Ainda não há receitas na comunidade.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {topRecipesSorted.map((recipe, index) => (
                  <TopRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      {(
        <>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  Comunidade iChef24
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Conecte-se com outros chefs, compartilhe experiências e descubra as melhores receitas da comunidade
                </p>
              </div>

              {/* Navegação das Seções */}
              <div className="flex justify-center">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Button
                      variant={activeSection === 'posts' ? 'default' : 'ghost'}
                      onClick={() => setActiveSection('posts')}
                      className={activeSection === 'posts' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Posts
                    </Button>
                    <Button
                      variant={activeSection === 'top-chefs' ? 'default' : 'ghost'}
                      onClick={() => setActiveSection('top-chefs')}
                      className={activeSection === 'top-chefs' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Top Chefs
                    </Button>
                    <Button
                      variant={activeSection === 'top-recipes' ? 'default' : 'ghost'}
                      onClick={() => setActiveSection('top-recipes')}
                      className={activeSection === 'top-recipes' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                    >
                      <ChefHat className="w-4 h-4 mr-2" />
                      Top Receitas
                    </Button>
                  </div>
                </div>
              </div>

              {/* Conteúdo da Seção */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                {renderSectionContent()}
              </div>
            </div>
          </div>

          {/* Modal de Criação de Post */}
          <CreatePostModal
            isOpen={state.isCreatingPost}
            onClose={() => setState(prev => ({ ...prev, isCreatingPost: false }))}
            onSubmit={handleCreatePost}
          />
        </>
      )}
    </div>
  )
}