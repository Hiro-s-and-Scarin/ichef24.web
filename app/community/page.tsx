"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ChefHat, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Star, 
  Clock, 
  Eye, 
  Crown, 
  TrendingUp,
  Search,
  Send
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Pagination } from "@/components/pagination"
import { useTranslation } from "react-i18next"

type TabType = "feed" | "top-chefs" | "trending"

// Estado consolidado para a página de comunidade
interface CommunityPageState {
  activeTab: TabType
  searchTerm: string
  currentPage: number
  showChatModal: boolean
  selectedPost: number | null
  chatMessage: string
  chatMessages: Array<{id: number, author: string, message: string, time: string}>
}

export default function CommunityPage() {
  const { t } = useTranslation()
  
  // Estado consolidado
  const [pageState, setPageState] = useState<CommunityPageState>({
    activeTab: "feed",
    searchTerm: "",
    currentPage: 1,
    showChatModal: false,
    selectedPost: null,
    chatMessage: "",
    chatMessages: []
  })

  // Desestruturação para facilitar o uso
  const { activeTab, searchTerm, currentPage, showChatModal, selectedPost, chatMessage, chatMessages } = pageState

  // Função helper para atualizar estado
  const updatePageState = (updates: Partial<CommunityPageState>) => {
    setPageState(prev => ({ ...prev, ...updates }))
  }

  const topChefs = [
    {
      id: 1,
      name: "Chef Isabella",
      specialty: "Culinária Italiana",
      followers: 1250,
      recipes: 45,
      badge: "Estrela Michelin",
      badgeIcon: <Star className="w-4 h-4" />,
      avatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop&crop=face",
      isFollowing: false
    },
    {
      id: 2,
      name: "Chef Roberto",
      specialty: "Culinária Brasileira",
      followers: 980,
      recipes: 38,
      badge: "Mestre Churrasqueiro",
      badgeIcon: <ChefHat className="w-4 h-4" />,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      isFollowing: false
    },
    {
      id: 3,
      name: "Chef Lucia",
      specialty: "Confeitaria",
      followers: 1500,
      recipes: 52,
      badge: "Rainha dos Doces",
      badgeIcon: <Crown className="w-4 h-4" />,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      isFollowing: true
    }
  ]

  const feedPosts = [
    {
      id: 1,
      author: "Chef Maria Silva",
      timeAgo: "2 horas atrás",
      difficulty: "Intermediário",
      description: "Acabei de preparar um risotto de camarão incrível! A dica é usar caldo de peixe caseiro.",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop&crop=center",
      likes: 24,
      comments: 8,
      recipeTag: "Risotto de Camarão"
    },
    {
      id: 2,
      author: "Carlos Gourmet",
      timeAgo: "4 horas atrás",
      difficulty: "Fácil",
      description: "Compartilhando minha receita secreta de brownie! O segredo está no chocolate meio amargo.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&crop=center",
      likes: 18,
      comments: 12,
      recipeTag: "Brownie Gourmet"
    },
    {
      id: 3,
      author: "Ana Confeiteira",
      timeAgo: "6 horas atrás",
      difficulty: "Avançado",
      description: "Macarons perfeitos! A chave é a temperatura do forno e o descanso da massa.",
      image: "https://images.unsplash.com/photo-1569864358640-9d1684040f43?w=400&h=300&fit=crop&crop=center",
      likes: 32,
      comments: 15,
      recipeTag: "Macarons Franceses"
    },
    {
      id: 4,
      author: "Chef Roberto",
      timeAgo: "8 horas atrás",
      difficulty: "Intermediário",
      description: "Pasta carbonara autêntica! O segredo está no guanciale e nos ovos frescos.",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
      likes: 45,
      comments: 20,
      recipeTag: "Pasta Carbonara"
    },
    {
      id: 5,
      author: "Chef Fernanda",
      timeAgo: "10 horas atrás",
      difficulty: "Fácil",
      description: "Brigadeiro gourmet com chocolate belga! Perfeito para sobremesas especiais.",
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop&crop=center",
      likes: 28,
      comments: 14,
      recipeTag: "Brigadeiro Gourmet"
    },
    {
      id: 6,
      author: "Chef Paulo",
      timeAgo: "12 horas atrás",
      difficulty: "Avançado",
      description: "Salmão grelhado com molho de ervas! Técnica perfeita para peixes.",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center",
      likes: 36,
      comments: 18,
      recipeTag: "Salmão Grelhado"
    },
    {
      id: 7,
      author: "Chef Isabella",
      timeAgo: "14 horas atrás",
      difficulty: "Intermediário",
      description: "Tiramisu clássico! A combinação perfeita de café e mascarpone.",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center",
      likes: 52,
      comments: 25,
      recipeTag: "Tiramisu Clássico"
    },
    {
      id: 8,
      author: "Chef Lucia",
      timeAgo: "16 horas atrás",
      difficulty: "Fácil",
      description: "Pão de queijo mineiro! Tradição brasileira em cada mordida.",
      image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop&crop=center",
      likes: 41,
      comments: 22,
      recipeTag: "Pão de Queijo"
    }
  ]

  const trendingRecipes = [
    {
      id: 1,
      title: "Pasta Carbonara Autêntica",
      author: "Chef Marco",
      rating: 4.8,
      time: "25 min",
      views: 2345,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop&crop=center",
      difficulty: "Intermediário"
    },
    {
      id: 2,
      title: "Brigadeiro Gourmet",
      author: "Chef Fernanda",
      rating: 4.9,
      time: "15 min",
      views: 1890,
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=300&h=200&fit=crop&crop=center",
      difficulty: "Fácil"
    },
    {
      id: 3,
      title: "Salmão Grelhado",
      author: "Chef Paulo",
      rating: 4.7,
      time: "20 min",
      views: 1567,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop&crop=center",
      difficulty: "Intermediário"
    }
  ]

  const handleFollowChef = (chefId: number) => {
    // Implementar lógica de seguir chef
    console.log(`Seguindo chef ${chefId}`)
  }

  const handleLikePost = (postId: number) => {
    // Implementar lógica de curtir post
    console.log(`Curtindo post ${postId}`)
  }

  const handleCommentPost = (postId: number) => {
    updatePageState({
      selectedPost: postId,
      showChatModal: true,
      chatMessages: [
        { id: 1, author: "Chef Maria Silva", message: "Que receita incrível! Vou tentar fazer.", time: "2 min atrás" },
        { id: 2, author: "Carlos Gourmet", message: "Adorei as dicas! Muito útil.", time: "5 min atrás" },
        { id: 3, author: "Ana Confeiteira", message: "Ficou perfeito! Parabéns!", time: "8 min atrás" }
      ]
    })
  }

  const handleSharePost = (postId: number) => {
    // Implementar lógica de compartilhar
    console.log(`Compartilhando post ${postId}`)
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        author: "Você",
        message: chatMessage,
        time: "Agora"
      }
      updatePageState({
        chatMessages: [...chatMessages, newMessage],
        chatMessage: ""
      })
    }
  }

  const postsPerPage = 4
  const totalPages = Math.ceil(feedPosts.length / postsPerPage)
  const currentPosts = feedPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                {t('community.title')}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('community.subtitle')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('community.search.placeholder')}
                value={searchTerm}
                onChange={(e) => updatePageState({ searchTerm: e.target.value })}
                className="pl-10 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300"
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
              <Button
                variant={activeTab === "feed" ? "default" : "ghost"}
                size="sm"
                onClick={() => updatePageState({ activeTab: "feed" })}
                className={`rounded-lg transition-all duration-300 ${
                  activeTab === "feed"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Feed
              </Button>
              <Button
                variant={activeTab === "top-chefs" ? "default" : "ghost"}
                size="sm"
                onClick={() => updatePageState({ activeTab: "top-chefs" })}
                className={`rounded-lg transition-all duration-300 ${
                  activeTab === "top-chefs"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
              >
                <ChefHat className="w-4 h-4 mr-2" />
                Top Chefs
              </Button>
              <Button
                variant={activeTab === "trending" ? "default" : "ghost"}
                size="sm"
                onClick={() => updatePageState({ activeTab: "trending" })}
                className={`rounded-lg transition-all duration-300 ${
                  activeTab === "trending"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('community.tabs.trending')}
              </Button>
              
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
                         {/* Feed Section */}
             {activeTab === "feed" && (
               <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                   Feed da Comunidade
                 </h2>
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentPosts.map((post) => (
                                              <Card key={post.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-orange-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                          <CardContent className="p-0">
                            {/* Post Image */}
                            <div className="relative h-40">
                              <Image
                                src={post.image}
                                alt={post.recipeTag}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700 text-xs">
                                  {post.difficulty}
                                </Badge>
                              </div>
                            </div>

                            {/* Post Content */}
                            <div className="p-4">
                              {/* Post Header */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                                  <ChefHat className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-white text-xs">{post.author}</h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{post.timeAgo}</p>
                                </div>
                              </div>

                              {/* Recipe Tag */}
                              <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 text-xs mb-2">
                                {post.recipeTag}
                              </Badge>

                              {/* Post Description */}
                              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed text-xs line-clamp-2">
                                {post.description}
                              </p>

                              {/* Interaction Buttons */}
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLikePost(post.id)}
                                    className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-xs p-1 h-auto"
                                  >
                                    <Heart className="w-3 h-3" />
                                    <span className="text-xs">{post.likes}</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCommentPost(post.id)}
                                    className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-xs p-1 h-auto"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span className="text-xs">{post.comments}</span>
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSharePost(post.id)}
                                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors text-xs p-1 h-auto"
                                >
                                  <Share2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>

                                   {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => updatePageState({ currentPage: page })}
                    className="mt-6"
                  />
               </div>
             )}

            {/* Top Chefs Section */}
            {activeTab === "top-chefs" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                  Top Chefs da Comunidade
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topChefs.map((chef) => (
                    <Card key={chef.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-orange-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6 text-center">
                                                 {/* Chef Avatar */}
                         <div className="relative mb-4">
                           <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-lg">
                             <Image
                               src={chef.avatar}
                               alt={chef.name}
                               width={80}
                               height={80}
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                             {chef.badgeIcon}
                           </div>
                         </div>

                        {/* Chef Info */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {chef.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {chef.specialty}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {chef.followers}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Seguidores
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {chef.recipes}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Receitas
                            </div>
                          </div>
                        </div>

                        {/* Badge */}
                        <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 mb-4">
                          <div className="flex items-center gap-1">
                            {chef.badgeIcon}
                            {chef.badge}
                          </div>
                        </Badge>

                        {/* Follow Button */}
                        <Button
                          onClick={() => handleFollowChef(chef.id)}
                          className={`w-full transition-all duration-300 ${
                            chef.isFollowing
                              ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                              : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg"
                          }`}
                        >
                          {chef.isFollowing ? "Seguindo" : "Seguir"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Recipes Section */}
            {activeTab === "trending" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                  Receitas em Alta
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingRecipes.map((recipe) => (
                    <Card key={recipe.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-orange-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                      <CardContent className="p-0">
                        {/* Recipe Image */}
                        <div className="relative h-48">
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700">
                              {recipe.difficulty}
                            </Badge>
                          </div>
                        </div>

                        {/* Recipe Info */}
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            por {recipe.author}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {recipe.rating}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {recipe.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {recipe.views.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* View Recipe Button */}
                          <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg transition-all duration-300">
                            Ver Receita
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            
                     </div>
         </div>
       </div>

               {/* Chat Modal */}
        {showChatModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col">
             {/* Modal Header */}
             <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                   <MessageCircle className="w-4 h-4 text-white" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-900 dark:text-white">Comentários</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Post #{selectedPost}</p>
                 </div>
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                                   onClick={() => updatePageState({ showChatModal: false })}
                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
               >
                 <X className="w-5 h-5" />
               </Button>
             </div>

                           {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {chatMessages.map((message) => (
                 <div key={message.id} className={`flex ${message.author === "Você" ? "justify-end" : "justify-start"}`}>
                   <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                     message.author === "Você"
                       ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                       : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                   }`}>
                     <div className="flex items-center gap-2 mb-1">
                       <span className="font-semibold text-sm">{message.author}</span>
                       <span className="text-xs opacity-70">{message.time}</span>
                     </div>
                     <p className="text-sm">{message.message}</p>
                   </div>
                 </div>
               ))}
             </div>

             {/* Message Input */}
             <div className="p-4 border-t border-gray-200 dark:border-gray-700">
               <div className="flex gap-2">
                 <Input
                   value={chatMessage}
                   onChange={(e) => updatePageState({ chatMessage: e.target.value })}
                   placeholder="Digite sua mensagem..."
                   className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                   onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                 />
                 <Button
                   onClick={handleSendMessage}
                   className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                 >
                   <Send className="w-4 h-4" />
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 } 