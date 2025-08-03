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
import { Pagination } from "@/components/pagination"
import { useTranslation } from "react-i18next"
import { useGetCommunityPosts, useGetTopChefs, useGetTrendingPosts } from "@/network/hooks/users/useUsers"

type TabType = "feed" | "top-chefs" | "trending"

interface CommunityPageState {
  activeTab: TabType
  searchTerm: string
  currentPage: number
  showChatModal: boolean
  selectedPost: number | null
  chatMessage: string
  chatMessages: Array<{id: number, author: string, message: string, time: string}>
}

export function CommunityPageContent() {
  const { t } = useTranslation()
  const [state, setState] = useState<CommunityPageState>({
    activeTab: "feed",
    searchTerm: "",
    currentPage: 1,
    showChatModal: false,
    selectedPost: null,
    chatMessage: "",
    chatMessages: [
      { id: 1, author: "Chef Maria", message: "Que receita incrível! Vou tentar fazer.", time: "2 min atrás" },
      { id: 2, author: "João Silva", message: "Adorei as dicas! Muito útil.", time: "5 min atrás" },
      { id: 3, author: "Ana Santos", message: "Ficou perfeito! Parabéns!", time: "8 min atrás" }
    ]
  })

  // TanStack Query hooks
  const { data: communityPosts } = useGetCommunityPosts({})
  const { data: topChefsData } = useGetTopChefs()
  const { data: trendingData } = useGetTrendingPosts()

  const updateState = (updates: Partial<CommunityPageState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  // Mock data
  const mockTopChefs = [
    {
      id: 1,
      name: "Chef Isabella",
      specialty: "Culinária Italiana",
      followers: 1250,
      recipes: 45,
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=100&h=100&fit=crop&crop=face",
      badge: "⭐",
    },
    {
      id: 2,
      name: "Chef Roberto",
      specialty: "Culinária Brasileira",
      followers: 980,
      recipes: 38,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      badge: "👑",
    },
    {
      id: 3,
      name: "Chef Lucia",
      specialty: "Confeitaria",
      followers: 1500,
      recipes: 52,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      badge: "👨‍🍳",
    },
  ]

  const mockTrendingRecipes = [
    {
      id: 1,
      title: "Pasta Carbonara Autêntica",
      chef: "Chef Marco",
      time: "25 min",
      difficulty: "Intermediário",
      rating: 4.8,
      views: 2345,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d1e5?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Brigadeiro Gourmet",
      chef: "Chef Fernanda",
      time: "15 min",
      difficulty: "Fácil",
      rating: 4.9,
      views: 1890,
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Salmão Grelhado",
      chef: "Chef Paulo",
      time: "20 min",
      difficulty: "Intermediário",
      rating: 4.7,
      views: 1567,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    },
  ]

  const mockFeedPosts = [
    {
      id: 1,
      chef: {
        name: "Chef Maria Silva",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      },
      time: "2 horas atrás",
      recipe: "Risotto de Camarão",
      description: "Acabei de preparar um risotto de camarão incrível! A dica é adicionar o caldo aos poucos e não parar de mexer.",
      likes: 24,
      comments: 8,
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      chef: {
        name: "Carlos Gourmet",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      },
      time: "4 horas atrás",
      recipe: "Brownie Gourmet",
      description: "Compartilhando minha receita secreta de brownie! O segredo está no chocolate meio amargo.",
      likes: 18,
      comments: 12,
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      chef: {
        name: "Ana Confeiteira",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      },
      time: "6 horas atrás",
      recipe: "Macarons Franceses",
      description: "Macarons perfeitos! A chave é a temperatura do forno e o descanso da massa.",
      likes: 32,
      comments: 15,
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
    },
    {
      id: 4,
      chef: {
        name: "Chef Roberto",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      },
      time: "8 horas atrás",
      recipe: "Pasta Carbonara",
      description: "Pasta Carbonara autêntica! O segredo está no guanciale e nos ovos frescos.",
      likes: 45,
      comments: 20,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d1e5?w=600&h=400&fit=crop",
    },
  ]

  // Use API data or fallback to mock
  const topChefs = topChefsData || mockTopChefs
  const trendingRecipes = trendingData || mockTrendingRecipes
  const feedPosts = communityPosts || mockFeedPosts

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Intermediário":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "Avançado":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const openChat = (postId: number) => {
    updateState({ showChatModal: true, selectedPost: postId })
  }

  const closeChat = () => {
    updateState({ showChatModal: false, selectedPost: null, chatMessage: "" })
  }

  const sendMessage = () => {
    if (state.chatMessage.trim()) {
      const newMessage = {
        id: state.chatMessages.length + 1,
        author: "Você",
        message: state.chatMessage,
        time: "agora"
      }
      updateState({
        chatMessages: [newMessage, ...state.chatMessages],
        chatMessage: ""
      })
    }
  }

  const itemsPerPage = 6
  const totalPages = Math.ceil(feedPosts.length / itemsPerPage)
  const currentItems = feedPosts.slice(
    (state.currentPage - 1) * itemsPerPage,
    state.currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-orange-500 rounded-full p-3 mr-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                Comunidade iChef24
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Conecte-se com outros apaixonados por culinária, compartilhe receitas e aprenda juntos
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/">Voltar ao Início</Link>
              </Button>
            </div>
          </div>



          {/* Tabs */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-center">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {[
                    { id: "feed", label: "Feed", icon: MessageCircle },
                    { id: "top-chefs", label: "Top Chefs", icon: Users },
                    { id: "trending", label: "Em Alta", icon: TrendingUp },
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <Button
                        key={tab.id}
                        variant={state.activeTab === tab.id ? "default" : "ghost"}
                        className={`flex items-center space-x-2 ${
                          state.activeTab === tab.id
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "text-gray-600 dark:text-gray-300 hover:text-orange-500"
                        }`}
                        onClick={() => updateState({ activeTab: tab.id as TabType, currentPage: 1 })}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {state.activeTab === "feed" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((post) => (
                  <Card key={post.id} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.recipe}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <Image
                          src={post.chef.image}
                          alt={post.chef.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-800 dark:text-white">{post.chef.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{post.time}</p>
                        </div>
                      </div>
                      <Badge className="mb-3">{post.recipe}</Badge>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{post.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button 
                            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                            onClick={() => openChat(post.id)}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                        </div>
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={state.currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => updateState({ currentPage: page })}
                  />
                </div>
              )}
            </div>
          )}

          {state.activeTab === "top-chefs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topChefs.map((chef) => (
                <Card key={chef.id} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm text-center p-6">
                  <div className="relative mb-4">
                    <Image
                      src={chef.image}
                      alt={chef.name}
                      width={80}
                      height={80}
                      className="rounded-full mx-auto object-cover"
                    />
                    <div className="absolute -top-2 -right-2 text-2xl">{chef.badge}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{chef.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{chef.specialty}</p>
                  <div className="flex justify-around">
                    <div>
                      <p className="text-xl font-bold text-orange-500">{chef.followers}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Seguidores</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-orange-500">{chef.recipes}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receitas</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {state.activeTab === "trending" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingRecipes.map((recipe) => (
                <Card key={recipe.id} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className={`absolute top-2 right-2 ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{recipe.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">por {recipe.chef}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{recipe.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{recipe.views}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Chat Modal - Elegante e Maior */}
          {state.showChatModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-orange-600">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white">Comentários</h3>
                      <p className="text-orange-100 text-sm">Post #{state.selectedPost}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={closeChat}
                    className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                  >
                    <span className="text-xl">×</span>
                  </Button>
                </div>

                {/* Messages */}
                <div className="p-6 max-h-96 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900/50">
                  {state.chatMessages.map((msg) => (
                    <div key={msg.id} className="flex space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {msg.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-800 dark:text-white text-sm">{msg.author}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{msg.time}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      V
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={state.chatMessage}
                        onChange={(e) => updateState({ chatMessage: e.target.value })}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <Button 
                        onClick={sendMessage} 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-6 py-3 shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}