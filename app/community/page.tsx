"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { 
  MessageSquare, 
  Users, 
  ChefHat, 
  Plus,
  Search,
  X
} from "lucide-react"
import { useCommunityPosts, useCreateCommunityPost, useLikeCommunityPost } from "@/network/hooks/community/useCommunity"
import { useTopRecipes } from "@/network/hooks/recipes/useRecipes"
import { useUsers } from "@/network/hooks/users/useUsers"
import { CreateCommunityPostData } from "@/types/community"
import { toast } from "sonner"
import { CreatePostModal, PostCardCompact, TopChefCard, TopRecipeCard } from "@/components/feature/community"
import { Pagination } from "@/components/common/pagination"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/config/query-keys"
import { getTopChefs } from "@/network/actions/users/actionUsers"
import { useTranslation } from "react-i18next"

type CommunitySection = 'posts' | 'top-chefs' | 'top-recipes'

export default function Community() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState<CommunitySection>('posts')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  // Hooks para dados
  const { data: postsData, isLoading: postsLoading } = useCommunityPosts({ 
    page: currentPage, 
    limit: 6 
  })
  const { data: recipesData, isLoading: recipesLoading } = useTopRecipes()
  const { data: usersData, isLoading: usersLoading } = useUsers({ limit: 50 })
  const { data: topChefsData, isLoading: topChefsLoading } = useQuery({
    queryKey: queryKeys.community.topChefs,
    queryFn: async () => {
      const { getTopChefs } = await import("@/network/actions/users/actionUsers")
      return await getTopChefs()
    },
    staleTime: 1000 * 60 * 5,
  })
  

  
  // Hooks para mutações
  const createPostMutation = useCreateCommunityPost()

  const likePostMutation = useLikeCommunityPost()

  const posts = postsData?.data || []
  const recipes = recipesData?.data || []
  const users = usersData?.data || []
  const backendTopChefs = topChefsData || []

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

  // Processar dados do backend para top chefs
  const topChefs = useMemo(() => {
    if (!backendTopChefs || backendTopChefs.length === 0) return []
    
    // Agrupar receitas por usuário
    const chefsMap = new Map()
    
    backendTopChefs.forEach((item: any) => {
      const userId = item.user_id
      
      if (!chefsMap.has(userId)) {
        chefsMap.set(userId, {
          id: userId,
          user_id: userId,
          name: item.name,
          email: item.email,
          avatar_url: item.avatar_url,
          recipes: [],
          totalLikes: 0,
          recipeCount: 0
        })
      }
      
      const chef = chefsMap.get(userId)
      
      // Adicionar receita se existir
      if (item.recipe_id) {
        chef.recipes.push({
          id: item.recipe_id,
          title: item.recipe_title,
          image_url: item.recipe_image_url,
          description: item.recipe_description,
          likes_count: item.recipe_likes_count,
          created_at: item.recipe_created_at
        })
        chef.totalLikes += parseInt(item.recipe_likes_count || 0)
      }
    })
    
    // Converter para array e ordenar por total de curtidas
    const chefsArray = Array.from(chefsMap.values()).map(chef => ({
      ...chef,
      recipeCount: chef.recipes.length
    }))
    
    return chefsArray.sort((a, b) => b.totalLikes - a.totalLikes).slice(0, 3)
  }, [backendTopChefs])

  // Top receitas ordenadas por likes
  const topRecipes = recipes || []

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
    const section = searchParams.get('section') as CommunitySection
    const search = searchParams.get('search')
    
    if (section && ['posts', 'top-chefs', 'top-recipes'].includes(section)) {
      setActiveSection(section)
    }
    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

  const handleCreatePost = async (data: CreateCommunityPostData) => {
    try {
      await createPostMutation.mutateAsync(data)
      setIsCreatingPost(false)
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error(t("error.create.post"))
    }
  }



  const handleLikePost = async (postId: number) => {
    try {
      await likePostMutation.mutateAsync(postId)
    } catch (error) {
      console.error("Error liking post:", error)
      toast.error(t("error.like.post"))
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Resetar para primeira página quando pesquisar
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'posts':
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  {t("community.posts.title")}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {searchQuery.trim() 
                    ? `${filteredPosts.length} de ${postsData?.total || posts.length} posts`
                    : `${postsData?.total || posts.length} posts`
                  }
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={t("community.search.posts.placeholder")}
                    className="pl-10 pr-10 text-sm sm:text-base"
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
                  onClick={() => setIsCreatingPost(true)}
                  className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap text-sm sm:text-base"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {t("community.new.post")}
                </Button>
              </div>
            </div>
            
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t("common.loading")}</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {searchQuery ? t("community.posts.no.posts.search") : t("community.posts.no.posts")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchQuery 
                      ? t("community.posts.no.posts.search.desc", { query: searchQuery })
                      : t("community.posts.no.posts.desc")
                    }
                  </p>
                 
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredPosts.map((post) => (
                    <PostCardCompact
                      key={post.id}
                      post={post}
                      onLikePost={handleLikePost}
                    />
                  ))}
                </div>
                
                                {/* Paginação para posts */}
                {postsData && postsData.totalPages && postsData.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={postsData.totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 'top-chefs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {t("community.topChefs.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t("community.topChefs.subtitle")}
              </p>
            </div>
            
            {topChefsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t("common.loading")}</p>
              </div>
            ) : topChefs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {t("community.topChefs.no.chefs")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    {t("community.topChefs.no.chefs.desc")}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topChefs.map((chef: any, index: number) => (
                  <TopChefCard
                    key={chef.user_id || chef.id}
                    chef={chef}
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
                {t("community.trending.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t("community.top.recipes.subtitle")}
              </p>
            </div>
            
            {recipesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t("common.loading")}</p>
              </div>
            ) : topRecipes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {t("community.top.recipes.no.recipes")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("community.top.recipes.no.recipes.desc")}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topRecipes.map((recipe, index) => (
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-4">
              {t("community.title")}
            </h1>
            <p className="text-base sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("community.subtitle")}
            </p>
          </div>

          {/* Navegação das Seções */}
          <div className="flex justify-center">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 sm:p-2 border border-gray-200 dark:border-gray-700 w-full max-w-md">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant={activeSection === 'posts' ? 'default' : 'ghost'}
                  onClick={() => setActiveSection('posts')}
                  className={`text-sm sm:text-sm ${activeSection === 'posts' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                >
                  <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-2" />
                  {t("community.tabs.posts")}
                </Button>
                <Button
                  variant={activeSection === 'top-chefs' ? 'default' : 'ghost'}
                  onClick={() => setActiveSection('top-chefs')}
                  className={`text-sm sm:text-sm ${activeSection === 'top-chefs' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                >
                  <Users className="w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-2" />
                  {t("community.tabs.topChefs")}
                </Button>
                <Button
                  variant={activeSection === 'top-recipes' ? 'default' : 'ghost'}
                  onClick={() => setActiveSection('top-recipes')}
                  className={`text-sm sm:text-sm ${activeSection === 'top-recipes' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                >
                  <ChefHat className="w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-2" />
                  {t("community.tabs.topRecipes")}
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
        isOpen={isCreatingPost}
        onClose={() => setIsCreatingPost(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  )
}