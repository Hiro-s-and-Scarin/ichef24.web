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
  Send,
  X
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Pagination } from "@/components/pagination"
import { useGetCommunityPosts, useGetTopChefs, useGetTrendingPosts, usePostCommunityMessage } from "@/network/hooks/users/useUsers"
import { useTranslation } from "react-i18next"

type TabType = "feed" | "top-chefs" | "trending"

interface CommunityPageState {
  activeTab: TabType
  searchTerm: string
  currentPage: number
  showChatModal: boolean
  selectedPost: any
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

  // TanStack Query hooks
  const { data: communityPosts, isLoading: postsLoading } = useGetCommunityPosts({
    page: currentPage,
    limit: 6,
    search: searchTerm,
    tab: activeTab
  })
  
  const { data: topChefsData, isLoading: chefsLoading } = useGetTopChefs()
  const { data: trendingPosts, isLoading: trendingLoading } = useGetTrendingPosts()
  const postMessage = usePostCommunityMessage()

  // Use real data from API or fallback to mock for development
  const topChefs = topChefsData || []
  const isLoading = postsLoading || chefsLoading || trendingLoading

  const mockFeedPosts = [
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
    }
  ]

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
  const feedPosts = activeTab === "feed" ? (communityPosts || mockFeedPosts) : 
                   activeTab === "trending" ? (trendingPosts || []) : 
                   (communityPosts || mockFeedPosts)
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
              <Users className="w-10 h-10 text-orange-600 dark:text-orange-400" />
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Comunidade iChef</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Conecte-se com outros apaixonados por culinária, compartilhe suas criações e descubra novos sabores
            </p>
            <div className="flex items-center justify-center gap-4">
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link href="/">Voltar ao Início</Link>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar na comunidade..."
                  value={searchTerm}
                  onChange={(e) => updatePageState({ searchTerm: e.target.value })}
                  className="pl-10 border-gray-200 dark:border-gray-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-2 border border-gray-200 dark:border-gray-700/50">
              <Button
                variant={activeTab === "feed" ? "default" : "ghost"}
                size="sm"
                onClick={() => updatePageState({ activeTab: "feed", currentPage: 1 })}
                className="px-6"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Feed
              </Button>
              <Button
                variant={activeTab === "top-chefs" ? "default" : "ghost"}
                size="sm"
                onClick={() => updatePageState({ activeTab: "top-chefs", currentPage: 1 })}
                className="px-6"
              >
                <Crown className="w-4 h-4 mr-2" />
                Top Chefs
              </Button>
              <Button
                variant={activeTab === "trending" ? "default" : "ghost"}
                size="sm"
                onClick={() => updatePageState({ activeTab: "trending", currentPage: 1 })}
                className="px-6"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Em Alta
              </Button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Carregando comunidade...</p>
                </div>
              </div>
            ) : (
              <>
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
                            <div className="relative h-40">
                              <Image
                                src={post.image}
                                alt={post.recipeTag}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-gray-800 dark:text-white text-sm">{post.author}</p>
                                <Badge variant="outline" className="text-xs">{post.difficulty}</Badge>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{post.description}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>{post.timeAgo}</span>
                                <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
                                  {post.recipeTag}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                    <Heart className="w-4 h-4 mr-1" />
                                    {post.likes}
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    {post.comments}
                                  </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-600">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Chefs Section */}
                {activeTab === "top-chefs" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                      Top Chefs da Comunidade
                    </h2>
                    {currentPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhum chef encontrado</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topChefs.map((chef: any) => (
                          <Card key={chef.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-orange-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                            <CardContent className="p-6 text-center space-y-4">
                              <div className="relative w-20 h-20 mx-auto">
                                <Image
                                  src={chef.avatar || "/placeholder.svg"}
                                  alt={chef.name}
                                  fill
                                  className="object-cover rounded-full border-4 border-orange-200 dark:border-orange-800"
                                />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 dark:text-white">{chef.name}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{chef.specialty}</p>
                              </div>
                              <div className="flex justify-center">
                                <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
                                  {chef.badgeIcon} {chef.badge}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <p className="font-bold text-gray-800 dark:text-white">{chef.followers}</p>
                                  <p className="text-xs text-gray-500">Seguidores</p>
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 dark:text-white">{chef.recipes}</p>
                                  <p className="text-xs text-gray-500">Receitas</p>
                                </div>
                              </div>
                              <Button
                                className={`w-full ${chef.isFollowing ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white'}`}
                                variant={chef.isFollowing ? "outline" : "default"}
                              >
                                {chef.isFollowing ? "Seguindo" : "Seguir"}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Trending Section */}
                {activeTab === "trending" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                      Receitas em Alta
                    </h2>
                    {currentPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhuma receita em alta no momento</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentPosts.map((recipe: any) => (
                          <Card key={recipe.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-orange-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative h-40">
                                <Image
                                  src={recipe.image}
                                  alt={recipe.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-4 space-y-3">
                                <h3 className="font-bold text-gray-800 dark:text-white">{recipe.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">por {recipe.author}</p>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-gray-600 dark:text-gray-300">{recipe.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600 dark:text-gray-300">{recipe.time}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600 dark:text-gray-300">{recipe.views}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="w-full justify-center">
                                  {recipe.difficulty}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updatePageState({ currentPage: page })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Chat - {selectedPost.recipeTag}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updatePageState({ showChatModal: false })}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.author === "Você" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.author === "Você" 
                      ? "bg-orange-500 text-white" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                  }`}>
                    <p className="font-medium text-sm">{message.author}</p>
                    <p>{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
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